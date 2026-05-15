# Obsidian 插件发布指南

本指南说明如何将 PDF2MD 插件发布到 Obsidian 官方社区插件市场。

## 前置条件

- ✅ 插件代码完成并测试
- ✅ 已有 GitHub 账户
- ✅ manifest.json 配置正确
- ✅ 编译文件齐全（main.js, pdf.worker.min.js）

## 发布步骤

### Step 1: 准备发布文件

确保项目根目录包含以下文件：

```
pdf2md/
├── manifest.json           ← 插件元数据
├── main.js                 ← 编译后的代码（841KB）
├── pdf.worker.min.js       ← PDF.js worker（1.1MB）
├── package.json            ← 依赖配置
├── README.md               ← 英文文档
├── README_ZH.md            ← 中文文档（可选）
└── README_PLUGIN_ZH.md     ← 插件中文指南（可选）
```

重新编译确保最新：
```bash
npm run build
```

### Step 2: 更新版本号

编辑 `manifest.json` 和 `package.json`：

**manifest.json：**
```json
{
  "version": "1.0.0"  ← 更新版本号
}
```

**package.json：**
```json
{
  "version": "1.0.0"  ← 保持一致
}
```

### Step 3: 提交并推送代码

```bash
# 添加更改
git add .

# 提交
git commit -m "Release version 1.0.0

- First release of Obsidian plugin
- Support for Qwen and OpenAI models
- Complete settings panel and progress tracking
- File conflict resolution strategies"

# 推送到 GitHub
git push origin obsidian_plugin
```

### Step 4: 创建 GitHub Release

#### 方式 A：命令行（推荐）

```bash
# 创建标签
git tag 1.0.0

# 推送标签
git push origin 1.0.0
```

#### 方式 B：GitHub 网页界面

1. 登录 GitHub → 你的仓库
2. 点击 "Releases" 标签
3. 点击 "Create a new release"
4. 填写信息：
   - **Tag version:** `1.0.0`
   - **Release title:** `PDF2MD v1.0.0 - First Release`
   - **Description:** 
     ```
     Initial release of PDF2MD Obsidian plugin
     
     Features:
     - Convert handwritten PDFs to Markdown with AI
     - Support for Qwen (recommended, cheapest) and OpenAI models
     - Intelligent file conflict resolution
     - API key security with masking and environment variable support
     - Real-time progress tracking with visual progress bar
     - Configurable DPI, timeout, and retry settings
     
     Supported Models:
     - Qwen VL Max (¥0.00345/page, recommended)
     - OpenAI GPT-4o Mini ($0.003/page, faster)
     
     Installation:
     1. In Obsidian: Settings → Community Plugins → Search "PDF2MD"
     2. Click Install and Enable
     3. Configure API key in plugin settings
     4. Right-click PDF → "Convert to Markdown"
     ```

5. **上传文件** - 将这三个文件拖到 "Attach binaries" 区域：
   - `main.js`
   - `pdf.worker.min.js`
   - `manifest.json`

6. 点击 "Publish release"

### Step 5: 提交到 Obsidian 社区插件市场

1. **Fork obsidian-releases 仓库**
   - 访问 https://github.com/obsidianmd/obsidian-releases
   - 点击 "Fork"

2. **Clone 你的 fork**
   ```bash
   git clone https://github.com/你的用户名/obsidian-releases.git
   cd obsidian-releases
   ```

3. **编辑 community-plugins.json**
   
   在文件中找到合适的位置（按字母顺序），添加：
   ```json
   {
     "id": "obsidian-pdf2md",
     "name": "PDF2MD",
     "author": "kkbin505",
     "description": "Convert handwritten PDFs to Markdown with LaTeX formulas using AI (OpenAI or Qwen)",
     "repo": "kkbin505/pdf2md"
   }
   ```

4. **提交并推送**
   ```bash
   git add community-plugins.json
   git commit -m "Add PDF2MD plugin to community plugins"
   git push origin main
   ```

