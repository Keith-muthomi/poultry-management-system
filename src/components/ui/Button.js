import { LitElement, html } from 'lit';

export class UIButton extends LitElement {
  createRenderRoot() { return this; }

    static properties = {
    variant: { type: String },
    size: { type: String },
    loading: { type: Boolean },
    disabled: { type: Boolean },
    type: { type: String },
    icon: { type: String },      // material symbol name
    label: { type: String },     // button text
    };

  constructor() {
    super();
    this.variant = 'primary';
    this.size = 'md';
    this.loading = false;
    this.disabled = false;
    this.type = 'button';
  }

  render() {
    const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      'primary': 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      'secondary': 'bg-white text-secondary-700 border border-secondary-300 hover:bg-secondary-50 focus:ring-gray-500',
      'danger': 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
      'ghost': 'bg-transparent text-neutral-600 hover:bg-neutral-100 focus:ring-neutral-400'
    };

    const sizes = {
      'sm': 'px-3 py-1.5 text-xs gap-1.5',
      'md': 'px-4 py-2 text-sm gap-2',
      'lg': 'px-6 py-3 text-base gap-3'
    };


    const classes = `${baseClasses} ${variants[this.variant] ?? variants['primary']} ${sizes[this.size] ?? sizes['md']}`;

    return html`
        <button 
            type=${this.type}
            ?disabled=${this.disabled || this.loading}
            class=${classes}
        >
            ${this.loading ? html`<svg .../>` : ''}
            ${this.icon ? html`<span class="material-symbols-rounded text-sm">${this.icon}</span>` : ''}
            ${this.label}
        </button>
        `;
  }
}
customElements.define('ui-button', UIButton);