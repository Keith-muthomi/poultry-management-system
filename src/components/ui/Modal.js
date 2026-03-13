// src/components/ui/UIModal.js
import { LitElement, html } from 'lit';

export class UIModal extends LitElement {
  createRenderRoot() { return this; }

  static properties = {
    open:    { type: Boolean },
    title:   { type: String },
    size:    { type: String },  // sm, md, lg, xl
    loading: { type: Boolean },
  };

  constructor() {
    super();
    this.open    = false;
    this.title   = '';
    this.size    = 'md';
    this.loading = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._onKeyDown = (e) => {
      if (e.key === 'Escape' && this.open) this._close();
    };
    window.addEventListener('keydown', this._onKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this._onKeyDown);
  }

  _close() {
    this.dispatchEvent(new CustomEvent('modal-close', { bubbles: true, composed: true }));
  }

  render() {
    if (!this.open) return html``;

    const sizes = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-2xl',
    };

    return html`
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
        @click=${(e) => { if (e.target === e.currentTarget) this._close(); }}>

        <!-- Dialog -->
        <div class="relative w-full ${sizes[this.size] ?? sizes['md']} bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
            <h2 class="text-base font-semibold text-gray-900">${this.title}</h2>
            <button
              @click=${this._close}
              class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <span class="material-symbols-rounded" style="font-size:20px">close</span>
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto px-6 py-5">
            <slot name="body"></slot>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
            <slot name="footer"></slot>
          </div>

        </div>
      </div>
    `;
  }
}

customElements.define('ui-modal', UIModal);