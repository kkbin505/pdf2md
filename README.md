# pdf2md

Writing by hand aligns more naturally with the flow of thought than typing in my mind.

This toll converts handwritten notes to Markdown using AI. Available as both a **Python Tool** and **Obsidian Plugin**.

**[中文文档](README_zh.md)** | **English**

---

## 🎉 Obsidian Plugin - Now Available!

An all-in-one Obsidian plugin that converts handwritten PDFs to Markdown in a single click!

**Key Features:**
- 📄 Right-click any PDF → "Convert to Markdown"
- 🤖 Support for Qwen (¥0.00345/page) and OpenAI (fastest)
- 📊 Real-time progress tracking with visual progress bar
- 🔐 Secure API key management with masking
- ⚙️ Configurable DPI, timeout, retry, and file conflict handling

### Plugin Installation

**Method 1: Obsidian Plugin Marketplace (Recommended)**
1. Open Obsidian → Settings → Community Plugins
2. Search for "pdf2md"
3. Click Install and Enable

**Method 2: Manual Installation**
1. Download the latest release from [GitHub Releases](https://github.com/kkbin505/pdf2md/releases)
2. Extract files to your Vault:
   ```
   <your-vault>/.obsidian/plugins/pdf2md/
   ├── main.js
   ├── pdf.worker.min.js
   └── manifest.json
   ```
3. Restart Obsidian and enable the plugin

### Plugin Quick Start

**1️⃣ Configure Environment Variables**

**Important:** pdf2md reads API keys from environment variables only. No API keys are stored on disk. This is more secure.

**Get Your API Keys:**
- **Alibaba Qwen (Recommended):** https://dashscope.console.aliyun.com/apiKey
- **OpenAI:** https://platform.openai.com/api-keys

**Set Environment Variables:**

**Windows (PowerShell - Run as Administrator):**
```powershell
# Alibaba Qwen
[System.Environment]::SetEnvironmentVariable('DASHSCOPE_API_KEY', 'sk-xxx...', 'User')

# OpenAI
[System.Environment]::SetEnvironmentVariable('OPENAI_API_KEY', 'sk-proj-xxx...', 'User')
```

**Mac/Linux:**
```bash
# Edit ~/.bashrc or ~/.zshrc (Mac users use ~/.zprofile), add:
export DASHSCOPE_API_KEY='sk-xxx...'
export OPENAI_API_KEY='sk-proj-xxx...'

# Save and reload:
source ~/.bashrc  # or source ~/.zshrc
```

**⚠️ Restart Obsidian** after setting environment variables (complete restart required, not just reload).

**2️⃣ Select AI Provider**

Open Obsidian Settings → PDF2MD:
- **AI Provider:** Choose Qwen (cheap) or OpenAI (fast)
- **Model Name:** Customizable, defaults are pre-set

**3️⃣ Convert PDF**

1. Find PDF in Obsidian file browser
2. Right-click → **"Convert to Markdown"**
3. Wait for conversion (progress bar shows status)
4. Converted `.md` file is auto-saved

```
Example:
Input:  my_notes.pdf
Output: my_notes_qwen.md   (if using Qwen)
        my_notes_gpt.md    (if using OpenAI)
```
![pdf](python\example\page1.jpg)

### Qwen

![pdf](python\example\gpt5.4-mini.jpg)

### GPT

![pdf](python\example\qwen.jpg)

### Supported AI Models

| Provider | Model | Cost/Page | Speed | Quality |
|---|---|---|---|---|
| **Alibaba Qwen** 🏆 | qwen-vl-max | ¥0.00345 | 15-30s | Excellent |
| **OpenAI** | gpt-5.4-mini | $0.003 | 5-10s | Excellent+ |

### Plugin Settings

| Option | Default | Description |
|---|---|---|
| **AI Provider** | Qwen | Choose your AI model provider |
| **API Key Status** | Auto-detect | Shows environment variable status (read-only) |
| **Model Name** | qwen-vl-max | Specific model to use (customizable) |
| **PDF Rendering DPI** | 200 | Higher DPI = better quality but slower (100-400) |
| **API Timeout** | 60s | Maximum wait time for API response |
| **Max Retries** | 3 | Number of retry attempts on failure |
| **File Conflict Handling** | Model-based naming | How to handle existing output files |

**File Conflict Strategies:**
- **Overwrite:** Replace existing file (⚠️ loses previous content)
- **Skip:** Don't generate if file exists
- **Add Timestamp:** Append timestamp to filename
- **Model-based Naming (Recommended):** Append model name (e.g., `my_notes_qwen.md`)

---

## 💻 Python Command-Line Tool

**Recommended for:** Batch processing, automation, scripting

→ **[Full Python Documentation](python/README.md)**

### Quick Start

```bash
# Install
pip install -r python/requirements.txt

# Basic usage (default: Qwen)
python python/pdf2md.py your_notes.pdf

# Using OpenAI (faster)
python python/pdf2md.py your_notes.pdf --provider openai

# Custom output path
python python/pdf2md.py your_notes.pdf -o my_output.md

# Higher quality (slower)
python python/pdf2md.py your_notes.pdf --dpi 300
```

---

## 📊 Performanc

### Real Results

See actual output from different models:
- [Qwen Result](python/example/Scratch_qwen.md) - Best cost-effectiveness
- [OpenAI Result](python/example/Scratch_openai.md) - Highest accuracy
- [Original PDF](python/example/Scratch.pdf) - Input example

---

## 🎯 Core Insight

**Modern multimodal LLMs have elegantly solved the handwritten formula recognition problem.**

Real-world testing shows that Qwen achieves this at just **¥0.00345 per page** — or **3 pages for one Chinese cent**:
- 💰 **Cost is no longer a bottleneck** — transformed from "premium tool" to "everyday utility"
- 🎯 **Accuracy is satisfactory** — complex formulas convert accurately to LaTeX
- 🚀 **Choices abound** — OpenAI, Qwen, and others all work well

This project showcases the practical application of this technological breakthrough.

---

## 📖 Background

While studying control theory, I fell in love with the handwriting experience of the **iFlytek Smart Notebook**. However, organizing notes in **Obsidian** proved frustrating: the native OCR was terrible at recognizing mathematical formulas.

I developed this project to solve that problem. It now offers:
- **Obsidian Plugin** for seamless integration with your knowledge management
- **Python CLI** for batch processing and automation

By leveraging **Qwen-VL** and **OpenAI**, it provides:
- **Accurate Mixed Recognition:** Seamlessly handles text and complex formulas
- **Cost-Effective:** High-quality recognition at minimal cost
- **Flexible:** Choose interactive (plugin) or batch (CLI) workflows

---

## 🚀 The Problem

Handwritten note-taking devices like **iFlytek Smart Notebooks** often struggle with **complex mathematical formulas** and mixed formatting.

This project solves that gap with two complementary tools:

1. **Obsidian Plugin** - Instant conversion right from your vault
2. **Python CLI** - Batch process hundreds of PDFs in seconds

---

## 🔐 Security & Privacy

✅ **API keys are secure:**
- Read from environment variables only - **not stored on disk**
- Masked display in settings
- No hardcoding or local file storage

✅ **Your data is private:**
- PDFs only sent to AI APIs during conversion
- No storage or caching of your files
- Full control over your data

✅ **Transparent:**
- Fully open-source on GitHub
- No backdoors, no tracking, no data collection

---

## ❓ FAQ

### Q: Plugin shows "API Key not configured"?
**A:** API Key is not being read from environment variables. Check:
- ✓ Environment variable is set correctly (DASHSCOPE_API_KEY or OPENAI_API_KEY)
- ✓ Did you restart Obsidian? (Complete restart required)
- ✓ Variable name spelled correctly (case-sensitive)

### Q: Conversion fails with "API Error"?
**A:** Check these items:
- ✓ API Key is valid and has remaining quota
- ✓ Network connection is stable
- ✓ Account quota hasn't been exceeded

### Q: Conversion times out?
**A:** Try these solutions:
1. Increase timeout in settings (60s → 90s)
2. Lower DPI (200 → 150) for faster processing
3. Check your internet speed
4. Try a faster model (Qwen → OpenAI)

### Q: Why are results sometimes imperfect?
**A:** Quality is affected by:
- 📄 PDF clarity (scanned vs photographed)
- ✍️ Handwriting legibility
- 🧮 Formula complexity
- 🤖 Model capability

**Improvement tips:**
- Higher DPI for clearer rendering
- Switch to stronger model (OpenAI better than Qwen)
- Accept minor errors and manually correct them

### Q: LaTeX formulas don't render in Obsidian?
**A:** You need to enable math rendering:
1. Install a math rendering plugin (e.g., MathJax Markdown)
2. Enable it in Settings → Community Plugins
3. Refresh Obsidian

---

## 📚 Documentation

| Document | Purpose |
|---|---|
| [Python Tool Docs](python/README.md) | Python CLI usage guide |

---

## 🤝 Contributing

Issues and Pull Requests are welcome!

---

## 📄 License

MIT License

---

**Enjoy pdf2md! If you find it helpful, please consider giving it a Star ⭐ on GitHub!**