5. **创建 Pull Request**
   - 访问你的 fork：https://github.com/你的用户名/obsidian-releases
   - 点击 "Compare & pull request"
   - 填写 PR 说明：
     ```
     Add PDF2MD plugin - Convert handwritten PDFs to Markdown using AI
     
     **Plugin Details:**
     - ID: obsidian-pdf2md
     - Repository: kkbin505/pdf2md
     - Supported Models: Qwen VL Max, OpenAI GPT-4o Mini
     - Latest Release: v1.0.0
     
     **Features:**
     - PDF to Markdown conversion with LaTeX formula support
     - Multiple AI model support for cost and quality optimization
     - Intelligent file conflict resolution
     - API key security management
     - Real-time progress tracking
     ```
   - 点击 "Create pull request"

### Step 6: 等待审核

Obsidian 官方团队会进行审核，通常需要 **1-7 天**。

**审核清单：**
- ✓ manifest.json 有效性
- ✓ GitHub Release 存在
- ✓ Release 中包含正确的三个文件
- ✓ 代码安全性检查
- ✓ README 质量
- ✓ 无隐私信息泄露

## 审核常见问题

### Q: 为什么审核被拒？

常见原因：
- ❌ manifest.json 格式错误 → 检查 JSON 语法
- ❌ GitHub Release 缺少文件 → 重新上传三个文件
- ❌ 插件 ID 已被占用 → 更改 ID
- ❌ 安全问题 → 检查代码中是否有安全漏洞
- ❌ 描述不清楚 → 完善 README

### Q: 审核多长时间？

- 一般 **1-7 天**
- 如果有问题，审核者会在 PR 中评论
- 修改后需要再次审核

### Q: 审核通过后呢？

- PR 被合并到 obsidian-releases
- 插件自动出现在 Obsidian 插件市场
- 用户可以直接搜索安装
- 大约 24 小时内所有用户都能看到

## 发布后维护

### 更新插件

1. 更新代码和版本号
2. 重新编译：`npm run build`
3. 创建新的 GitHub Release（新版本号）
4. PR 到 obsidian-releases（更新 community-plugins.json 中的版本）

### 发布新版本示例

```bash
# 编辑代码...

# 更新版本号（manifest.json 和 package.json）
# 从 1.0.0 → 1.0.1

# 编译
npm run build

# 提交
git add .
git commit -m "Bump version to 1.0.1 - Bug fixes"
git push origin obsidian_plugin

# 创建 Release
git tag 1.0.1
git push origin 1.0.1

# 在 GitHub 创建 Release（上传编译后的文件）
# 更新 obsidian-releases 的 PR
```

## 检查清单

发布前：
- [ ] 代码编译无错误：`npm run build`
- [ ] 插件在 Obsidian 中测试正常
- [ ] manifest.json 版本号正确
- [ ] 所有必要文件已生成（main.js, pdf.worker.min.js）
- [ ] README 清晰完整
- [ ] 没有硬写的 API Key 或隐私信息
- [ ] GitHub Release 包含三个必要文件

提交 PR 到 obsidian-releases：
- [ ] Fork 了 obsidian-releases
- [ ] community-plugins.json 格式正确
- [ ] 插件 ID 唯一（不与现有插件冲突）
- [ ] repo 字段指向正确的 GitHub 仓库
- [ ] PR 描述清楚明了

## 参考资源

- **Obsidian 官方指南：** https://docs.obsidian.md/Obsidian+Publish/Publish+your+notes
- **插件开发文档：** https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin
- **社区插件仓库：** https://github.com/obsidianmd/obsidian-releases
- **插件示例：** https://github.com/obsidianmd/sample-plugin

## 问题排查

### 问题：GitHub Release 中找不到上传按钮

**解决：** 向下滚动，在 "Attachments" 区域点击 "Attach binaries by dropping them here"

### 问题：community-plugins.json 格式被拒

**解决：** 
1. 确保 JSON 格式正确（使用 JSON 验证工具）
2. 检查逗号位置
3. 避免在 JSON 中加入注释

### 问题：PR 一直没有响应

**解决：**
1. 等待更长时间（最多 7 天）
2. 在 PR 中 @ 一个审核者
3. 检查是否有未解决的问题/评论

## 发布完成！

一旦插件被接受，你会看到：
1. PR 被合并
2. 插件出现在 [Obsidian 插件市场](https://obsidian.md/plugins)
3. 用户可以搜索 "PDF2MD" 安装

🎉 **恭喜！你的插件现在可供全球 Obsidian 用户使用了！**

---

**需要帮助？** 在 GitHub Issues 中反馈或访问 Obsidian 社区论坛。
