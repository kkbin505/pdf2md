# PDF2MD Obsidian 插件

> 在 Obsidian 中一键将手写 PDF 转换为 Markdown，智能保留公式和排版

**[English](README_PLUGIN.md) | 中文**

## 功能特性

✨ **智能识别**
- 基于多模态大语言模型，准确识别手写文字和数学公式
- 支持 LaTeX 公式格式，完美保留数学内容
- 智能检测文档结构（标题、段落、列表等）

⚡ **高效转换**
- PDF 自动逐页处理
- 实时进度提示，显示转换状态和耗时
- 可配置 DPI、超时时间、重试次数

🔧 **灵活配置**
- 支持多个 AI 模型提供商
- 文件冲突智能处理（覆盖、跳过、时间戳、按模型命名）
- API Key 掩码显示和环境变量支持，保护隐私
- 自定义模型选择，支持更换模型重新转换

## 支持的 AI 模型

| 提供商 | 模型 | 特点 | 性价比 |
|---|---|---|---|
| **阿里千问 (推荐)** | `qwen-vl-max` | 便宜、可靠 | ⭐⭐⭐⭐⭐ |
| **OpenAI** | `gpt-4o-mini` | 快速、准确 | ⭐⭐⭐⭐ |

## 安装方式

### 方式一：Obsidian 插件市场（推荐）

1. 打开 Obsidian → 设置 → 社区插件
2. 搜索 "PDF2MD"
3. 点击安装并启用插件

### 方式二：手动安装

