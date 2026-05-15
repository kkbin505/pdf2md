import { Plugin, Notice, TFile } from 'obsidian';
import * as pdfjsLib from 'pdfjs-dist';
import { PDF2MDSettings, PDF2MDSettingTab, DEFAULT_SETTINGS } from './src/settings';
import { PDFConverter } from './src/converter';
import { ModelProvider } from './src/providers/base';
import { OpenAICompatibleProvider } from './src/providers/openai-compat';

export default class PDF2MDPlugin extends Plugin {
  settings: PDF2MDSettings;
  private apiKeys: Map<string, string> = new Map();  // Store API keys in memory

  private setupPdfWorker() {
    // Use CDN as primary source (most reliable in Obsidian)
    // This is the official PDF.js CDN which should work
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    console.log('✓ PDF worker configured to use CDN');
  }

  async onload() {
    // Setup PDF.js worker
    this.setupPdfWorker();

    await this.loadSettings();

    // Load API keys from environment variables
    this.loadApiKeysFromEnv();

    this.addSettingTab(new PDF2MDSettingTab(this.app, this));

    this.registerEvent(
      this.app.workspace.on('file-menu', (menu, file) => {
        if (file instanceof TFile && file.extension === 'pdf') {
          menu.addItem(item =>
            item
              .setTitle('Convert to Markdown')
              .setIcon('file-text')
              .onClick(() => this.convertPdf(file))
          );
        }
      })
    );
  }

  private loadApiKeysFromEnv() {
    const envVars = {
      'openai': 'OPENAI_API_KEY',
      'qwen': 'DASHSCOPE_API_KEY',
    };

    for (const [provider, envVar] of Object.entries(envVars)) {
      const value = this.getEnvValue(envVar);
      if (value) {
        this.apiKeys.set(provider, value);
        console.log(`✓ Loaded ${envVar}`);
      } else {
        console.warn(`⚠️ ${envVar} not found in environment variables`);
      }
    }
  }

  private getEnvValue(envVarName: string): string | null {
    try {
      if (typeof process !== 'undefined' && process.env) {
        return process.env[envVarName] || null;
      }
    } catch (e) {
      // Silently fail
    }
    return null;
  }

  private getApiKey(provider: string): string | null {
    return this.apiKeys.get(provider) || null;
  }

  private async convertPdf(file: TFile) {
    try {
      // Check if API key is configured
      const apiKey = this.getApiKey(this.settings.provider);
      if (!apiKey) {
        const envVar = this.settings.provider === 'openai' ? 'OPENAI_API_KEY' : 'DASHSCOPE_API_KEY';
        const providerName = this.settings.provider === 'openai' ? 'OpenAI' : 'Alibaba Qwen';

        new Notice(
          `❌ ${providerName} API Key not configured!\n\nPlease set environment variable: ${envVar}\n\nThen restart Obsidian.`,
          10000
        );
        console.error(`API Key missing. Environment variable: ${envVar}`);
        return;
      }

      const notice = new Notice('Starting PDF conversion...', 0);

      const data = await this.app.vault.readBinary(file);
      const pdfBuffer = data;

      const provider = this.createProvider(apiKey);
      const converter = new PDFConverter(provider, {
        timeout: this.settings.timeout * 1000,
        maxRetries: this.settings.maxRetries,
      });

      let startTime = Date.now();

      converter.setProgressCallback(progress => {
        const percent = Math.round((progress.current / progress.total) * 100);
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        const bar = this.createProgressBar(percent);

        const message = `${bar} ${progress.status}\n[${progress.current}/${progress.total}] ${elapsed}s`;
        notice.setMessage(message);
      });

      const markdown = await converter.convertPdfBuffer(pdfBuffer, this.settings.dpi);

      // Determine output path based on conflict resolution strategy
      const outputPath = this.getOutputPath(file);

      // Check if file exists
      const existingFile = this.app.vault.getAbstractFileByPath(outputPath);

      if (existingFile && this.settings.conflictResolution === 'skip') {
        new Notice(`File already exists: ${outputPath}. Skipped.`, 5000);
        return;
      }

      // Create or overwrite file
      if (existingFile && existingFile instanceof TFile) {
        await this.app.vault.modify(existingFile, markdown);
      } else {
        await this.app.vault.create(outputPath, markdown);
      }

      notice.setMessage(`✓ Converted to ${outputPath}`);
      setTimeout(() => notice.hide(), 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      // Provide helpful error messages
      if (message.includes('Unauthorized') || message.includes('API key')) {
        new Notice(`❌ API Error: Invalid or expired API key. Please check your environment variables.`, 10000);
      } else if (message.includes('timeout')) {
        new Notice(`❌ Conversion timeout. Try increasing timeout in plugin settings or use a faster model.`, 10000);
      } else {
        new Notice(`Error: ${message}`, 10000);
      }

      console.error('Conversion error:', error);
    }
  }

  private getOutputPath(file: TFile): string {
    const basePath = file.path.replace('.pdf', '');
    const baseName = basePath.split('/').pop() || 'output';
    const dir = basePath.substring(0, basePath.length - baseName.length);

    switch (this.settings.conflictResolution) {
      case 'by-model': {
        const modelName = this.getModelDisplayName();
        return `${dir}${baseName}_${modelName}.md`;
      }
      case 'timestamp': {
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '').substring(0, 15);
        return `${dir}${baseName}_${timestamp}.md`;
      }
      case 'skip':
      case 'overwrite':
      default:
        return `${dir}${baseName}.md`;
    }
  }

  private getModelDisplayName(): string {
    const provider = this.settings.provider;

    switch (provider) {
      case 'openai':
        return 'gpt';
      case 'qwen':
        return 'qwen';
      default:
        return provider;
    }
  }

  private createProgressBar(percent: number): string {
    const filled = Math.round((percent / 100) * 20);
    const empty = 20 - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    return `[${bar}] ${percent}%`;
  }

  private createProvider(apiKey: string): ModelProvider {
    const settings = this.settings;

    switch (settings.provider) {
      case 'openai':
        return new OpenAICompatibleProvider(
          {
            apiKey: apiKey,
            model: settings.openaiModel,
          },
          'https://api.openai.com/v1'
        );

      case 'qwen':
        return new OpenAICompatibleProvider(
          {
            apiKey: apiKey,
            model: settings.qwenModel,
          },
          'https://dashscope.aliyuncs.com/compatible-mode/v1'
        );

      default:
        throw new Error(`Unknown provider: ${settings.provider}`);
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
