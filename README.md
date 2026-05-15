# pdf2md

A tool that converts handwritten notes into Markdown with LaTeX formulas using Alibaba's Qwen-VL multimodal large language model.

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

-   ✅ **PDF to Markdown**: Automatically extracts pages and recognizes content.
-   ✅ **LaTeX Support**: Inline formulas `$ ... $` and block formulas `$$ ... $$`.
-   ✅ **Layout Preservation**: Maintains headers, lists, and paragraph structures.
-   ✅ **Model Selection**: Supports various models like `qwen-vl-max` and `qwen-vl-plus`.

## 🛠️ Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/kkbin505/pdf2md.git
    cd pdf2md
    ```

2.  **Install Dependencies**:
    ```bash
    pip install -r requirement.txt
    ```

3.  **Configure API Key**:
    Create a `.env` file in the root directory and add your Alibaba DashScope API Key:
    ```env
    DASHSCOPE_API_KEY=your_api_key_here
    ```
    *Get your key from the [Alibaba DashScope Console](https://dashscope.console.aliyun.com/apiKey).*

## 📖 Usage

Place your handwritten PDF in the project directory and run:

```bash
python pdf2md.py your_notes.pdf
```

The result will be saved as `your_notes.md`.

### Advanced Options
-   `--output`, `-o`: Specify the output file name.
-   `--model`, `-m`: Choose the model (default: `qwen-vl-max`).
-   `--dpi`: Set PDF rendering resolution (default: 200).

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
