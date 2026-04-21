import { LitElement, html, css } from 'lit';

// This is a little box that pops up when you click something
export class Popover extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    anchorId: { type: String },
    placement: { type: String }, // where should it go? (top, bottom, etc.)
    width: { type: String },
    height: { type: String },
    transformOrigin: { type: String }
  };

  constructor() {
    super();
    this.open = false;
    this.placement = 'bottom-end';
    this.width = '280px';
    this.height = 'auto';
    this.transformOrigin = 'top right';
    this._position = { top: 0, left: 0 };
    
    this._handleOutsideClick = (e) => {
      // Close the box if we click anywhere else on the screen
      if (this.open && !e.composedPath().includes(this)) {
        this.open = false;
        this.dispatchEvent(new CustomEvent('popover-close'));
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._handleOutsideClick);
    window.addEventListener('resize', () => this._updatePosition());
    window.addEventListener('scroll', () => this._updatePosition(), true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleOutsideClick);
  }

  updated(changedProperties) {
    if (changedProperties.has('open') && this.open) {
      // Give it a tiny bit of time to make sure everything is ready
      setTimeout(() => this._updatePosition(), 0);
    }
  }

  _updatePosition() {
    if (!this.open) return;

    // Find the button or thing that opened this popover
    const anchor = document.getElementById(this.anchorId) || 
                   (this.parentElement?.shadowRoot?.getElementById(this.anchorId)) ||
                   document.querySelector(`#${this.anchorId}`);
                   
    if (!anchor) return;

    const anchorRect = anchor.getBoundingClientRect();
    const popoverRect = this.shadowRoot.querySelector('.popover-content').getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;
    let finalPlacement = this.placement;

    // Figure out where to put the box
    if (this.placement.startsWith('bottom')) {
      top = anchorRect.bottom + 8;
    } else {
      top = anchorRect.top - popoverRect.height - 8;
    }

    if (this.placement.endsWith('end')) {
      left = anchorRect.right - popoverRect.width;
    } else {
      left = anchorRect.left;
    }

    // Try to keep the box on the screen so it doesn't get cut off
    // Checking the top and bottom
    if (top + popoverRect.height > viewportHeight) {
      top = anchorRect.top - popoverRect.height - 8;
      finalPlacement = finalPlacement.replace('bottom', 'top');
    } else if (top < 0) {
      top = anchorRect.bottom + 8;
      finalPlacement = finalPlacement.replace('top', 'bottom');
    }

    // Checking the left and right
    if (left + popoverRect.width > viewportWidth) {
      left = viewportWidth - popoverRect.width - 16;
    } else if (left < 0) {
      left = 16;
    }

    this._position = { top, left };
    this.transformOrigin = this._calculateTransformOrigin(finalPlacement);
    this.requestUpdate();
  }

  _calculateTransformOrigin(placement) {
    const vertical = placement.startsWith('top') ? 'bottom' : 'top';
    const horizontal = placement.endsWith('end') ? 'right' : 'left';
    return `${vertical} ${horizontal}`;
  }

  render() {
    return html`
      <div class="popover-wrapper ${this.open ? 'visible' : ''}" 
           style="top: ${this._position.top}px; left: ${this._position.left}px; z-index: 100;">
        <section 
          class="popover-content"
          style="width: ${this.width}; height: ${this.height}; transform-origin: ${this.transformOrigin};"
          role="dialog"
          aria-modal="true"
        >
          <slot></slot>
        </section>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: contents;
    }
    
    .popover-wrapper {
      position: fixed;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s ease-out;
    }
    
    .popover-wrapper.visible {
      pointer-events: auto;
      opacity: 1;
    }
    
    .popover-content {
      background: var(--popover-bg, white);
      border: 1px solid rgba(0,0,0,0.1);
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
      overflow: hidden;
      transform: scale(0.95);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    :host([open]) .popover-content {
      transform: scale(1);
    }

    @media (prefers-color-scheme: dark) {
      .popover-content {
        background: #191919;
        border-color: rgba(255,255,255,0.1);
        box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3);
      }
    }
    
    /* Make sure it looks good in dark mode too */
    :host-context(.dark) .popover-content {
        background: #191919;
        border-color: rgba(255,255,255,0.1);
    }
  `;
}

customElements.define('ui-popover', Popover);
