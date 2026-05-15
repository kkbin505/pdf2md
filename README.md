# pdf2md

A tool that converts handwritten notes into Markdown with LaTeX formulas using multiple vision APIs (OpenAI, Claude, Gemini, Qwen).

**[中文文档](README_zh.md)** | **English**

---

## 🎯 Core Insight

**Modern multimodal LLMs have elegantly solved the handwritten formula recognition problem.**

Real-world testing shows that Qwen achieves this at just **¥0.00345 per page** — or **3 pages for one Chinese cent**. This means:
- 💰 **Cost is no longer a bottleneck** — transformed from "premium tool" to "everyday utility"
- 🎯 **Accuracy is satisfactory** — complex formulas convert accurately to LaTeX
- 🚀 **Choices abound** — OpenAI, Claude, Gemini, and Qwen all work well

This project showcases the practical application of this technological breakthrough. Hoping to help students and researchers handle handwritten notes elegantly.

---

## 📖 Background

While studying control theory, I fell in love with the handwriting experience of the **iFlytek Smart Notebook**. However, when it came to organizing my notes in **Obsidian**, I hit a wall: the native OCR was terrible at recognizing mathematical formulas.

I developed this script to solve that problem. By leveraging **Qwen-VL**, it offers:
- **Accurate Mixed Recognition**: Seamlessly handles mixtures of text and complex formulas.
- **Cost-Effective**: High-quality recognition at a fraction of the cost of other multimodal models.
- **Obsidian-Ready**: A smooth workflow from Hand-drawn PDF -> Markdown -> Obsidian.

## 🚀 The Problem

Handwritten note-taking devices like **iFlytek Smart Notebooks** often struggle with **complex mathematical formulas** and mixed formatting in their native OCR software.

This tool is designed to bridge that gap:
1.  **High-Precision Formula Recognition**: Leverages `qwen-vl-max` to accurately identify complex handwritten math and convert it into standard LaTeX.
2.  **PDF Workflow**: Seamlessly processes multi-page PDF exports from your digital notebooks.
3.  **Cost-Effective**: Uses the DashScope API, making each page recognition cost only a few cents.

## ✨ Features

-   ✅ **Multi-Provider Support**: Works with OpenAI (GPT-4o), Claude, Google Gemini, and Alibaba Qwen.
-   ✅ **PDF to Markdown**: Automatically extracts pages and recognizes content.
-   ✅ **LaTeX Support**: Inline formulas `$ ... $` and block formulas `$$ ... $$`.
-   ✅ **Layout Preservation**: Maintains headers, lists, and paragraph structures.
-   ✅ **Flexible Configuration**: Choose different models and providers based on your needs.

## 🛠️ Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/kkbin505/pdf2md.git
    cd pdf2md
    ```

2.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configure API Keys**:
    Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
    
    Edit `.env` and add your API keys (you can add one or multiple):
    ```env
    OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
    ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
    GOOGLE_API_KEY=AIzaSyxxxxxxxxxxxxxx
    DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxx
    ```
    
    Get your keys from:
    - **OpenAI**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
    - **Claude**: [console.anthropic.com](https://console.anthropic.com)
    - **Gemini**: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
    - **Qwen**: [DashScope Console](https://dashscope.console.aliyun.com/apiKey)

## 📖 Usage

### Basic Usage (Default: Qwen)
```bash
python pdf2md.py your_notes.pdf
```

### Using Different Providers
```bash
# OpenAI (GPT-4o)
python pdf2md.py your_notes.pdf --provider openai

# Claude (Anthropic)
python pdf2md.py your_notes.pdf --provider claude

# Google Gemini
python pdf2md.py your_notes.pdf --provider gemini

# Alibaba Qwen (default)
python pdf2md.py your_notes.pdf --provider qwen
```

### Advanced Options
- `--provider`, `-p`: Choose provider (`openai`, `claude`, `gemini`, `qwen`, default: `qwen`)
- `--model`, `-m`: Specify model name (uses provider defaults if not specified)
- `--output`, `-o`: Specify the output file path (default: same as input with `.md` extension)
- `--dpi`: Set PDF rendering resolution (default: 200, higher DPI = better recognition but slower)
- `--api-key`, `-k`: Provide API key directly (or use environment variables)

### Examples
```bash
# Use Claude with Sonnet, high resolution
python pdf2md.py notes.pdf --provider claude --model claude-3-5-sonnet-20241022 --dpi 300