1. 从 [GitHub Releases](https://github.com/kkbin505/pdf2md/releases) 下载最新版本
2. 将下列文件复制到你的 Vault：
   ```
   <你的Vault>/.obsidian/plugins/pdf2md/
   ├── main.js
   ├── pdf.worker.min.js
   └── manifest.json
   ```
3. 重启 Obsidian 或刷新插件列表
4. 在设置 → 社区插件中启用 "pdf2md"

## 快速开始

### 1️⃣ 配置 AI 模型和 API Key

打开 Obsidian 设置 → PDF2MD，你会看到以下选项：

**选择 AI 提供商：**
- 推荐：**阿里千问**（便宜，¥0.00345/页）
- 备选：**OpenAI GPT-4o Mini**（快，¥0.003/页）

**填入 API Key：**

**方式 A：直接填入（推荐新手）**
- 在设置中填入对应的 API Key
- 插件会进行掩码处理保护你的密钥（只显示前 4 个字符）

**方式 B：环境变量（推荐开发者）**
- 设置系统环境变量，避免在插件中存储敏感信息
- 插件会自动从环境变量中加载 Key

### 2️⃣ 转换 PDF 为 Markdown

1. 在 Obsidian 文件浏览器中找到你的 PDF 文件
2. 右键点击该文件
3. 选择 **"Convert to Markdown"**
4. 等待转换完成（进度条会显示转换进度）
5. 转换好的 `.md` 文件会自动保存在同目录

```
示例：
输入:  my_notes.pdf
输出:  my_notes_qwen.md  (如果使用千问)
       my_notes_gpt.md    (如果使用 OpenAI)
```

## 获取 API Key

### 🟡 阿里千问 (DashScope)

**推荐：最便宜的选择，适合日常使用**

1. 访问 [DashScope 控制台](https://dashscope.console.aliyun.com/apiKey)
2. 登录或注册阿里云账号（支持淘宝/支付宝登录）
3. 创建新的 API Key
4. 复制 API Key，在插件设置中粘贴

**成本：** ~¥0.00345/页（一分钱能转 3 页）

**首次使用有免费额度，非常适合小规模使用。**

### 🔵 OpenAI

**备选：速度快，识别质量最高**

1. 访问 [OpenAI API 密钥管理](https://platform.openai.com/api-keys)
2. 登录 OpenAI 账号
3. 创建新的 API Key
4. 复制 API Key，在插件设置中粘贴

**成本：** ~$0.003/页（按 token 计费）

## 设置详解

### 基本设置

| 选项 | 默认值 | 说明 |
|---|---|---|
| **AI 提供商** | 阿里千问 | 选择使用的 AI 模型提供商 |
| **模型名称** | qwen-vl-max | 具体使用的模型，可自定义 |
| **PDF 渲染 DPI** | 200 | 更高的 DPI 质量更好但速度更慢（范围：100-400） |
| **API 超时** | 60 秒 | API 请求的最大等待时间 |
| **最大重试次数** | 3 | 请求失败时的重试次数 |
| **文件冲突处理** | 按模型命名 | 当输出文件已存在时的处理方式 |

### 文件冲突处理

当转换的输出文件已存在时，插件提供 4 种处理方式：

1. **覆盖** - 直接覆盖已存在的文件（⚠️ 会丢失之前的内容）
2. **跳过** - 如果文件已存在则不生成新文件
3. **时间戳** - 在文件名中添加时间戳
   ```
   my_notes_20250515_114530.md
   ```
4. **按模型命名（推荐）** - 在文件名中添加模型名称
   ```
   使用千问：my_notes_qwen.md
   使用 OpenAI：my_notes_gpt.md
   ```

## 使用示例

### 场景 1：转换单个讲义

1. 将 PDF 讲义放到 Obsidian Vault 中
2. 右键点击 → **"Convert to Markdown"**
3. 等待 1-3 分钟（取决于页数和模型）
4. 生成的 `.md` 文件会自动保存在同目录

### 场景 2：对比不同模型的效果

想比较千问和 OpenAI 的转换质量？

1. 用千问转换一次 → 生成 `lecture_qwen.md`
2. 在插件设置中切换到 OpenAI
3. 再转换一次 → 生成 `lecture_gpt.md`
4. 在 Obsidian 中并排打开两个文件，对比效果
5. 选择效果最好的版本作为最终版本

### 场景 3：提高转换质量

如果转换效果不满意，可以尝试以下方法：

- **增加 DPI**（200 → 300）→ 提高输入图片清晰度
- **换用更强的模型**（千问 → OpenAI）→ 提高识别准确度
- **增加重试次数**（3 → 5）→ 提高网络不稳定时的成功率

## 性能对比

### 成本对比（以 A4 页面为例）

| 模型 | 成本/页 | 速度 | 识别质量 | 适用场景 |
|---|---|---|---|---|
| **千问 VL Max** | ¥0.00345 | 稍慢（15-30秒） | 优秀 | 📚 批量转换、日常使用 |
| **GPT-4o Mini** | ¥0.003 | 快（5-10秒） | 优秀+ | ⚡ 需要快速反馈 |

### 推荐方案

| 使用频率 | 推荐组合 | 理由 |
|---|---|---|
| 👤 个人学生 | **千问为主** | 便宜，日常使用足够 |
| 📚 大量转换 | **千问为主** | 成本低，每月只需几块钱 |
| 🎯 质量优先 | **OpenAI 为主** | 速度快，质量最好 |
| 🔄 对比评估 | **两者都用** | 按模型命名，轻松对比 |

## 常见问题

### Q: 转换失败，显示"API 错误"？

A: 检查以下项：
- ✓ API Key 是否正确（复制时注意没有多余空格）
- ✓ 账户是否有余额或额度
- ✓ 网络连接是否正常
- ✓ 查看开发者控制台获取详细错误信息

**打开开发者控制台：**
- Windows/Linux: `Ctrl+Shift+I`
- Mac: `Cmd+Option+I`

### Q: 转换超时？

A: 尝试以下方案：
1. 增加超时时间（设置 → 60秒 → 90秒）
2. 降低 DPI（200 → 150）使转换更快
3. 检查网络速度
4. 如果经常超时，尝试换用速度更快的模型（千问 → OpenAI）

### Q: 支持批量转换吗？

A: 目前还不支持。可以：
- 逐个转换（虽然有点麻烦）
- 或使用 Python 版本的工具进行批处理：[pdf2md Python 版本](https://github.com/kkbin505/pdf2md)

### Q: 为什么输出结果有时不完美？

A: 这主要受以下因素影响：
- 📄 PDF 的清晰度（扫描 vs 拍照）
- ✍️ 手写笔迹的工整度
- 🧮 公式的复杂程度
- 🤖 模型的能力（千问 vs OpenAI）

**改进建议：**
- 提高 DPI 以获得更清晰的渲染
- 使用更强的模型（OpenAI 通常更准确）
- 接受少量错误并手动修正

### Q: 输出的 LaTeX 公式无法在 Obsidian 中渲染？

A: 需要在 Obsidian 中启用数学渲染插件：

1. 打开 Obsidian 设置 → 关于
2. 确认已安装数学公式渲染插件（如 MathJax Markdown）
3. 在设置 → 社区插件中启用该插件
4. 刷新 Obsidian

**推荐插件：** Obsidian 自带的数学支持，或安装 "MathJax" 插件

### Q: 如何使用环境变量配置 API Key？

A: 这样可以避免在插件中直接存储敏感信息。

**Windows (PowerShell)：**
```powershell
# 阿里千问
[System.Environment]::SetEnvironmentVariable('DASHSCOPE_API_KEY', 'sk-xxxx', 'User')

# OpenAI
[System.Environment]::SetEnvironmentVariable('OPENAI_API_KEY', 'sk-xxxx', 'User')
```

**Mac/Linux：**
```bash
# 编辑 ~/.bashrc 或 ~/.zshrc，添加：
export DASHSCOPE_API_KEY=sk-xxxx
export OPENAI_API_KEY=sk-xxxx

# 然后重新加载配置
source ~/.bashrc
```

**重启 Obsidian 后，插件会自动读取这些环境变量。**

### Q: API Key 显示为掩码，如何查看完整的 Key？

A: 在插件设置中，点击 API Key 字段旁边的按钮：
- 如果显示 "Show" → 点击可复制完整的 Key
- 如果显示 "Paste" → 说明还没有保存 Key

## 故障排查

### 问题：插件无法找到 PDF 文件

**原因：** PDF 可能在 Vault 外的位置
**解决：** 确保 PDF 文件在 Obsidian Vault 内部

### 问题：右键菜单中看不到 "Convert to Markdown" 选项

**原因：** 可能是以下情况
1. 插件未启用
2. 点击的不是 PDF 文件
3. 需要重启 Obsidian

**解决：**
1. 设置 → 社区插件，确保 "pdf2md" 已启用
2. 重新启动 Obsidian
3. 确认右键点击的是 `.pdf` 文件

### 问题：转换后 Markdown 文件无法打开

**原因：** 可能是文件编码问题或生成失败
**解决：**
1. 查看开发者控制台，找到详细错误信息
2. 尝试增加重试次数
3. 确保 API Key 正确且有余额

## 安全和隐私

✅ **API Key 安全**
- 在本地加密存储，不会上传到云端
- 支持从环境变量加载，避免硬写入设置
- 显示时进行掩码处理（只显示前 4 个字符）

✅ **数据隐私**
- 你的 PDF 文件仅在转换时发送到 AI 服务
- 插件本身不保存或缓存任何内容
- 完全控制你的数据

✅ **开源透明**
- 代码完全开源，可在 GitHub 审查
- 无后门，无追踪，无数据收集

## 反馈和贡献

遇到问题或有建议？欢迎在 [GitHub Issues](https://github.com/kkbin505/pdf2md/issues) 提交反馈。

## 许可证

MIT License

## 更新日志

### v1.0.0 (2025-05-15)
- ✨ 首次发布 Obsidian 插件版本
- 支持阿里千问和 OpenAI 模型
- 完整的设置面板和实时进度提示
- 文件冲突智能处理（多种策略）
- API Key 安全管理（掩码+环境变量支持）
- 可配置 DPI、超时、重试次数
- 支持自定义模型选择

---

## 相关资源

- **Python 版本：** [pdf2md (Python Command Line Tool)](https://github.com/kkbin505/pdf2md)
- **项目主页：** [GitHub Repository](https://github.com/kkbin505/pdf2md)
- **问题反馈：** [GitHub Issues](https://github.com/kkbin505/pdf2md/issues)

---

**祝你使用愉快！如果觉得有帮助，欢迎给项目一个 Star ⭐**
