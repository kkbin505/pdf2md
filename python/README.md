# PDF2MD Python Tool

Command-line tool for converting handwritten PDF notes to Markdown with LaTeX formulas.

## 📋 Quick Start

### Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Create .env file from template
cp .env.example .env

# Edit .env and add your API keys
```

### Basic Usage

```bash
# Default (using Qwen)
python pdf2md.py your_notes.pdf

# Using OpenAI
python pdf2md.py your_notes.pdf --provider openai

# Custom output path
python pdf2md.py your_notes.pdf -o my_output.md

# Higher quality (slower)
python pdf2md.py your_notes.pdf --dpi 300
```

## 🔧 Configuration

### API Keys

Set your API keys in `.env` file:

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx (deprecated)
GOOGLE_API_KEY=AIzaSyxxxxxxxxxxxxxx (deprecated)
```

Get your keys from:
- **OpenAI:** [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Qwen:** [DashScope Console](https://dashscope.console.aliyun.com/apiKey)
- **Claude:** [console.anthropic.com](https://console.anthropic.com) (no longer supported in plugin)
- **Gemini:** [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) (no longer supported in plugin)

### Command-Line Options

```bash
python pdf2md.py INPUT_PDF [OPTIONS]

Options:
  -p, --provider {qwen,openai}     AI provider (default: qwen)
  -m, --model MODEL_NAME           Specific model to use
  -o, --output OUTPUT_PATH         Output file path
  -k, --api-key KEY                Direct API key (or use env var)
  --dpi DPI                        PDF rendering DPI (default: 200)
```

## 📊 Cost Comparison

Testing with A4 handwritten page (200 DPI):

| Provider | Model | Cost/Page | Speed | Quality |
|---|---|---|---|---|
| **Qwen** 🏆 | qwen-vl-max | ¥0.00345 | 15-30s | Excellent |
| **OpenAI** | gpt-4o-mini | $0.003 | 5-10s | Excellent |

**Recommendation:** Use Qwen for cost-effectiveness, OpenAI for speed.

## 📚 Examples

### Example 1: Basic Conversion
```bash
python pdf2md.py lecture.pdf
# Output: lecture.md
```

### Example 2: Using OpenAI with Custom Output
```bash
python pdf2md.py notes.pdf --provider openai -o processed_notes.md
```

### Example 3: High Quality Conversion
```bash
python pdf2md.py handwriting.pdf --dpi 300 --max-retries 5
```

### Example 4: Batch Processing (bash)
```bash
for file in *.pdf; do
  python pdf2md.py "$file" --provider qwen
done
```

### Example 5: Batch Processing (PowerShell)
```powershell
Get-ChildItem *.pdf | ForEach-Object {
  python pdf2md.py $_.FullName --provider qwen
}
```

## 📂 Example Results

See the `example/` directory for results from different providers:

- `Scratch_qwen.md` - Qwen output
- `Scratch_openai.md` - OpenAI output
- `Scratch.pdf` - Original PDF input

## 🔐 Security

- **Never commit .env file** - It contains sensitive API keys
- Use environment variables for CI/CD pipelines
- API keys are sent only to respective AI providers
- PDFs are processed locally, not stored on any server

## 🐛 Troubleshooting

### "ModuleNotFoundError: No module named 'openai'"
```bash
pip install -r requirements.txt
```

### "API key not found"
- Check `.env` file exists and is readable
- Verify API key is not empty
- Try setting environment variable directly: `export DASHSCOPE_API_KEY=sk-xxx`

### "PDF reading error"
- Ensure PDF file exists and is readable
- Check file is a valid PDF (not encrypted)
- Try higher DPI if image quality is low

### "API timeout"
- Check internet connection
- Increase `--timeout` value
- Try again (networks can be temporarily slow)

### "Low quality output"
- Increase DPI: `--dpi 300`
- Try different provider: OpenAI usually more accurate
- Check if original PDF is clear

## 📝 Output Format

The tool generates Markdown files with:

- **Text preservation:** Exact text content from handwriting
- **LaTeX formulas:** Math expressions as `$...$` (inline) or `$$...$$` (block)
- **Structure:** Headers, lists, paragraphs preserved
- **Encoding:** UTF-8 with proper line endings

Example output:
```markdown
# Control Theory Notes

## Taylor Series Expansion

The Taylor series expansion around point $a$ is:

$$f(x) = f(a) + \frac{f'(a)}{1!}(x-a) + \frac{f''(a)}{2!}(x-a)^2 + \cdots$$

Where the $n$-th derivative is denoted as $f^{(n)}(a)$.
```

## 🔄 Workflow

Typical workflow from handwritten notes to Obsidian:

```
1. Write notes on iFlytek/iPad with Notability/GoodNotes
   ↓
2. Export as PDF
   ↓
3. python pdf2md.py notes.pdf --provider qwen
   ↓
4. Copy generated .md to Obsidian vault
   ↓
5. Minor edits if needed
   ↓
6. View with LaTeX rendering in Obsidian
```

## 📄 License

MIT

## 🔗 Related

- **Obsidian Plugin:** See `../obsidian/` directory
- **Project Home:** [GitHub - pdf2md](https://github.com/kkbin505/pdf2md)
