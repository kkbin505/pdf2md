# pdf2md

Convert handwritten notes to Markdown with LaTeX formulas using AI. Available as both a **Command-Line Tool** and **Obsidian Plugin**.

**[中文文档](README_zh.md)** | **English**

---

## 🎉 Obsidian Plugin - Now Available!

An all-in-one Obsidian plugin that converts handwritten PDFs to Markdown in a single click!

**Features:**
- 📄 Right-click any PDF → "Convert to Markdown"
- 🤖 Support for Qwen (¥0.00345/page) and OpenAI (fastest)
- 📊 Real-time progress tracking with visual progress bar
- 🔐 Secure API key management with masking
- ⚙️ Configurable DPI, timeout, retry, and file conflict handling

→ **[📖 Obsidian Plugin Documentation](obsidian/README_PLUGIN.md)** | **[📖 中文说明](obsidian/README_PLUGIN_ZH.md)**

### Quick Install
1. Obsidian Settings → Community Plugins → Search "PDF2MD"
2. Install and enable
3. Configure API key in settings
4. Right-click PDF → "Convert to Markdown"

---

## 📂 Two Ways to Use

```
pdf2md/
├── 🔌 obsidian/     ← Obsidian Plugin (Interactive)
│                     Install from plugin marketplace
│                     Right-click PDF to convert
│
└── 💻 python/       ← Command-Line Tool (Batch)
                     For automation and batch processing
```

### 🔌 Obsidian Plugin
**Recommended for**: Obsidian users, interactive use, individual conversions

→ **[Full Plugin Documentation](obsidian/README_PLUGIN.md)**

1. Install from Obsidian plugin marketplace
2. Configure API key in settings
3. Right-click PDF → "Convert to Markdown"

### 💻 Python Command-Line Tool
**Recommended for**: Batch processing, automation, scripting

→ **[Full Python Documentation](python/README.md)**

```bash
# Install
pip install -r python/requirements.txt

# Basic usage
python python/pdf2md.py your_notes.pdf

# Using OpenAI (faster)
python python/pdf2md.py your_notes.pdf --provider openai
```

---

## ✨ What's New (v1.0.0)

### 🔌 Obsidian Plugin (New!)
- Complete plugin implementation for Obsidian
- Support for Qwen and OpenAI models
- Settings panel with DPI, timeout, retry options
- File conflict resolution strategies
- Real-time progress tracking
- API key masking and environment variable support

### 💻 Python Tool
- Stable, tested command-line tool
- Support for multiple AI providers
- Batch processing capability
- Detailed logging and error handling

---

## 🎯 Core Insight

**Modern multimodal LLMs have elegantly solved the handwritten formula recognition problem.**

Real-world testing shows that Qwen achieves this at just **¥0.00345 per page** — or **3 pages for one Chinese cent**:
- 💰 **Cost is no longer a bottleneck** — transformed from "premium tool" to "everyday utility"
- 🎯 **Accuracy is satisfactory** — complex formulas convert accurately to LaTeX
- 🚀 **Choices abound** — OpenAI, Qwen, and others all work well

This project showcases the practical application of this technological breakthrough. Hoping to help students and researchers handle handwritten notes elegantly.

---

## 📖 Background

While studying control theory, I fell in love with the handwriting experience of the **iFlytek Smart Notebook**. However, when it came to organizing my notes in **Obsidian**, I hit a wall: the native OCR was terrible at recognizing mathematical formulas.

I developed this project to solve that problem. It now offers both:
- **Obsidian Plugin** for seamless integration with your knowledge management
- **Python CLI** for batch processing and automation

By leveraging **Qwen-VL** and **OpenAI**, it offers:
- **Accurate Mixed Recognition**: Seamlessly handles mixtures of text and complex formulas
- **Cost-Effective**: High-quality recognition at a fraction of the cost of other solutions
- **Flexible**: Choose between interactive (plugin) or batch (CLI) workflows

---

## 🚀 The Problem

Handwritten note-taking devices like **iFlytek Smart Notebooks** often struggle with **complex mathematical formulas** and mixed formatting in their native OCR software.

This project solves that gap with two complementary tools:

1. **Obsidian Plugin** - Instant conversion right from your vault
2. **Python CLI** - Batch process hundreds of PDFs in seconds

---

## 📊 Performance

### Cost Comparison (A4 page, 200 DPI)

| Provider | Model | Cost/Page | Speed | Quality | When to Use |
|---|---|---|---|---|---|
| **Qwen** 🏆 | qwen-vl-max | ¥0.00345 | 15-30s | Excellent | Cost-sensitive, daily use |
| **OpenAI** | gpt-4o-mini | ¥0.003 | 5-10s | Excellent+ | Need speed, highest accuracy |

### Real Results

See actual output from different models on the same input:
- [Qwen Result](python/example/Scratch_qwen.md) - Best cost-effectiveness
- [OpenAI Result](python/example/Scratch_openai.md) - Highest accuracy
- [Original PDF](python/example/Scratch.pdf) - Input example

---

## 🔐 Security & Privacy

✅ API keys are secure:
- Stored locally, encrypted in Obsidian
- Support for environment variables (no hardcoding)
- Masked display in settings

✅ Your data is private:
- PDFs only sent to AI APIs during conversion
- No storage or caching of your files
- Full control over your data

---

## 📚 Documentation

| Document | Purpose |
|---|---|
| [Obsidian Plugin Docs](obsidian/README_PLUGIN.md) | Complete plugin guide (English) |
| [Obsidian 插件说明](obsidian/README_PLUGIN_ZH.md) | 完整插件指南（中文） |
| [Python Tool Docs](python/README.md) | Python CLI usage guide |
| [Release Guide](RELEASE_GUIDE.md) | How to publish the plugin |

---

## 🤝 Contributing

Issues and Pull Requests are welcome!

---

## 📄 License

MIT License

---

**Enjoy pdf2md! If you find it helpful, please consider giving it a Star ⭐ on GitHub!**
