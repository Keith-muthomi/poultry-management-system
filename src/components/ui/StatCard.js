import { LitElement, html } from 'lit';

export class StatCard extends LitElement {
  createRenderRoot() { return this; }

  static properties = {
    label: { type: String },
    value: { type: String },
    icon: { type: String },
    colorClass: { type: String }
  };

  render() {
    const borderClass = this.colorClass || 'border-md-outline/20 dark:border-md-dark-outline/20';
    
    return html`
      <div class="bg-md-surface-container dark:bg-md-dark-surface-container p-5 rounded-md-md shadow-sm border ${borderClass} transition-all duration-300 hover:shadow-elevation-1 hover:-translate-y-0.5">
        <div class="flex justify-between items-start">
          <div class="flex flex-col">
            <h3 class="text-md-on-surface-variant dark:text-md-dark-on-surface-variant text-[12px] font-bold uppercase tracking-wider">${this.label}</h3>
            <p class="text-[28px] font-bold text-md-on-surface dark:text-md-dark-on-surface leading-tight mt-1">${this.value}</p>
          </div>
          <div class="w-10 h-10 rounded-md flex items-center justify-center shrink-0 bg-md-surface-variant/30 dark:bg-md-dark-surface-variant/30">
            <span class="material-symbols-rounded text-[22px] text-md-on-surface-variant dark:text-md-dark-on-surface-variant">
              ${this.icon}
            </span>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('stat-card', StatCard);
