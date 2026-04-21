import { LitElement, html } from 'lit';

// Our base component that everyone else inherits from. 
// It handles the annoying stuff like loading spinners and error messages automatically.
export class BaseComponent extends LitElement {
  // We're using Tailwind, so we don't want Shadow DOM getting in the way.
  createRenderRoot() { return this; }

  static properties = {
    loading: { type: Boolean },
    error: { type: String },
    isEmpty: { type: Boolean }, // For when there's just nothing to show.
  };

  constructor() {
    super();
    this.loading = false;
    this.error = null;
    this.isEmpty = false;
  }

  // Easy way to send events up to parent components.
  emit(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true
    }));
  }

  // This is a life saver. Wrap any async call in this to get auto loading/error states.
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

  // A simple loading spinner so users know we're working on it.
  renderLoading() {
    return html`
      <div class="flex flex-col items-center justify-center p-12 animate-pulse">
        <div class="w-8 h-8 border-4 border-primary-100 dark:border-primary-900 border-t-primary-600 dark:border-t-primary-500 rounded-full animate-spin mb-4"></div>
        <span class="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Fetching data...</span>
      </div>
    `;
  }

  // Shows a red error box if something goes wrong.
  renderError() {
    return html`
      <div class="m-4 p-4 bg-error-100/50 border border-error-200/20 text-error-700 dark:text-error-300 rounded-lg flex items-center gap-3">
        <span class="material-symbols-rounded text-error-500">error</span>
        <div class="flex-1 text-sm font-medium">${this.error}</div>
        <button @click=${() => window.location.reload()} class="text-xs underline">Retry</button>
      </div>
    `;
  }

  // When the data comes back empty, we show this little box.
  renderEmpty() {
    return html`
      <div class="flex flex-col items-center justify-center p-12 text-center">
        <span class="material-symbols-rounded text-neutral-500/30 dark:text-neutral-400/30 text-5xl mb-2">inventory_2</span>
        <p class="text-neutral-500 dark:text-neutral-400 font-medium">No records found</p>
      </div>
    `;
  }

  // This is where the actual component content goes.
  renderContent() {
    return html`<slot></slot>`;
  }

  // The main render logic. It decides whether to show the loader, the error, or the content.
  render() {
    if (this.loading) return this.renderLoading();
    if (this.error) return this.renderError();
    if (this.isEmpty) return this.renderEmpty();
    return this.renderContent();
  }
}