# Use OpenAI, specify output file
python pdf2md.py notes.pdf --provider openai -o output.md

# Use Gemini, provide API key directly
python pdf2md.py notes.pdf --provider gemini --api-key AIzaSyxxxxxxxxxxxxxx
```

### Model Comparison & Actual Test Results

#### 🧪 A4 Handwritten Notes Test Data (2 pages of Scratch.pdf)
| Provider | Model | Input/Output | Quality | **Cost/Page** | Rating |
|---|---|---|---|---|---|
| **Gemini** 🏆 | gemini-2.5-flash | 638/552 | Excellent | **$0** (Free) | ⭐⭐⭐⭐⭐ |
| **Qwen** | qwen-vl-max | 2824/589 | Excellent | **$0.00048** | ⭐⭐⭐⭐⭐ |
| **Claude** | claude-haiku-4-5-20251001 | 3156/629 | Excellent | **$0.00315** | ⭐⭐⭐⭐ |
| **OpenAI** | gpt-5.4-mini | 5550/566 | Excellent | **$0.00335** | ⭐⭐⭐⭐ |
| **iFlytek** | Spark | - | Poor | **$0** (Free) | ⭐ |

#### 💡 Recommendation Guide
| Priority | Recommended | Cost/Page | Reason |
|---|---|---|---|
| **1️⃣ First Choice** | Gemini | $0 | Completely free, excellent recognition, just manage quota |
| **2️⃣ China Users** | Qwen | $0.00048 | Cheapest paid option, stable quality, fast |
| **3️⃣ Cost Conscious** | OpenAI | $0.00335 | Most tokens but lowest unit price, competitive cost |
| **4️⃣ Balanced** | Claude | $0.00315 | Balanced quality, stable performance, similar cost to OpenAI |
| **❌ Not Recommended** | iFlytek | $0 | Free but poor formula recognition, text-only |

### 📋 Example Results
See how different models handle the same handwritten content:
- [Qwen Result](example/Scratch_qwen.md) - Cost-effective, excellent quality
- [OpenAI Result](example/Scratch_openai.md) - Highest accuracy
- [Gemini Result](example/Scratch_gemini.md) - Fast, new features
- [Claude Result](example/Scratch_Claude.md) - Balanced performance

Compare the results to choose the best model for your use case!

## 📝 Real-World Performance (Case Study)

Using `Scratch.pdf` (found in this repo) as an example, here is a comparison between the original iFlytek OCR and this tool (Qwen-VL):

![Original PDF](example/page1.jpg)

## iflytek OCR

![iFlytek OCR](example/iflytek.jpg)


## Qwen-VL

![Qwen-VL](example/qwen.jpg)


### 1. Taylor Expansion & Operators
**Content:** Includes Taylor expansion, $\nabla$ operators, and complex fractions.

| Solution | Recognition Result (Partial) | Verdict |
| :--- | :--- | :--- |
| **iFlytek Native** | `f(a)++1(2)/2(x-a)+……=5/20+(0)(a)(x-a)?Nabla Operator` | ❌ Formula structure lost, garbled text |
| **This Tool (Qwen)** | `$f(a) + \frac{f'(a)}{1!}(x-a) + \cdots = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x-a)^n$` | ✅ Perfect LaTeX, mathematically accurate |

### 2. Matrices & Vectors
| Solution | Recognition Result (Partial) | Verdict |
| :--- | :--- | :--- |
| **iFlytek Native** | `A=71 13.1 619 23 1 13.5 803 42` | ❌ Lost matrix dimensions, just a string of numbers |
| **This Tool (Qwen)** | `A = \begin{bmatrix} 1 & 13.1 & 619 & 23 \\ ... \end{bmatrix}` | ✅ Perfectly preserved row/column structure |

---

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

MIT License
