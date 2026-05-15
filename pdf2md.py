#!/usr/bin/env python3
"""Convert handwritten PDFs or images to Markdown with LaTeX formulas using Qwen Vision API."""

import logging
import os
import sys
from pathlib import Path
from typing import List, Optional
import argparse
import io

import fitz
from openai import OpenAI
from PIL import Image
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(levelname)s: %(message)s'
)
logger = logging.getLogger(__name__)


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


def recognize_page(client: OpenAI, image_bytes: bytes, page_num: int) -> Optional[str]:
    """Recognize handwritten content on a page using Qwen Vision API.

    Args:
        client: OpenAI client instance
        image_bytes: PNG image bytes
        page_num: Page number (for logging)

    Returns:
        Recognized Markdown string, or None if recognition failed
    """
    try:
        import base64
        image_b64 = base64.b64encode(image_bytes).decode('utf-8')

        response = client.chat.completions.create(
            model="qwen-vl-max",
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
                            "text": (
                                "请识别这张手写内容并转换为Markdown格式。要求：\n"
                                "1. 完整保留所有文字、数字和符号。\n"
                                "2. 数学公式必须使用 LaTeX 格式：行内公式用 $...$，独立公式块用 $$...$$\n"
                                "3. 特别注意：识别并还原手写笔记中的数学公式（如积分、求和、矩阵等），确保符合 LaTeX 语法。\n"
                                "4. 注意细节：准确区分手写中的撇号（'）、上标（次方）与乘法点（·），避免混淆。\n"
                                "5. 保留文档层次结构（标题、段落、列表等）。\n"
                                "6. 直接输出 Markdown 内容，不要添加任何额外解释、说明或代码块标记（如 ```markdown）。"
                            )
                        }
                    ]
                }
            ]
        )

        markdown_content = response.choices[0].message.content
        logger.info(f"  Recognized page {page_num}")
        return markdown_content

    except Exception as e:
        logger.warning(f"  Failed to recognize page {page_num}: {e}")
        return None


def convert_to_md(
    input_path: str,
    output_path: str,
    api_key: str,
    model: str = "qwen-vl-max",
    dpi: int = 200
) -> None:
    """Main conversion flow: PDF/Image -> Qwen API -> Markdown.
    """
    client = OpenAI(
        api_key=api_key,
        base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
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

    logger.info(f"Processing {len(images)} page(s) with Qwen API...")
    for page_num, image_bytes in enumerate(images, 1):
        markdown_content = recognize_page(client, image_bytes, page_num)

        if markdown_content is None:
            failed_pages.append(page_num)
            markdown_parts.append(f"[页{page_num} - 识别失败]")
        else:
            successful_pages += 1
            markdown_parts.append(markdown_content)

    full_markdown = "\n\n---\n\n".join(markdown_parts)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(full_markdown)

    logger.info(f"Conversion complete: {successful_pages} successful, {len(failed_pages)} failed")
    if failed_pages:
        logger.warning(f"Failed pages: {failed_pages}")
    logger.info(f"Output saved to: {output_path}")


def main():
    """CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Convert handwritten PDF to Markdown using Qwen Vision API"
    )
    parser.add_argument('pdf_path', help='Path to input PDF file')
    parser.add_argument(
        '--output', '-o',
        help='Output Markdown file path (default: same as PDF with .md extension)'
    )
    parser.add_argument(
        '--model', '-m',
        default='qwen-vl-max',
        help='Model name (default: qwen-vl-max)'
    )
    parser.add_argument(
        '--dpi',
        type=int,
        default=200,
        help='DPI for PDF rendering (default: 200)'
    )
    parser.add_argument(
        '--api-key', '-k',
        help='Dashscope API key (default: DASHSCOPE_API_KEY env var)'
    )

    args = parser.parse_args()

    # Determine output path
    if args.output:
        output_path = args.output
    else:
        pdf_path = Path(args.pdf_path)
        output_path = pdf_path.with_suffix('.md')

    # Get API key
    api_key = args.api_key or os.getenv('DASHSCOPE_API_KEY')
    if not api_key:
        logger.error("API key not provided. Set DASHSCOPE_API_KEY env var or use --api-key")
        sys.exit(1)

    # Run conversion
    try:
        convert_to_md(args.pdf_path, output_path, api_key, args.model, args.dpi)
    except Exception as e:
        logger.error(f"Conversion failed: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
