import { LitElement, html } from 'lit';

export class UIButton extends LitElement {
  createRenderRoot() { return this; }

  static properties = {
    variant: { type: String },
    size: { type: String },
    loading: { type: Boolean },
    disabled: { type: Boolean },
    type: { type: String },
    icon: { type: String },
    label: { type: String },
    fullWidth: { type: Boolean }
  };

  constructor() {
    super();
    this.variant = 'filled';
    this.size = 'md';
    this.loading = false;
    this.disabled = false;
    this.type = 'button';
    this.fullWidth = false;
  }

  _handleClick(e) {
    if (this.type === 'submit' && this.getAttribute('form')) {
      const formId = this.getAttribute('form');
      const root = this.getRootNode();
      const form = root.getElementById ? root.getElementById(formId) : document.getElementById(formId);
      if (form) {
        // Create a temporary submit button to trigger validation and submit event
        const tmpBtn = document.createElement('button');
        tmpBtn.type = 'submit';
        tmpBtn.style.display = 'none';
        form.appendChild(tmpBtn);
        tmpBtn.click();
        form.removeChild(tmpBtn);
      }
    }
  }

  render() {
    const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed tracking-wide text-sm";
    
    const variants = {
      'filled': 'bg-primary-600 dark:bg-primary-500 text-white hover:shadow-elevation-2 active:opacity-90',
      'tonal': 'bg-primary-100 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100 hover:shadow-elevation-1 active:opacity-90',
      'outlined': 'bg-transparent border border-neutral-300 dark:border-neutral-700 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20',
      'text': 'bg-transparent text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20',
      'danger': 'bg-error-600 dark:bg-error-500 text-white hover:shadow-elevation-2 active:opacity-90',
    };

    const sizes = {
      'sm': 'px-3 h-8 gap-1.5 rounded-md-full text-xs',
      'md': 'px-5 h-10 gap-2 rounded-md-full',
      'lg': 'px-8 h-12 gap-3 rounded-md-full text-base'
    };

    const classes = `
      ${baseClasses} 
      ${variants[this.variant] ?? variants['filled']} 
      ${sizes[this.size] ?? sizes['md']}
      ${this.fullWidth ? 'w-full' : ''}
    `;

    return html`
        <button 
            type=${this.type === 'submit' && this.getAttribute('form') ? 'button' : this.type}
            ?disabled=${this.disabled || this.loading}
            class=${classes}
            @click=${this._handleClick}
        >
            ${this.loading ? html`
              <svg class="animate-spin h-4 w-4 text-current mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>` : ''}
            ${this.icon && !this.loading ? html`<span class="material-symbols-rounded text-[20px] mr-1.5">${this.icon}</span>` : ''}
            <span>${this.label}</span>
        </button>
    `;
  }
}
customElements.define('ui-button', UIButton);
