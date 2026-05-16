# PDF2MD Obsidian Plugin

TypeScript implementation of the PDF to Markdown converter plugin for Obsidian.

## 📋 Quick Reference

| File | Purpose |
|---|---|
| `main.ts` | Plugin entry point, UI registration, file menu integration |
| `src/converter.ts` | Core conversion logic, page handling, retry mechanism |
| `src/pdf.ts` | PDF rendering to base64 images using pdf.js |
| `src/settings.ts` | Settings panel UI and configuration storage |
| `src/providers/base.ts` | ModelProvider interface definition |
| `src/providers/openai-compat.ts` | OpenAI/Qwen API implementation |
| `manifest.json` | Plugin metadata (name, version, minAppVersion) |
| `package.json` | npm dependencies (obsidian, typescript, esbuild) |
| `esbuild.config.mjs` | Build configuration |

## 🚀 Development

### Setup
```bash
npm install
```

### Build
```bash
npm run build
```

Outputs:
- `main.js` (841KB) - Compiled plugin code
- `pdf.worker.min.js` (1.1MB) - PDF.js worker (auto-copied)

### Test in Obsidian
1. Copy these three files to your test vault:
   ```
   <test-vault>/.obsidian/plugins/pdf2md/
   ├── main.js
   ├── pdf.worker.min.js
   └── manifest.json
   ```
2. Enable plugin in Obsidian Settings
3. Configure API key in plugin settings
4. Right-click PDF → "Convert to Markdown"

### Open Developer Console
Debug logs and errors appear here:
- **Windows/Linux:** `Ctrl+Shift+I`
- **Mac:** `Cmd+Option+I`

## 📦 Dependencies

- **obsidian** - Obsidian API
- **pdfjs-dist** - PDF rendering engine
- **typescript** - Type safety
- **esbuild** - Fast bundling
- **@types/node** - Node.js type definitions

## 🔧 Configuration

### Supported Models

| Provider | Model | API Key Env Var |
|---|---|---|
| OpenAI | gpt-4o-mini | `OPENAI_API_KEY` |
| Qwen | qwen-vl-max | `DASHSCOPE_API_KEY` |

### Settings

Users can configure in Obsidian Settings → PDF2MD:
- AI Provider selection (OpenAI or Qwen)
- API Key (with masking and env var support)
- PDF DPI (100-400, default 200)
- API Timeout (seconds, default 60)
- Max Retries (1-5, default 3)
- File Conflict Resolution Strategy

## 🏗️ Architecture

```
User Right-clicks PDF
    ↓
convertPdf() called
    ↓
PDF → pdfToImages() → Base64 PNG array
    ↓
PDFConverter.convertPdfBuffer()
    ↓
For each page: recognizeWithRetry()
    ↓
ModelProvider.recognize(imageBase64)
    ↓
API Call (OpenAI or Qwen)
    ↓
Markdown result
    ↓
Write to Vault (with conflict resolution)
```

## 🔐 Security Notes

- API keys are masked in UI (display first 4 chars + asterisks)
- Support loading from environment variables (`OPENAI_API_KEY`, `DASHSCOPE_API_KEY`)
- API keys stored locally in Obsidian plugin data folder
- PDFs only sent to AI API during conversion, not stored

## 🐛 Debugging

### Check Plugin Logs
Open Developer Console (`Ctrl+Shift+I`) and look for messages like:
```
✓ PDF worker configured to use CDN
Starting PDF conversion...
Recognizing page 1/3...
✓ Converted to my_notes_qwen.md
```

### Common Issues

**"Cannot load script at pdf.worker"**
- Check `setupPdfWorker()` in main.ts
- Verify CDN URL is accessible

**"API Error: Unauthorized"**
- Check API key is correct
- Verify account has API quota
- Check environment variables are set

**"Conversion timeout"**
- Increase timeout in plugin settings
- Check network connection
- Try lower DPI for faster rendering

**"File already exists"**
- Check conflict resolution strategy setting
- Verify file naming matches expected pattern

## 📚 Related Documentation

- [Obsidian Plugin Development](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)
- [Obsidian API](https://docs.obsidian.md/Reference/TypeScript+API)
- [PDF.js Documentation](https://mozilla.github.io/pdf.js/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Qwen VL API Reference](https://dashscope.console.aliyun.com/docs/brief)

## 🔄 Build Output

After running `npm run build`:

```
✓ PDF worker copied                    (pdf.worker.min.js)
  main.js  840.6kb                      (Compiled plugin code)
Done in 45ms
```

The `main.js` file includes all dependencies and is ready to use.

## 📄 License

MIT
