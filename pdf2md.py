#!/usr/bin/env python3
"""Convert handwritten PDFs or images to Markdown with LaTeX formulas using various Vision APIs."""

import logging
import os
import sys
from pathlib import Path
from typing import List, Optional
import argparse
from abc import ABC, abstractmethod
import base64

import fitz
from openai import OpenAI
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(levelname)s: %(message)s'
)
logger = logging.getLogger(__name__)

PROMPT_EN = (
    "Transcribe this handwritten content into Markdown format:\n"
    "1. Preserve all text and numbers exactly\n"
    "2. Use LaTeX for math: inline with $...$, block with $$...$$\n"
    "3. Keep document structure (headings, paragraphs, lists)\n"
    "4. Output only the Markdown, no extra commentary"
)

PROMPT_ZH = (
    "请识别这张手写内容并转换为Markdown格式。要求：\n"
    "1. 完整保留所有文字、数字和符号。\n"
    "2. 数学公式必须使用 LaTeX 格式：行内公式用 $...$，独立公式块用 $$...$$\n"
    "3. 特别注意：识别并还原手写笔记中的数学公式（如积分、求和、矩阵等），确保符合 LaTeX 语法。\n"
    "4. 注意细节：准确区分手写中的撇号（'）、上标（次方）与乘法点（·），避免混淆。\n"
    "5. 保留文档层次结构（标题、段落、列表等）。\n"
    "6. 直接输出 Markdown 内容，不要添加任何额外解释、说明或代码块标记（如 ```markdown）。"
)


def pdf_to_images(pdf_path: str, dpi: int = 200) -> List[bytes]:
    """Extract PDF pages as PNG images.

    Args:
        pdf_path: Path to PDF file
        dpi: Resolution for rendering (default 200)

    Returns:
        List of PNG image bytes, one per page

    Raises:
        FileNotFoundError: If PDF file not found
        Exception: If PDF cannot be opened
    """
    pdf_path = Path(pdf_path)
    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    logger.info(f"Opening PDF: {pdf_path}")
    doc = fitz.open(pdf_path)
    images = []

    logger.info(f"Extracting {len(doc)} pages...")
    for page_num, page in enumerate(doc, 1):
        pix = page.get_pixmap(dpi=dpi)
        img_bytes = pix.tobytes("png")
        images.append(img_bytes)
        logger.info(f"  Extracted page {page_num}/{len(doc)}")

    doc.close()
    return images


class VisionProvider(ABC):
    """Abstract base class for vision model providers."""

    def __init__(self):
        self.total_prompt_tokens = 0
        self.total_completion_tokens = 0

    @abstractmethod
    def recognize_page(self, image_bytes: bytes, page_num: int) -> Optional[str]:
        """Recognize handwritten content on a page."""
        pass

    def get_token_summary(self) -> str:
        """Get a summary of token usage."""
        total = self.total_prompt_tokens + self.total_completion_tokens
        return f"Prompt: {self.total_prompt_tokens}, Completion: {self.total_completion_tokens}, Total: {total}"


class OpenAICompatibleProvider(VisionProvider):
    """Provider for OpenAI-compatible APIs (OpenAI, Gemini, Qwen)."""

    def __init__(self, api_key: str, model: str, base_url: str, use_zh: bool = False):
        super().__init__()
        self.client = OpenAI(api_key=api_key, base_url=base_url)
        self.model = model
        self.prompt = PROMPT_ZH if use_zh else PROMPT_EN

    def recognize_page(self, image_bytes: bytes, page_num: int) -> Optional[str]:
        try:
            image_b64 = base64.b64encode(image_bytes).decode('utf-8')

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/png;base64,{image_b64}"
                                }
                            },
                            {
                                "type": "text",
                                "text": self.prompt
                            }
                        ]
                    }
                ]
            )

            markdown_content = response.choices[0].message.content

            # Log token usage and accumulate
            if hasattr(response, 'usage'):
                prompt_tokens = getattr(response.usage, 'prompt_tokens', 0)
                completion_tokens = getattr(response.usage, 'completion_tokens', 0)
                total_tokens = getattr(response.usage, 'total_tokens', prompt_tokens + completion_tokens)
                self.total_prompt_tokens += prompt_tokens
                self.total_completion_tokens += completion_tokens
                logger.info(f"  Page {page_num} - Tokens: prompt={prompt_tokens}, completion={completion_tokens}, total={total_tokens}")

            logger.info(f"  Recognized page {page_num}")
            return markdown_content

        except Exception as e:
            logger.warning(f"  Failed to recognize page {page_num}: {e}")
            return None


class AnthropicProvider(VisionProvider):
    """Provider for Claude (Anthropic API)."""

    def __init__(self, api_key: str, model: str, use_zh: bool = False):
        super().__init__()
        self.client = Anthropic(api_key=api_key)
        self.model = model
        self.prompt = PROMPT_ZH if use_zh else PROMPT_EN

    def recognize_page(self, image_bytes: bytes, page_num: int) -> Optional[str]:
        try:
            image_b64 = base64.b64encode(image_bytes).decode('utf-8')

            message = self.client.messages.create(
                model=self.model,
                max_tokens=4096,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": "image/png",
                                    "data": image_b64,
                                },
                            },
                            {
                                "type": "text",
                                "text": self.prompt
                            }
                        ],
                    }
                ],
            )

            # Log token usage and accumulate
            if hasattr(message, 'usage'):
                input_tokens = getattr(message.usage, 'input_tokens', 0)
                output_tokens = getattr(message.usage, 'output_tokens', 0)
                total_tokens = input_tokens + output_tokens
                self.total_prompt_tokens += input_tokens
                self.total_completion_tokens += output_tokens
                logger.info(f"  Page {page_num} - Tokens: input={input_tokens}, output={output_tokens}, total={total_tokens}")

            # Extract text from response
            for block in message.content:
                text = getattr(block, 'text', None)
                if text is not None:
                    logger.info(f"  Recognized page {page_num}")
                    return text

            logger.warning(f"  No text content in response for page {page_num}")
            return None

        except Exception as e:
            logger.warning(f"  Failed to recognize page {page_num}: {e}")
            return None


