import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import PDF2MDPlugin from '../main';

export interface PDF2MDSettings {
  provider: 'openai' | 'qwen';
  openaiModel: string;
  qwenModel: string;
  dpi: number;
  timeout: number;
  maxRetries: number;
  conflictResolution: 'overwrite' | 'skip' | 'timestamp' | 'by-model';
}

export const DEFAULT_SETTINGS: PDF2MDSettings = {
  provider: 'qwen',
  openaiModel: 'gpt-5.4-mini',
  qwenModel: 'qwen-vl-max',
  dpi: 200,
  timeout: 60,
  maxRetries: 3,
  conflictResolution: 'by-model',
};

export class PDF2MDSettingTab extends PluginSettingTab {
  plugin: PDF2MDPlugin;

  constructor(app: App, plugin: PDF2MDPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    // 🔒 Security notice
    const securityNotice = containerEl.createDiv('pdf2md-security-notice');
    securityNotice.innerHTML = `
      <div style="margin-bottom: 20px; padding: 12px; background: #f0f7ff; border-left: 4px solid #2196f3; border-radius: 4px;">
        <strong>🔒 Security:</strong> API keys are read from environment variables only.
        <strong>No API keys are stored on disk.</strong>
        <br/>
        <small>See <a href="https://github.com/kkbin505/pdf2md/tree/main/obsidian">documentation</a> for setup instructions.</small>
      </div>
    `;

    // Provider selection
    new Setting(containerEl)
      .setName('AI Provider')
      .setDesc('Choose which AI provider to use for recognition')
      .addDropdown(dropdown =>
        dropdown
          .addOption('qwen', 'Alibaba Qwen (DASHSCOPE_API_KEY)')
          .addOption('openai', 'OpenAI (OPENAI_API_KEY)')
          .setValue(this.plugin.settings.provider)
          .onChange(async value => {
            this.plugin.settings.provider = value as any;
            await this.plugin.saveSettings();
            this.display();
          })
      );

    // Provider-specific settings
    this.displayProviderSettings();

    // DPI setting
    new Setting(containerEl)
      .setName('PDF Rendering DPI')
      .setDesc('Higher DPI = better quality but slower (default: 200)')
      .addSlider(slider =>
        slider
          .setLimits(100, 400, 50)
          .setValue(this.plugin.settings.dpi)
          .onChange(async value => {
            this.plugin.settings.dpi = value;
            await this.plugin.saveSettings();
          })
      )
      .addExtraButton(button =>
        button.setIcon('reset').onClick(async () => {
          this.plugin.settings.dpi = 200;
          await this.plugin.saveSettings();
          this.display();
        })
      );

    // Timeout setting
    new Setting(containerEl)
      .setName('API Timeout (seconds)')
      .setDesc('Maximum time to wait for API response')
      .addText(text =>
        text
          .setPlaceholder('60')
          .setValue(String(this.plugin.settings.timeout))
          .onChange(async value => {
            const num = parseInt(value);
            if (!isNaN(num) && num > 0) {
              this.plugin.settings.timeout = num;
              await this.plugin.saveSettings();
            }
          })
      );

    // Retry setting
    new Setting(containerEl)
      .setName('Max Retries')
      .setDesc('Number of times to retry on failure')
      .addSlider(slider =>
        slider
          .setLimits(1, 5, 1)
          .setValue(this.plugin.settings.maxRetries)
          .onChange(async value => {
            this.plugin.settings.maxRetries = value;
            await this.plugin.saveSettings();
          })
      );

    // File conflict handling
    new Setting(containerEl)
      .setName('File Conflict Resolution')
      .setDesc('What to do if output file already exists')
      .addDropdown(dropdown =>
        dropdown
          .addOption('overwrite', 'Overwrite existing file')
          .addOption('skip', 'Skip (do not generate)')
          .addOption('timestamp', 'Add timestamp (e.g., file_20250515_110430.md)')
          .addOption('by-model', 'Add model name (e.g., file_qwen.md) - Recommended')
          .setValue(this.plugin.settings.conflictResolution)
          .onChange(async value => {
            this.plugin.settings.conflictResolution = value as any;
            await this.plugin.saveSettings();
          })
      );
  }

  private displayProviderSettings(): void {
    const provider = this.plugin.settings.provider;

    switch (provider) {
      case 'openai':
        this.addProviderSetting(
          'OpenAI API Key Status',
          'Get from https://platform.openai.com/api-keys',
          'OPENAI_API_KEY',
          'openaiModel'
        );
        break;
      case 'qwen':
        this.addProviderSetting(
          'Alibaba DashScope API Key Status',
          'Get from https://dashscope.console.aliyun.com/apiKey',
          'DASHSCOPE_API_KEY',
          'qwenModel'
        );
        break;
    }
  }

  private addProviderSetting(
    keyLabel: string,
    keyDesc: string,
    envVarName: string,
    modelField: keyof PDF2MDSettings
  ): void {
    const { containerEl } = this;
    const envValue = this.getEnvValue(envVarName);

    // Show API Key status (read-only)
    new Setting(containerEl)
      .setName(keyLabel)
      .setDesc(`${keyDesc}\n**Environment Variable:** \`${envVarName}\``)
      .addText(text =>
        text
          .setPlaceholder('Loading from environment variable...')
          .setValue(envValue ? '✓ Configured' : '✗ Not configured')
          .setDisabled(true)
      )
      .addButton(button =>
        button
          .setButtonText(envValue ? '✓ Found' : '⚠️ Missing')
          .setClass(envValue ? 'mod-cta' : 'mod-warning')
          .onClick(async () => {
            if (envValue) {
              new Notice(`✓ ${envVarName} is configured`, 3000);
            } else {
              new Notice(
                `⚠️ ${envVarName} not found.\n\nPlease set the environment variable and restart Obsidian.`,
                5000
              );
            }
          })
      );

    // Model selection
    new Setting(containerEl)
      .setName(`Model`)
      .setDesc('Model name to use (customizable)')
      .addText(text =>
        text
          .setPlaceholder(this.getDefaultModel(modelField))
          .setValue((this.plugin.settings[modelField] as string) || '')
          .onChange(async value => {
            (this.plugin.settings[modelField] as string) = value;
            await this.plugin.saveSettings();
          })
      );
  }

  private getDefaultModel(field: keyof PDF2MDSettings): string {
    const defaults: Record<string, string> = {
      openaiModel: 'gpt-5.4-mini',
      qwenModel: 'qwen-vl-max',
    };
    return defaults[field as string] || '';
  }

  private getEnvValue(envVarName: string): string | null {
    try {
      if (typeof process !== 'undefined' && process.env) {
        return process.env[envVarName] || null;
      }
    } catch (e) {
      // Silently fail if not in Electron environment
    }
    return null;
  }
}
