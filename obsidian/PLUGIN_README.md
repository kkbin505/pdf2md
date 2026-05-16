# PDF to Markdown (Obsidian Plugin)

Convert handwritten PDF notes into Markdown with LaTeX formulas using AI.

## Features

- ✅ **Right-click Convert**: Right-click any PDF file → "Convert to Markdown"
- ✅ **Multiple AI Providers**: OpenAI, Claude, Gemini, or Qwen (Alibaba)
- ✅ **LaTeX Formula Support**: Automatically converts handwritten math to `$...$` and `$$...$$`
- ✅ **Custom Models**: Use any model from your provider (not limited to defaults)
- ✅ **Configurable DPI**: Adjust PDF rendering quality (100-400 DPI)
- ✅ **Retry & Timeout**: Automatic retry on failure with configurable timeout
- ✅ **Progress Tracking**: Real-time conversion progress notifications

## Installation

### Via Community Plugins (when published)
1. Open Obsidian Settings → Community Plugins → Browse
2. Search for "PDF to Markdown"
3. Click Install and Enable

### Manual Installation (Development)
1. Clone or download this repository
2. Copy `main.js`, `manifest.json`, and `styles.css` to `.obsidian/plugins/obsidian-pdf2md/`
3. Reload Obsidian
4. Enable plugin in Settings → Community Plugins

## Configuration

1. Open Obsidian Settings → PDF to Markdown
2. Select an AI Provider:
   - **Qwen (Recommended)** - Cheapest, good quality (~¥0.00345/page)
   - **OpenAI** - Fastest, high quality (~$0.00335/page)
   - **Claude** - Balanced (~$0.00315/page)
   - **Gemini** - Free tier available

3. Enter your API Key for the selected provider:
   - **OpenAI**: https://platform.openai.com/api-keys
   - **Claude**: https://console.anthropic.com/keys
   - **Gemini**: https://aistudio.google.com/app/apikey
   - **Qwen**: https://dashscope.console.aliyun.com/apiKey

4. (Optional) Customize model name if using a different/newer model

5. Adjust other settings:
   - **DPI**: PDF rendering quality (default: 200)
   - **Timeout**: API request timeout in seconds (default: 60)
   - **Max Retries**: Retry attempts on failure (default: 3)

## Usage

1. Place a handwritten PDF in your Obsidian vault
2. Right-click the PDF file
3. Select "Convert to Markdown"
4. Wait for conversion (progress shown in notification)
5. Result is saved as `.md` file in the same directory

Example:
```
my-notes.pdf → my-notes.md
```

## Cost Comparison

| Provider | Model | Cost per Page | Speed |
|---|---|---|---|
| **Qwen** ⭐ | qwen-vl-max | ¥0.00345 (~0.048¢) | Medium |
| OpenAI | gpt-4o-mini | $0.00335 (~0.36¢) | Fast |
| Claude | claude-3-5-sonnet | $0.00315 (~0.34¢) | Medium |
| Gemini | gemini-2.0-flash | Free (for now) | Fast |

**Bottom line**: With Qwen, you can recognize ~3 pages per Chinese cent.

## Troubleshooting

### "API Error" after conversion starts
- Check your API key is correct and has remaining quota
- Verify your internet connection
- Check provider's status page

### Timeout errors
- Try increasing timeout in settings (Settings → PDF to Markdown → API Timeout)
- Try reducing DPI to speed up rendering

### Poor recognition quality
- Increase DPI (100-200 recommended, 300+ for detailed math)
- Try a different provider
- Ensure PDF is not scanned/low-quality image

## Technical Details

The plugin works by:
1. Rendering each PDF page as a PNG image
2. Sending image to your selected AI provider
3. Provider recognizes content and returns Markdown
4. Pages are combined with page breaks (`---`)

Supports:
- **All PDF types**: Digital (native PDF) and scanned (image-based)
- **All handwriting**: Notes, formulas, diagrams (as text + math)
- **Mixed content**: Text + formulas + diagrams

## Privacy

- **No data is stored** on Obsidian servers
- All images are sent directly to your chosen API provider
- You control which provider to use

## Contributing

Issues and PRs welcome at: https://github.com/kkbin505/pdf2md

## License

MIT
