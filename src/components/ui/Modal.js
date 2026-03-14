import { LitElement, html } from 'lit';

export class UIModal extends LitElement {
  createRenderRoot() { return this; }

  static properties = {
    open:    { type: Boolean },
    title:   { type: String },
    size:    { type: String },
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
      '2xl': 'max-w-4xl'
    };

    return html`
      <!-- M3 Corporate Backdrop -->
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 transition-all duration-300"
        @click=${(e) => { if (e.target === e.currentTarget) this._close(); }}>

        <!-- M3 Corporate Dialog -->
        <div class="relative w-full ${sizes[this.size] ?? sizes['md']} bg-md-surface dark:bg-md-dark-surface rounded-md-md shadow-elevation-3 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 border border-md-outline/20 dark:border-md-dark-outline/20">

          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-3.5 border-b border-md-outline/10 dark:border-md-dark-outline/10 bg-md-surface-variant/30 dark:bg-md-dark-surface-variant/30 rounded-t-md-md shrink-0">
            <h2 class="text-[15px] font-bold text-md-on-surface dark:text-md-dark-on-surface leading-tight tracking-tight uppercase tracking-wider">${this.title}</h2>
            <button
              @click=${this._close}
              class="w-8 h-8 flex items-center justify-center rounded-md-full text-md-on-surface-variant dark:text-md-dark-on-surface-variant hover:bg-md-primary/10 dark:hover:bg-md-dark-primary/10 transition-colors">
              <span class="material-symbols-rounded text-[20px] leading-none">close</span>
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto px-5 py-5 text-md-on-surface dark:text-md-dark-on-surface text-[13px] leading-relaxed">
            <slot name="body"></slot>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-md-outline/10 dark:border-md-dark-outline/10 bg-md-surface-variant/10 dark:bg-md-dark-surface-variant/10 rounded-b-md-md shrink-0">
            <slot name="footer"></slot>
          </div>

        </div>
      </div>
    `;
  }
}

customElements.define('ui-modal', UIModal);
