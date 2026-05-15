# PDF2MD Obsidian Plugin

> Convert handwritten PDFs to Markdown in one click, with intelligent preservation of formulas and formatting

**English** | **[中文文档](README_PLUGIN_ZH.md)**

## Key Features

✨ **Intelligent Recognition**
- Powered by multimodal AI models
- Accurately recognizes handwritten text and mathematical formulas
- Supports LaTeX formula format
- Intelligently detects document structure (headings, paragraphs, lists)

⚡ **Efficient Conversion**
- Automatic page-by-page processing
- Real-time progress tracking with estimated time
- Configurable DPI, timeout, and retry settings

🔧 **Flexible Configuration**
- Support for multiple AI model providers
- Intelligent file conflict handling (overwrite, skip, timestamp, model-based naming)
- API key masking and environment variable support for security
- Easy model switching to compare output quality

## Supported AI Models

| Provider | Model | Characteristics | Value |
|---|---|---|---|
| **Alibaba Qwen (Recommended)** | `qwen-vl-max` | Cheap, reliable | ⭐⭐⭐⭐⭐ |
| **OpenAI** | `gpt-4o-mini` | Fast, accurate | ⭐⭐⭐⭐ |

## Installation

### Method 1: Obsidian Plugin Marketplace (Recommended)
1. Open Obsidian → Settings → Community Plugins
2. Search for "PDF2MD"
3. Click Install and Enable

