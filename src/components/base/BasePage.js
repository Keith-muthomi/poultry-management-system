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
      <div class="flex items-center justify-center p-12">
        <span class="text-gray-400 text-sm">Loading...</span>
      </div>
    `;
  }

  renderError() {
    return html`
      <div class="p-4 bg-error-50 text-error-600 rounded">
        ${this.error}
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