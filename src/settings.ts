import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import PDF2MDPlugin from '../main';

export interface PDF2MDSettings {
  provider: 'openai' | 'qwen';
  openaiApiKey: string;
  openaiModel: string;
  qwenApiKey: string;
  qwenModel: string;
  dpi: number;
  timeout: number;
  maxRetries: number;
  conflictResolution: 'overwrite' | 'skip' | 'timestamp' | 'by-model';
}

export const DEFAULT_SETTINGS: PDF2MDSettings = {
  provider: 'qwen',
  openaiApiKey: '',
  openaiModel: 'gpt-5.4-mini',
  qwenApiKey: '',
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

    // Provider selection
    new Setting(containerEl)
      .setName('AI Provider')
      .setDesc('Choose which AI provider to use for recognition')
      .addDropdown(dropdown =>
        dropdown
          .addOption('qwen', 'Alibaba (Qwen VL - Recommended, Cheapest)')
          .addOption('openai', 'OpenAI (GPT-5.4 Mini)')
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
    const { containerEl } = this;
    const provider = this.plugin.settings.provider;

    switch (provider) {
      case 'openai':
        this.addProviderSetting(
          'OpenAI API Key',
          'Get from https://platform.openai.com/api-keys',
          'openaiApiKey',
          'openaiModel'
        );
        break;
      case 'qwen':
        this.addProviderSetting(
          'Alibaba DashScope API Key',
          'Get from https://dashscope.console.aliyun.com/apiKey',
          'qwenApiKey',
          'qwenModel'
        );
        break;
    }
  }

  private addProviderSetting(
    keyLabel: string,
    keyDesc: string,
    keyField: keyof PDF2MDSettings,
    modelField: keyof PDF2MDSettings
  ): void {
    const { containerEl } = this;
    const envVarName = this.getEnvVarName(keyField as string);
    const envValue = this.getEnvValue(envVarName);
    const isFromEnv = envValue && !this.plugin.settings[keyField];

    const helpText = envValue
      ? `✓ Using ${envVarName}`
      : `Or set ${envVarName} environment variable`;

    const currentKey = (this.plugin.settings[keyField] as string) || '';
    const displayValue = this.maskApiKey(currentKey);

    new Setting(containerEl)
      .setName(keyLabel)
      .setDesc(`${keyDesc}\n${helpText}`)
      .addText(text =>
        text
          .setPlaceholder(envValue ? '(from env var)' : 'Enter your API key or set env var')
          .setValue(displayValue)
          .onChange(async value => {
            // Only update if user is actually entering a new key (not just viewing masked)
            if (value && !value.includes('*')) {
              (this.plugin.settings[keyField] as string) = value;
              await this.plugin.saveSettings();
            }
          })
      )
      .addButton(button =>
        button
          .setButtonText(currentKey ? 'Show' : 'Paste')
          .onClick(async () => {
            if (currentKey) {
              // Copy to clipboard
              await navigator.clipboard.writeText(currentKey);
              new Notice('API Key copied to clipboard');
            }
          })
      )
      .addButton(button =>
        button
          .setButtonText(isFromEnv ? 'Using Env' : 'Load from Env')
          .onClick(async () => {
            if (envValue) {
              (this.plugin.settings[keyField] as string) = envValue;
              await this.plugin.saveSettings();
              this.display();
            }
          })
      );

    new Setting(containerEl)
      .setName(`${keyLabel.replace(' API Key', '')} Model`)
      .setDesc('Model name to use (can be customized)')
      .addText(text =>
        text
          .setPlaceholder(this.getDefaultModel(keyField))
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

  private getEnvVarName(field: string): string {
    const mapping: Record<string, string> = {
      openaiApiKey: 'OPENAI_API_KEY',
      qwenApiKey: 'DASHSCOPE_API_KEY',
    };
    return mapping[field] || field;
  }

  private getEnvValue(envVarName: string): string | null {
    try {
      // In Electron (desktop Obsidian), we can access process.env
      if (typeof process !== 'undefined' && process.env) {
        return process.env[envVarName] || null;
      }
    } catch (e) {
      // Silently fail if not in Electron environment
    }
    return null;
  }

  private maskApiKey(key: string): string {
    if (!key) return '';
    if (key.length <= 4) return key;
    return key.substring(0, 4) + '*'.repeat(key.length - 4);
  }
}
