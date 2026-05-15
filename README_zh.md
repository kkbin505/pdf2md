# Handwritten2Formula (pdf2md) ✍️ ➡️ 🔢

一个使用阿里云通义千问 (Qwen-VL) 多模态大模型将手写笔记转换为带 LaTeX 公式的 Markdown 转换工具。

## 📖 开发背景 (Background)

最近在深入学习控制理论，虽然非常喜欢**讯飞本 (iFlytek Smart Notebook)** 带来的极致手写体验，但在将笔记整理到 **Obsidian** 时遇到了巨大障碍：原装软件对数学公式的识别极不友好，导致整理效率低下。

为了解决这个痛点，我开发了这个脚本。它通过调用**通义千问 (Qwen-VL)** 模型，实现了：
- **混合排版精准识别**：完美处理文字与复杂公式的混合。
- **高性价比**：相比其他多模态模型，千问的价格优势巨大，识别效果却出类拔萃。
- **笔记流无缝衔接**：手写 PDF -> Markdown -> Obsidian，一气呵成。

## 🚀 解决痛点

**讯飞本 (iFlytek Smart Notebook)** 等电子墨水屏笔记设备虽然自带识别功能，但在处理**复杂数学公式**和**混合排版**时效果往往不尽如人意。

本工具旨在解决这一问题：
1. **高精度公式识别**：调用 Qwen-VL-Max 模型，能够精准识别复杂的手写数学公式并转换为标准的 LaTeX。
2. **多页支持**：一键处理整个 PDF 导出文件。
3. **成本极低**：使用 DashScope API，识别一页仅需几分钱。

## ✨ 功能特性

- ✅ **PDF 转 Markdown**：自动提取 PDF 页面并识别。
- ✅ **LaTeX 公式支持**：行内公式 `$ ... $` 和 块级公式 `$$ ... $$`。
- ✅ **结构化排版**：保留原始笔记的标题、列表和段落结构。
- ✅ **多模型选择**：支持 `qwen-vl-max`, `qwen-vl-plus` 等。

## 🛠️ 安装步骤

1. **克隆仓库**:
   ```bash
   git clone https://github.com/kkbin505/pdf2md.git
   cd pdf2md
   ```

2. **安装依赖**:
   ```bash
   pip install -r requirement.txt
   ```

3. **配置 API Key**:
   在项目根目录创建 `.env` 文件，填入你的阿里云 DashScope API Key：
   ```env
   DASHSCOPE_API_KEY=your_api_key_here
   ```
   *可以在 [阿里云 DashScope 控制台](https://dashscope.console.aliyun.com/apiKey) 获取。*

## 📖 使用方法

将你的手写笔记 PDF 放到项目目录，运行：

```bash
python pdf2md.py your_notes.pdf
```

识别结果将自动保存为 `your_notes.md`。

### 进阶参数
- `--output`, `-o`: 指定输出文件名。
- `--model`, `-m`: 指定模型（默认 `qwen-vl-max`）。
- `--dpi`: 设置 PDF 渲染分辨率（默认 200）。

## 📝 识别效果实测 (Case Study)

以仓库中的 `Scratch.pdf` 为例，展示讯飞原装软件与本工具 (Qwen-VL) 的识别对比：

### 1. 泰勒展开与算子识别
**手写内容：** 包含 Taylor 展开公式、$\nabla$ 算子、矩阵等。

| 识别方案 | 识别结果 (部分展示) | 评价 |
| :--- | :--- | :--- |
| **讯飞原装** | `f(a)++1(2)/2(x-a)+……=5/20+(0)(a)(x-a)?Nabla Operator` | ❌ 公式结构完全丢失，乱码严重 |
| **本工具 (Qwen)** | `$f(a) + \frac{f'(a)}{1!}(x-a) + \cdots = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x-a)^n$` | ✅ 完美识别 LaTeX 结构，还原数学语义 |

### 2. 矩阵与向量识别
| 识别方案 | 识别结果 (部分展示) | 评价 |
| :--- | :--- | :--- |
| **讯飞原装** | `A=71 13.1 619 23 1 13.5 803 42` | ❌ 丢失矩阵维度，变成一连串数字 |
| **本工具 (Qwen)** | `A = \begin{bmatrix} 1 & 13.1 & 619 & 23 \\ ... \end{bmatrix}` | ✅ 完美保留矩阵行列结构 |

---

## 🤝 贡献与反馈

欢迎提交 Issue 或 Pull Request！

## 📄 开源协议

MIT License