### Method 2: Manual Installation
1. Download the latest release from [GitHub Releases](https://github.com/kkbin505/pdf2md/releases)
2. Extract these three files to your Vault:
   ```
   <your-vault>/.obsidian/plugins/pdf2md/
   ├── main.js
   ├── pdf.worker.min.js
   └── manifest.json
   ```
3. Restart Obsidian or refresh the plugin list
4. Enable "pdf2md" in Settings → Community Plugins

## Quick Start

### 1️⃣ Configure AI Model and API Key

Open Obsidian Settings → PDF2MD to see these options:

**Select AI Provider:**
- **Recommended:** Alibaba Qwen (cheap, ¥0.00345/page)
- **Alternative:** OpenAI GPT-4o Mini (fast, ¥0.003/page)

**Add API Key:**

**Method A: Direct Entry (Recommended for Beginners)**
- Paste your API key directly in settings
- Plugin will mask it for security (shows only first 4 characters)

**Method B: Environment Variables (Recommended for Developers)**
- Set system environment variables to avoid storing sensitive data in plugin
- Plugin automatically loads from env vars

### 2️⃣ Convert PDF to Markdown

1. Find your PDF file in Obsidian file browser
2. Right-click on the file
3. Select **"Convert to Markdown"**
4. Wait for conversion (progress bar shows status)
5. Converted `.md` file is auto-saved to the same directory

```
Example:
Input:  my_notes.pdf
Output: my_notes_qwen.md   (if using Qwen)
        my_notes_gpt.md    (if using OpenAI)
```

## Getting API Keys

### 🟡 Alibaba Qwen (DashScope)

**Recommended: Most cost-effective, suitable for daily use**

1. Visit [DashScope Console](https://dashscope.console.aliyun.com/apiKey)
2. Sign in or create an Alibaba Cloud account (supports Taobao/AliPay login)
3. Create a new API key
4. Copy the key and paste it in plugin settings

**Cost:** ~¥0.00345/page (3 pages per cent)

**New users get free credits!**

### 🔵 OpenAI

**Alternative: Fast processing, highest recognition accuracy**

1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Sign in to your OpenAI account
3. Create a new API key
4. Copy the key and paste it in plugin settings

**Cost:** ~$0.003/page (token-based pricing)

## Settings Explained

### Basic Settings

| Option | Default | Description |
|---|---|---|
| **AI Provider** | Qwen | Choose your AI model provider |
| **Model Name** | qwen-vl-max | Specific model to use (customizable) |
| **PDF Rendering DPI** | 200 | Higher DPI = better quality but slower (range: 100-400) |
| **API Timeout** | 60 seconds | Maximum wait time for API response |
| **Max Retries** | 3 | Number of retry attempts on failure |
| **File Conflict Handling** | Model-based naming | How to handle existing output files |

### File Conflict Handling Strategies

When the output file already exists, you have 4 options:

1. **Overwrite** - Replace existing file (⚠️ loses previous content)
2. **Skip** - Don't generate if file exists
3. **Add Timestamp** - Append timestamp to filename
   ```
   my_notes_20250515_114530.md
   ```
4. **Model-based Naming (Recommended)** - Append model name to filename
   ```
   Using Qwen:   my_notes_qwen.md
   Using OpenAI: my_notes_gpt.md
   ```

## Usage Examples

### Scenario 1: Convert Single Lecture Notes

1. Place PDF lecture notes in your Obsidian Vault
2. Right-click → **"Convert to Markdown"**
3. Wait 1-3 minutes (depends on page count and model)
4. Converted `.md` appears in the same directory

### Scenario 2: Compare Different Model Outputs

Want to test Qwen vs OpenAI quality?

1. Convert with Qwen → generates `lecture_qwen.md`
2. Switch to OpenAI in plugin settings
3. Convert again → generates `lecture_gpt.md`
4. Open both in Obsidian side-by-side and compare
5. Keep the version with better results

### Scenario 3: Improve Conversion Quality

If results aren't satisfactory:

- **Increase DPI** (200 → 300) → Clearer input images
- **Switch Models** (Qwen → OpenAI) → Better accuracy
- **Increase Retries** (3 → 5) → Higher success rate

## Performance Comparison

### Cost Breakdown (A4 page example)

| Model | Cost/Page | Speed | Recognition Quality | Best For |
|---|---|---|---|---|
| **Qwen VL Max** | ¥0.00345 | Slow (15-30s) | Excellent | 📚 Batch processing, regular use |
| **GPT-4o Mini** | ¥0.003 | Fast (5-10s) | Excellent+ | ⚡ Speed-critical, high accuracy |

### Recommendation

| Use Case | Recommended Setup | Reason |
|---|---|---|
| 👤 Individual student | **Qwen primary** | Cheap, daily use affordable |
| 📚 Heavy batch processing | **Qwen primary** | Cost-effective, monthly budget ~¥5-10 |
| 🎯 Quality-first | **OpenAI primary** | Fastest, most accurate recognition |
| 🔄 Comparison | **Both + model naming** | Easy side-by-side quality testing |

## FAQ

### Q: Conversion fails with "API Error"?

A: Check these items:
- ✓ API Key is correct (copy carefully, no extra spaces)
- ✓ Account has remaining balance or quota
- ✓ Network connection is stable
- ✓ Check Developer Console for detailed error info

**Open Developer Console:**
- Windows/Linux: `Ctrl+Shift+I`
- Mac: `Cmd+Option+I`

### Q: Conversion times out?

A: Try these solutions:
1. Increase timeout in settings (60s → 90s)
2. Lower DPI (200 → 150) for faster processing
3. Check your internet speed
4. If frequent, try a faster model (Qwen → OpenAI)

### Q: Does it support batch conversion?

A: Not directly in the plugin. Options:
- Convert files one by one (tedious but simple)
- Use Python command-line version for batch processing: [pdf2md Python](https://github.com/kkbin505/pdf2md/tree/main/python)

### Q: Why are results sometimes imperfect?

A: Quality is affected by:
- 📄 PDF clarity (scanned vs photographed)
- ✍️ Handwriting legibility
- 🧮 Formula complexity
- 🤖 Model capability

**Improvement tips:**
- Higher DPI for clearer rendering
- Switch to stronger model (OpenAI better than Qwen)
- Accept minor errors and manually correct them

### Q: LaTeX formulas don't render in Obsidian?

A: You need to enable math rendering:

1. Open Obsidian Settings → About
2. Look for math rendering plugins (like MathJax Markdown)
3. Enable the plugin in Community Plugins
4. Refresh Obsidian

**Recommended:** Use Obsidian's built-in math support or install a dedicated math plugin.

### Q: How do I use environment variables to store API keys?

A: This avoids storing sensitive keys directly in plugin settings.

**Windows (PowerShell):**
```powershell
# Alibaba Qwen
[System.Environment]::SetEnvironmentVariable('DASHSCOPE_API_KEY', 'sk-xxxx', 'User')

# OpenAI
[System.Environment]::SetEnvironmentVariable('OPENAI_API_KEY', 'sk-xxxx', 'User')
```

**Mac/Linux:**
```bash
# Edit ~/.bashrc or ~/.zshrc, add:
export DASHSCOPE_API_KEY=sk-xxxx
export OPENAI_API_KEY=sk-xxxx

# Reload config
source ~/.bashrc
```

**After setting env vars, restart Obsidian and they'll be auto-loaded.**

## Troubleshooting

### Problem: Plugin can't find PDF file

**Cause:** PDF might be outside Obsidian Vault
**Solution:** Ensure PDF is within your Obsidian Vault directory

### Problem: "Convert to Markdown" option missing from context menu

**Cause:** Possible reasons:
1. Plugin not enabled
2. Not clicking on a PDF file
3. Obsidian needs restart

**Solution:**
1. Check Settings → Community Plugins - "pdf2md" should be enabled
2. Restart Obsidian
3. Ensure you're right-clicking a `.pdf` file

### Problem: Generated Markdown file won't open

**Cause:** File encoding issue or generation failed
**Solution:**
1. Check Developer Console for detailed error
2. Increase retry attempts in settings
3. Verify API key is correct with remaining quota

## Security & Privacy

✅ **API Key Security**
- Stored locally, encrypted in Obsidian data folder
- Support loading from environment variables (no hardcoding needed)
- Display masked (only first 4 characters shown)

✅ **Data Privacy**
- PDFs only sent to AI API during conversion
- Plugin doesn't store or cache your files
- Full control over your data

✅ **Transparency**
- Fully open-source code on GitHub
- No backdoors, no tracking, no data collection

## Related Resources

- **Python CLI Version:** [pdf2md (Command-Line Tool)](https://github.com/kkbin505/pdf2md/tree/main/python)
- **Project Home:** [GitHub Repository](https://github.com/kkbin505/pdf2md)
- **Report Issues:** [GitHub Issues](https://github.com/kkbin505/pdf2md/issues)

---

## License

MIT

## Changelog

### v1.0.0 (2025-05-15)
- ✨ Initial Obsidian plugin release
- Support for Qwen and OpenAI models
- Complete settings panel with real-time progress
- Intelligent file conflict resolution
- Secure API key management
- Environment variable support
- Multiple file naming strategies

---

**Enjoy using PDF2MD! If you find it helpful, please consider giving it a Star ⭐ on GitHub!**
