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
    const colorMap = {
      'bg-blue-500': 'text-md-primary dark:text-md-dark-primary bg-md-primary/10',
      'bg-emerald-500': 'text-md-tertiary dark:text-md-tertiary bg-md-tertiary/10',
      'bg-amber-500': 'text-warning bg-warning/10',
      'bg-rose-500': 'text-md-error bg-md-error/10'
    };

    const iconClasses = colorMap[this.colorClass] || 'text-md-on-surface-variant bg-md-surface-variant dark:text-md-dark-on-surface-variant dark:bg-md-dark-surface-variant';
    
    return html`
      <div class="bg-md-surface dark:bg-md-dark-surface p-5 rounded-md-md border border-md-outline/10 dark:border-md-dark-outline/10 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-md-sm flex items-center justify-center shrink-0 ${iconClasses}">
            <span class="material-symbols-rounded text-[24px]">
              ${this.icon}
            </span>
          </div>
          <div class="min-w-0">
            <h3 class="text-md-on-surface-variant dark:text-md-dark-on-surface-variant text-[12px] font-bold uppercase tracking-wider truncate">${this.label}</h3>
            <p class="text-[24px] font-bold text-md-on-surface dark:text-md-dark-on-surface leading-tight mt-0.5">${this.value}</p>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('stat-card', StatCard);