# Provider configurations
PROVIDER_CONFIGS = {
    'openai': {
        'base_url': 'https://api.openai.com/v1',
        'default_model': 'gpt-5.4-mini',
        'env_key': 'OPENAI_API_KEY',
        'class': OpenAICompatibleProvider,
        'use_zh': False
    },
    'gemini': {
        'base_url': 'https://generativelanguage.googleapis.com/v1beta/openai/',
        'default_model': 'gemini-2.0-flash',
        'env_key': 'GOOGLE_API_KEY',
        'class': OpenAICompatibleProvider,
        'use_zh': False
    },
    'qwen': {
        'base_url': 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        'default_model': 'qwen-vl-max',
        'env_key': 'DASHSCOPE_API_KEY',
        'class': OpenAICompatibleProvider,
        'use_zh': True
    },
    'claude': {
        'default_model': 'claude-haiku-4-5-20251001',
        'env_key': 'ANTHROPIC_API_KEY',
        'class': AnthropicProvider,
        'use_zh': False
    }
}


def convert_to_md(
    input_path: str,
    output_path: str,
    provider: str,
    api_key: str,
    model: Optional[str] = None,
    dpi: int = 200
) -> None:
    """Main conversion flow: PDF/Image -> Vision API -> Markdown."""

    if provider not in PROVIDER_CONFIGS:
        raise ValueError(f"Unknown provider: {provider}. Available: {', '.join(PROVIDER_CONFIGS.keys())}")

    config = PROVIDER_CONFIGS[provider]

    # Use provided model or default
    if model is None:
        model = config['default_model']

    # Create provider instance
    if provider == 'claude':
        vision_provider = config['class'](api_key=api_key, model=model, use_zh=config['use_zh'])
    else:
        vision_provider = config['class'](
            api_key=api_key,
            model=model,
            base_url=config['base_url'],
            use_zh=config['use_zh']
        )

    input_path_obj = Path(input_path)
    if input_path_obj.suffix.lower() == '.pdf':
        images = pdf_to_images(input_path, dpi=dpi)
    elif input_path_obj.suffix.lower() in ['.png', '.jpg', '.jpeg', '.webp']:
        with open(input_path, 'rb') as f:
            images = [f.read()]
    else:
        raise ValueError(f"Unsupported file format: {input_path_obj.suffix}")

    # Process each page/image
    markdown_parts = []
    successful_pages = 0
    failed_pages = []

    logger.info(f"Processing {len(images)} page(s) with {provider.upper()} API...")
    for page_num, image_bytes in enumerate(images, 1):
        markdown_content = vision_provider.recognize_page(image_bytes, page_num)

        if markdown_content is None:
            failed_pages.append(page_num)
            markdown_parts.append(f"[Page {page_num} - Recognition failed]")
        else:
            successful_pages += 1
            markdown_parts.append(markdown_content)

    full_markdown = "\n\n---\n\n".join(markdown_parts)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(full_markdown)

    logger.info(f"Conversion complete: {successful_pages} successful, {len(failed_pages)} failed")
    if failed_pages:
        logger.warning(f"Failed pages: {failed_pages}")

    # Print token summary
    logger.info(f"Token usage summary: {vision_provider.get_token_summary()}")
    logger.info(f"Output saved to: {output_path}")


def main():
    """CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Convert handwritten PDF to Markdown using Vision APIs"
    )
    parser.add_argument('pdf_path', help='Path to input PDF or image file')
    parser.add_argument(
        '--output', '-o',
        help='Output Markdown file path (default: same as input with .md extension)'
    )
    parser.add_argument(
        '--provider', '-p',
        default='qwen',
        choices=['openai', 'claude', 'gemini', 'qwen'],
        help='Vision model provider (default: qwen)'
    )
    parser.add_argument(
        '--model', '-m',
        help='Model name (default: provider-specific)'
    )
    parser.add_argument(
        '--dpi',
        type=int,
        default=200,
        help='DPI for PDF rendering (default: 200)'
    )
    parser.add_argument(
        '--api-key', '-k',
        help='API key (default: from env var based on provider)'
    )

    args = parser.parse_args()

    # Determine output path
    if args.output:
        output_path = str(args.output)
    else:
        input_path = Path(args.pdf_path)
        output_path = str(input_path.with_suffix('.md'))

    # Get API key
    config = PROVIDER_CONFIGS[args.provider]
    api_key = args.api_key or os.getenv(config['env_key'])
    if not api_key:
        env_key = config['env_key']
        logger.error(f"API key not provided. Set {env_key} env var or use --api-key")
        sys.exit(1)

    # Run conversion
    try:
        convert_to_md(
            args.pdf_path,
            output_path,
            provider=args.provider,
            api_key=api_key,
            model=args.model,
            dpi=args.dpi
        )
    except Exception as e:
        logger.error(f"Conversion failed: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
