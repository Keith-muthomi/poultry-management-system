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
      <div class="flex flex-col items-center justify-center p-12 gap-4">
        <div class="w-8 h-8 border-4 border-md-primary/30 border-t-md-primary rounded-md-full animate-spin"></div>
        <span class="text-md-on-surface-variant text-[14px] font-medium tracking-wide">Loading...</span>
      </div>
    `;
  }

  renderError() {
    return html`
      <div class="p-6 bg-md-error-container text-md-on-error-container rounded-md-md border border-md-error/20 animate-in fade-in duration-300">
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