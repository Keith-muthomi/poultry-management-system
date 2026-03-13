import { LitElement, html } from 'lit';

export class BaseComponent extends LitElement {
  // Keeping this as requested for Tailwind support
  createRenderRoot() { return this; }

  static properties = {
    loading: { type: Boolean },
    error: { type: String },
    isEmpty: { type: Boolean }, // Added: For when data is []
  };

  constructor() {
    super();
    this.loading = false;
    this.error = null;
    this.isEmpty = false;
  }

  /**
   * Helper to dispatch custom events with less boilerplate
   * usage: this.emit('data-saved', { id: 123 });
   */
  emit(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Standardized Data Fetching wrapper
   * Handles loading and error states automatically
   */
  async task(promise) {
    this.loading = true;
    this.error = null;
    try {
      const result = await promise;
      return result;
    } catch (err) {
      this.error = err.message || 'An unexpected error occurred';
      console.error(`[BaseComponent Error]:`, err);
    } finally {
      this.loading = false;
    }
  }

  renderLoading() {
    return html`
      <div class="flex flex-col items-center justify-center p-12 animate-pulse">
        <div class="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
        <span class="text-gray-400 text-sm font-medium">Fetching data...</span>
      </div>
    `;
  }

  renderError() {
    return html`
      <div class="m-4 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-center gap-3">
        <span class="material-symbols-rounded text-red-500">error</span>
        <div class="flex-1 text-sm font-medium">${this.error}</div>
        <button @click=${() => window.location.reload()} class="text-xs underline">Retry</button>
      </div>
    `;
  }

  renderEmpty() {
    return html`
      <div class="flex flex-col items-center justify-center p-12 text-center">
        <span class="material-symbols-rounded text-gray-300 text-5xl mb-2">inventory_2</span>
        <p class="text-gray-500 font-medium">No records found</p>
      </div>
    `;
  }

  renderContent() {
    return html`<slot></slot>`;
  }

  render() {
    if (this.loading) return this.renderLoading();
    if (this.error) return this.renderError();
    if (this.isEmpty) return this.renderEmpty();
    return this.renderContent();
  }
}