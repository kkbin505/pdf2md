# 环境变量配置 - 安全存储 API Keys

插件支持从**系统环境变量**读取 API Keys，避免明文存储在配置里。

## 设置环境变量

### Windows

#### 方法 1：设置系统环境变量（推荐）

1. **打开环境变量设置**：
   - 按 `Win + R` → 输入 `sysdm.cpl` → 回车
   - 或：Settings → System → About → Advanced system settings

2. **点击 "Environment Variables"**

3. **在 "System variables" 下新建**：
   - 变量名：`DASHSCOPE_API_KEY`（或其他）
   - 变量值：你的 API Key

4. **重启 Obsidian** 使变量生效

#### 方法 2：PowerShell（临时，本次会话有效）

```powershell
$env:DASHSCOPE_API_KEY = "your-api-key-here"
```

#### 方法 3：PowerShell 配置文件（推荐持久化）

编辑 `$PROFILE`：
```powershell
# 打开配置文件
notepad $PROFILE

# 添加以下内容
$env:OPENAI_API_KEY = "sk-..."
$env:ANTHROPIC_API_KEY = "sk-ant-..."
$env:GOOGLE_API_KEY = "AIzaSy..."
$env:DASHSCOPE_API_KEY = "sk_..."
```

### Mac / Linux

编辑 `~/.zshrc` 或 `~/.bashrc`：

```bash
export OPENAI_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-ant-..."
export GOOGLE_API_KEY="AIzaSy..."
export DASHSCOPE_API_KEY="sk_..."
```

然后：
```bash
source ~/.zshrc
```

## 支持的环境变量

| Provider | 环境变量名 | 获取链接 |
|---|---|---|
| OpenAI | `OPENAI_API_KEY` | https://platform.openai.com/api-keys |
| Claude | `ANTHROPIC_API_KEY` | https://console.anthropic.com/keys |
| Gemini | `GOOGLE_API_KEY` | https://aistudio.google.com/app/apikey |
| Qwen | `DASHSCOPE_API_KEY` | https://dashscope.console.aliyun.com/apiKey |

## 在 Obsidian 中使用

### 方式 1：自动加载（推荐）

1. **重启 Obsidian**
2. 打开插件设置 → PDF to Markdown
3. 对应的 API Key 字段旁会显示：
   - ✓ "Using DASHSCOPE_API_KEY" （绿色，表示已加载）
   - 或"Load from Env" 按钮

4. 点击 **"Load from Env"** 按钮，自动从环境变量加载

### 方式 2：手动输入

如果环境变量未生效，可以在设置里手动输入 API Key（会保存到 Obsidian 本地配置）

## ⚠️ 安全提示

| ✅ 推荐 | ❌ 避免 |
|---|---|
| ✓ 使用环境变量 | ✗ 明文写在配置里 |
| ✓ 使用系统级环境变量 | ✗ 放在云同步的文件中 |
| ✓ Git 忽略 `.env.local` | ✗ 提交 API Key 到仓库 |
| ✓ 定期轮换 Key | ✗ 长期使用同一个 Key |

## 检查是否设置成功

**Windows PowerShell：**
```powershell
$env:DASHSCOPE_API_KEY
# 应该显示你的 API Key（或空白表示未设置）
```

**Mac/Linux：**
```bash
echo $DASHSCOPE_API_KEY
```

## 故障排除

### "Using Env" 按钮不出现

- ✓ 检查环境变量名是否正确（区分大小写）
- ✓ 重启 Obsidian
- ✓ 重新启动计算机（Windows 系统环境变量需要）

### 设置后仍然提示未找到 Key

- ✓ 确认在 Obsidian 里点了 **"Load from Env"** 按钮
- ✓ 验证环境变量确实存在：
  ```powershell
  echo $env:DASHSCOPE_API_KEY
  ```

### 优先级

插件按以下顺序查找 API Key：
1. **Obsidian 本地设置**（已手动输入）
2. **系统环境变量**（通过"Load from Env"）

如果两个都有，则使用本地设置。

---

需要帮助？检查 Obsidian 的开发者控制台：
- `Ctrl + Shift + I` → Console 标签
- 查看是否有关于环境变量的错误信息
