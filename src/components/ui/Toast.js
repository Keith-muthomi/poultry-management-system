import { LitElement, html } from 'lit';

export class UIToast extends LitElement {
  createRenderRoot() { return this; }

  static properties = {
    message: { type: String },
    type: { type: String }, // 'success', 'error', 'info', 'warning'
    duration: { type: Number }, // in milliseconds
    open: { type: Boolean, reflect: true }
  };

  constructor() {
    super();
    this.message = '';
    this.type = 'info';
    this.duration = 3000;
    this.open = false;
    this._timeoutId = null;
  }

  updated(changedProperties) {
    if (changedProperties.has('open') && this.open) {
      this._startTimer();
    }
    if (changedProperties.has('open') && !this.open) {
      this._clearTimer();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._clearTimer();
  }

  _startTimer() {
    this._clearTimer();
    this._timeoutId = setTimeout(() => {
      this.open = false;
      this.dispatchEvent(new CustomEvent('toast-closed', { bubbles: true, composed: true }));
    }, this.duration);
  }

  _clearTimer() {
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  }

  _getIcon() {
    switch (this.type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info':
      default: return 'info';
    }
  }

  _getClasses() {
    let baseClasses = "flex items-center gap-3 p-4 rounded-lg shadow-lg transition-all duration-300";
    let typeClasses = "";

    switch (this.type) {
      case 'success':
        typeClasses = "bg-success-100 border border-success-200 text-success-700";
        break;
      case 'error':
        typeClasses = "bg-error-100 border border-error-200 text-error-700";
        break;
      case 'warning':
        typeClasses = "bg-secondary-100 border border-secondary-200 text-secondary-700"; // Using secondary for warning
        break;
      case 'info':
      default:
        typeClasses = "bg-primary-100 border border-primary-200 text-primary-700";
        break;
    }

    return `${baseClasses} ${typeClasses} ${this.open ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`;
  }

  render() {
    return html`
      <div 
        class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        aria-live="assertive"
        aria-atomic="true"
        style="min-width: 300px; max-width: 90vw;"
      >
        <div class=${this._getClasses()}>
          <span class="material-symbols-rounded text-2xl">${this._getIcon()}</span>
          <p class="flex-1 text-sm font-medium">${this.message}</p>
          <button @click=${() => this.open = false} class="material-symbols-rounded text-xl opacity-70 hover:opacity-100 pointer-events-auto">close</button>
        </div>
      </div>
    `;
  }
}

customElements.define('ui-toast', UIToast);
