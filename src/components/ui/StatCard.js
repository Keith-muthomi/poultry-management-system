import { LitElement, html } from 'lit';

export class StatCard extends LitElement {
  createRenderRoot() { return this; }

  static properties = {
    label: { type: String },
    value: { type: String },
    icon: { type: String },
  };

  render() {
    
    return html`
      <div class="bg-neutral-100 dark:bg-neutral-900 p-5 rounded-md-md shadow-sm border border-neutral-200/20 dark:border-neutral-800/20 transition-all duration-300 hover:shadow-elevation-1 hover:-translate-y-0.5">
        <div class="flex justify-between items-start">
          <div class="flex flex-col">
            <h3 class="text-neutral-500 dark:text-neutral-400 text-[12px] font-bold uppercase tracking-wider">${this.label}</h3>
            <p class="text-[28px] font-bold text-neutral-900 dark:text-neutral-50 leading-tight mt-1">${this.value}</p>
          </div>
          <div class="w-10 h-10 rounded-md flex items-center justify-center shrink-0 bg-neutral-200/30 dark:bg-neutral-800/30">
            <span class="material-symbols-rounded text-[22px] text-neutral-500 dark:text-neutral-400">
              ${this.icon}
            </span>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('stat-card', StatCard);
