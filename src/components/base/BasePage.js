import { LitElement, html } from 'lit';

export class BasePage extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    loading: { type: Boolean },
    error: { type: String },
  };

  constructor() {
    super();
    this.loading = false;
    this.error = null;
  }

  renderLoading() {
    return html`
      <div class="flex flex-col items-center justify-center p-12 gap-4 w-full h-full">
        <div class="w-8 h-8 border-4 border-primary-600/30 border-t-primary-600 rounded-md-full animate-spin"></div>
        <span class="text-neutral-500 dark:text-neutral-400 text-[14px] font-medium tracking-wide">Loading...</span>
      </div>
    `;
  }

  renderError() {
    return html`
      <div class="p-6 bg-error-100/50 text-error-700 dark:text-error-300 rounded-md-md border border-error-200/20 animate-in fade-in duration-300">
        <div class="flex items-center gap-3">
          <span class="material-symbols-rounded">error</span>
          <p class="font-medium">${this.error}</p>
        </div>
      </div>
    `;
  }

  renderContent() {
    return html``;
  }

  render() {
    if (this.loading) return this.renderLoading();
    if (this.error) return this.renderError();
    return this.renderContent();
  }
}