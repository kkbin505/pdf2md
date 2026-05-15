# PDF to Markdown - Obsidian Plugin

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Convert handwritten PDF notes into beautifully formatted Markdown with LaTeX formulas using AI.

## ✨ Features

- 📄 **One-Click Conversion**: Right-click any PDF → "Convert to Markdown"
- 🤖 **4 AI Providers**: OpenAI, Claude, Gemini, or Qwen (Alibaba)
- 📐 **LaTeX Support**: Automatically converts handwritten math to `$...$` and `$$...$$`
- ⚙️ **Customizable**: Adjust DPI, timeout, retry attempts, and model selection
- 🔒 **Secure**: API keys from environment variables or masked in settings
- 🚀 **Fast & Cheap**: Qwen costs only ¥0.00345 per page (~3 pages per cent)
- 📊 **Progress Tracking**: Real-time conversion notifications

## 🎯 Use Case

**Problem**: Handwritten notes from digital pens/tablets → Poor formula recognition

**Solution**: This plugin leverages multimodal LLMs to:
1. Render PDF pages as images
2. Send to AI for understanding
3. Get back perfectly formatted Markdown with LaTeX

**Result**: Handwritten notes → Obsidian vault in seconds

## 🚀 Quick Start

### Installation

#### Via Community Plugins (Coming Soon)
1. Settings → Community Plugins → Browse
2. Search "PDF to Markdown"
3. Install and enable

#### Manual Installation
1. Clone this repo
2. Copy `main.js`, `manifest.json`, `styles.css` to `.obsidian/plugins/obsidian-pdf2md/`
3. Reload Obsidian
4. Enable in Settings → Community Plugins

### Setup

1. **Get API Key** for your chosen provider:
   - [OpenAI](https://platform.openai.com/api-keys)
   - [Anthropic (Claude)](https://console.anthropic.com/keys)
   - [Google (Gemini)](https://aistudio.google.com/app/apikey)
   - [Alibaba (Qwen)](https://dashscope.console.aliyun.com/apiKey)

2. **Configure Plugin**:
   - Settings → PDF to Markdown
   - Select provider
   - Paste API key (or set environment variable)
   - Adjust DPI/timeout if needed

3. **Convert PDF**:
   - Right-click PDF file
   - Select "Convert to Markdown"
   - Result appears as `.md` in same folder

## 💰 Cost Comparison

| Provider | Model | Cost/Page | Speed | Quality |
|---|---|---|---|---|
| **Qwen** ⭐ | qwen-vl-max | ¥0.00345 | Medium | Excellent |
| OpenAI | gpt-4o-mini | $0.00335 | Fast | Excellent |
| Claude | claude-3-5-sonnet | $0.00315 | Medium | Excellent |
| Gemini | gemini-2.0-flash | Free* | Fast | Good |

*Gemini free tier has usage limits

## 🔐 Security

- **No server storage** - Images sent directly to your chosen provider
- **Environment variables** - Set `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc.
- **Masked display** - API keys shown as `sk_a****` in settings
- **Local processing** - All conversions happen on your device

## 🔧 Configuration Options

| Setting | Default | Range | Description |
|---|---|---|---|
| AI Provider | Qwen | 4 options | Which API to use |
| Model | Provider default | Custom | Any model from that provider |
| DPI | 200 | 100-400 | PDF rendering quality |
| Timeout | 60s | 1-3600s | API request timeout |
| Max Retries | 3 | 1-5 | Retry attempts on failure |

## 📋 What Gets Recognized

✅ Handwritten text and numbers  
✅ Mathematical formulas (integrals, matrices, etc.)  
✅ Document structure (headings, lists, paragraphs)  
✅ Diagrams (as descriptive text)  
✅ Mixed content (text + formulas)

❌ Scanned images of printed text (use traditional OCR)  
❌ Very low-quality/blurry PDFs

## 🐛 Troubleshooting

**"API Error" after starting conversion**
- Check API key is valid and has quota remaining
- Verify internet connection
- Check provider status page

**Timeout errors**
- Increase timeout in settings
- Try reducing DPI for faster rendering
- Try a different provider (OpenAI is fastest)

**Poor recognition quality**
- Increase DPI (200 is default, try 300+)
- Switch provider (Qwen and OpenAI work best)
- Ensure PDF quality is decent

## 📊 Example Output

**Input**: Handwritten math in PDF
```
∫ f'(a)/1! (x-a) + ... = Σ f^(n)(a)/n! (x-a)^n
```

**Output** (Markdown):
```markdown
$\int f'(a) \cdot \frac{1}{1!}(x-a) + \cdots = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x-a)^n$
```

## 🛠️ Development

### Build
```bash
npm install
npm run build
```

### Watch Mode (Live Reload)
```bash
npm run dev
```

### Project Structure
```
obsidian-pdf2md/
├── main.ts                    # Plugin entry point
├── src/
│   ├── providers/             # AI provider implementations
│   │   ├── base.ts           # Provider interface
│   │   ├── openai-compat.ts  # OpenAI/Gemini/Qwen
│   │   └── anthropic.ts      # Claude
│   ├── converter.ts          # Main conversion logic
│   ├── pdf.ts                # PDF → images
│   └── settings.ts           # Settings UI
├── manifest.json             # Plugin metadata
├── package.json              # Dependencies
└── esbuild.config.mjs        # Build config
```

## 🔄 How It Works

1. **Extract Pages**: PDF → PNG images (configurable DPI)
2. **Send to AI**: Image + prompt → API call
3. **Process Response**: AI returns Markdown with LaTeX
4. **Combine & Save**: Join pages, write `.md` file
5. **Handle Errors**: Retry logic + informative messages

## 🤝 Contributing

Found a bug? Have a feature idea? [Open an issue!](https://github.com/kkbin505/pdf2md/issues)

PRs welcome for:
- New providers/models
- Better error handling
- Performance improvements
- Documentation fixes

## 📄 License

MIT - See [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- [Obsidian](https://obsidian.md/) - Amazing note-taking app
- [pdfjs-dist](https://mozilla.github.io/pdf.js/) - PDF rendering
- [OpenAI](https://openai.com/), [Anthropic](https://anthropic.com/), [Google](https://google.com/), [Alibaba](https://www.aliyun.com/) - AI providers

## 📞 Support

- **Docs**: See [PLUGIN_README.md](PLUGIN_README.md) for detailed guide
- **Config Help**: See [ENV_SETUP.md](ENV_SETUP.md) for environment variable setup
- **Issues**: [GitHub Issues](https://github.com/kkbin505/pdf2md/issues)

---

**TL;DR**: Right-click PDF → Convert to Markdown → Get beautiful notes with perfect formulas ✨
