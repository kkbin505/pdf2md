# pdf2md - 手写笔记转 Markdown

将手写笔记智能转换为 Markdown，完美保留公式和排版。提供 **Obsidian 插件** 和 **Python 命令行工具** 两种使用方式。

**中文** | **[English](README.md)**

---

## 🎉 Obsidian 插件 - 现已发布！

一键将 Obsidian 中的手写 PDF 转换为 Markdown！

**核心功能：**
- 📄 右键 PDF → "Convert to Markdown"
- 🤖 支持千问（¥0.00345/页）和 OpenAI（最快）
- 📊 实时进度提示，显示转换状态
- 🔐 API Key 安全管理（掩码显示）
- ⚙️ 可配置 DPI、超时、重试、文件冲突处理

→ **[📖 插件完整文档](obsidian/README_PLUGIN_ZH.md)** | **[📖 English](obsidian/README_PLUGIN.md)**

### 快速安装
1. Obsidian 设置 → 社区插件 → 搜索"PDF2MD"
2. 安装并启用
3. 设置环境变量（DASHSCOPE_API_KEY 或 OPENAI_API_KEY）
4. 右键 PDF → "Convert to Markdown"

---

## 📂 两种使用方式

```
pdf2md/
├── 🔌 obsidian/     ← Obsidian 插件（交互式）
│                     从插件市场安装
│                     右键 PDF 即可转换
│
└── 💻 python/       ← Python 命令行工具（批量）
                     用于自动化和批量处理
```

### 🔌 Obsidian 插件
**适合场景**：Obsidian 用户、交互式使用、单个文件转换

→ **[插件完整文档](obsidian/README_PLUGIN_ZH.md)**

1. 从 Obsidian 插件市场安装
2. 设置环境变量（DASHSCOPE_API_KEY 或 OPENAI_API_KEY）
3. 右键 PDF → "Convert to Markdown"

### 💻 Python 命令行工具
**适合场景**：批量处理、自动化脚本

→ **[工具完整文档](python/README.md)**

```bash
# 安装依赖
pip install -r python/requirements.txt

# 基础使用（默认千问）
python python/pdf2md.py 你的笔记.pdf

# 使用 OpenAI（更快）
python python/pdf2md.py 你的笔记.pdf --provider openai
```

---

## ✨ 最新版本 (v1.0.0)

### 🔌 Obsidian 插件（全新！）
- 完整的 Obsidian 插件实现
- 支持千问和 OpenAI 模型
- 设置面板：DPI、超时、重试等选项
- 文件冲突智能处理
- 实时进度追踪
- API Key 掩码和环境变量支持

### 💻 Python 工具
- 稳定的命令行工具
- 支持多个 AI 提供商
- 批量处理能力
- 详细的日志和错误处理

---

## 💡 核心观点

**现代多模态大模型已经优雅地解决了手写公式识别问题。**

实测表明，用千问可以以 **¥0.00345/页** 的成本识别手写笔记，即 **一分钱识别 3 页**：
- 💰 **成本已不再是瓶颈** — 从"高端专业工具"演变为"日常工具"
- 🎯 **准确度令人满意** — 复杂公式能准确转换为 LaTeX
- 🚀 **选择已经充足** — OpenAI、千问等多家模型可选

本项目正是这一技术突破的实践应用，希望能帮助更多学生和研究者优雅地处理手写笔记。

---

## 📖 开发背景

最近在深入学习控制理论，虽然非常喜欢**讯飞本 (iFlytek Smart Notebook)** 带来的极致手写体验，但在将笔记整理到 **Obsidian** 时遇到了巨大障碍：原装软件对数学公式的识别极不友好，导致整理效率低下。

为了解决这个痛点，我开发了这个项目。现在它提供两种使用方式：
- **Obsidian 插件** — 无缝集成到你的知识管理系统
- **Python 命令行工具** — 批量处理和自动化

基于 **千问-VL** 和 **OpenAI**，实现：
- **混合排版精准识别**：完美处理文字与复杂公式的混合
- **极低成本**：千问 ¥0.00345/页，性价比无敌
- **灵活选择**：交互式（插件）或批量（CLI）两种工作流

---

## 🚀 解决的问题

**讯飞本等电子墨水屏笔记设备**虽然自带识别功能，但在处理**复杂数学公式**和**混合排版**时效果往往不尽如人意。

本项目用两个互补的工具解决这一问题：

1. **Obsidian 插件** - 在 Vault 中即时转换
2. **Python 命令行工具** - 批量处理数百个 PDF

---

## 📊 性能对比

### 成本对比（A4 页面，200 DPI）

| 提供商 | 模型 | 成本/页 | 速度 | 质量 | 最适合 |
|---|---|---|---|---|---|
| **千问** 🏆 | qwen-vl-max | ¥0.00345 | 15-30秒 | 优秀 | 成本敏感、日常使用 |
| **OpenAI** | gpt-4o-mini | ¥0.003 | 5-10秒 | 优秀+ | 需要速度、最高准确度 |

### 实际效果

查看不同模型对同一输入的真实输出：
- [千问结果](python/example/Scratch_qwen.md) - 性价比最优
- [OpenAI 结果](python/example/Scratch_openai.md) - 准确度最高
- [原始 PDF](python/example/Scratch.pdf) - 输入示例

---

## 🔐 安全与隐私

✅ **API Key 安全**：
- 仅从环境变量读取 - **不存储到磁盘**
- 设置中掩码显示
- 无硬写、无本地存储

✅ **数据隐私**：
- PDF 仅在转换时发送到 AI API
- 插件不存储或缓存你的文件
- 完全掌控你的数据

---

## 📚 文档导航

| 文档 | 用途 |
|---|---|
| [Obsidian 插件说明](obsidian/README_PLUGIN_ZH.md) | 完整插件指南 |
| [Obsidian Plugin Docs](obsidian/README_PLUGIN.md) | Complete plugin guide (English) |
| [Python 工具说明](python/README.md) | Python 命令行使用 |
| [发布指南](RELEASE_GUIDE.md) | 如何发布插件 |

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 开源协议

MIT License

---

**喜欢这个项目？请在 GitHub 给个 Star ⭐ 吧！**
