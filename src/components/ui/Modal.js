import { LitElement, html, unsafeCSS } from 'lit';
import globalStyles from '../../styles/output.css?inline';

export class UIModal extends LitElement {
  static styles = unsafeCSS(globalStyles);

  static properties = {
    open:    { type: Boolean },
    title:   { type: String },
    size:    { type: String },
    loading: { type: Boolean },
    isDark:  { type: Boolean, state: true }
  };

  constructor() {
    super();
    this.open    = false;
    this.title   = '';
    this.size    = 'md';
    this.loading = false;
    this.isDark  = document.documentElement.classList.contains('dark');
  }

  connectedCallback() {
    super.connectedCallback();
    this._observer = new MutationObserver(() => {
      this.isDark = document.documentElement.classList.contains('dark');
    });
    this._observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._observer?.disconnect();
  }

  updated(changedProperties) {
    if (changedProperties.has('open')) {
      const dialog = this.shadowRoot.querySelector('dialog');
      if (this.open) {
        dialog?.showModal();
      } else {
        dialog?.close();
      }
    }
  }

  _close() {
    this.dispatchEvent(new CustomEvent('modal-close', { bubbles: true, composed: true }));
  }

  render() {
    const sizes = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-2xl',
      '2xl': 'max-w-4xl'
    };

    return html`
      <div class="${this.isDark ? 'dark' : ''}">
        <dialog
          class="backdrop:bg-black/60 p-4 bg-transparent focus:outline-none"
          @cancel=${this._close}
          @click=${(e) => { if (e.target === e.currentTarget) this._close(); }}>

          <!-- M3 Corporate Dialog -->
          <div class="relative w-screen ${sizes[this.size] ?? sizes['md']} bg-md-surface dark:bg-md-dark-surface-container rounded-md-md shadow-elevation-3 flex flex-col max-h-[90vh] border border-md-outline/30 dark:border-md-dark-outline/50 overflow-hidden transition-colors duration-300">

            <!-- Header -->
            <div class="flex items-center justify-between px-5 py-4 border-b border-md-outline/10 dark:border-md-dark-outline/20 bg-md-surface-container dark:bg-black/20 shrink-0">
              <h2 class="text-[16px] font-bold text-md-on-surface dark:text-md-dark-on-surface leading-tight uppercase tracking-wide">${this.title}</h2>
              <button
                @click=${this._close}
                aria-label="Close"
                class="w-9 h-9 flex items-center justify-center rounded-md-full text-md-on-surface-variant dark:text-md-dark-on-surface-variant hover:bg-md-error/10 hover:text-md-error transition-all active:scale-95">
                <span class="text-[24px] font-light leading-none" style="font-family: sans-serif;">&times;</span>
              </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto px-6 py-6 text-md-on-surface dark:text-md-dark-on-surface text-[14px] leading-relaxed">
              <slot name="body"></slot>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-md-outline/10 dark:border-md-dark-outline/20 bg-md-surface-container/50 dark:bg-black/10 shrink-0">
              <slot name="footer"></slot>
            </div>

          </div>
        </dialog>
      </div>
    `;
  }
}

customElements.define('ui-modal', UIModal);
