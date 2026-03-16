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
          <div class="relative w-screen ${sizes[this.size] ?? sizes['md']} bg-white dark:bg-neutral-900 rounded-md-md shadow-elevation-3 flex flex-col max-h-[90vh] border border-neutral-200/30 dark:border-neutral-800/50 overflow-hidden transition-colors duration-300">

            <!-- Header -->
            <div class="flex items-center justify-between px-5 py-4 border-b border-neutral-200/10 dark:border-neutral-800/20 bg-neutral-100 dark:bg-black/20 shrink-0">
              <h2 class="text-[16px] font-bold text-neutral-900 dark:text-neutral-50 leading-tight uppercase tracking-wide">${this.title}</h2>
              <button
                @click=${this._close}
                aria-label="Close"
                class="w-9 h-9 flex items-center justify-center rounded-md-full text-neutral-500 dark:text-neutral-400 hover:bg-error-500/10 hover:text-error-500 transition-all active:scale-95">
                <span class="text-[24px] font-light leading-none" style="font-family: sans-serif;">&times;</span>
              </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto px-6 py-6 text-neutral-800 dark:text-neutral-200 text-[14px] leading-relaxed">
              <slot name="body"></slot>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200/10 dark:border-neutral-800/20 bg-neutral-100/50 dark:bg-black/10 shrink-0">
              <slot name="footer"></slot>
            </div>

          </div>
        </dialog>
      </div>
    `;
  }
}

customElements.define('ui-modal', UIModal);
