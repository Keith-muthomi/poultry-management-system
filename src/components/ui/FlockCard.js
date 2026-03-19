import { LitElement, html } from 'lit';

export class FlockCard extends LitElement {
  createRenderRoot() { return this; }

  static properties = {
    flock: { type: Object },
    actions: { type: Array }
  };

  calculateSurvivalRate() {
    const { initial_count, current_count } = this.flock;
    if (!initial_count) return 0;
    return ((current_count / initial_count) * 100).toFixed(1);
  }

  calculateAgeWeeks() {
    const { hatch_date } = this.flock;
    if (!hatch_date) return '—';
    const hatchDate = new Date(hatch_date);
    const now = new Date();
    const diffTime = Math.abs(now - hatchDate);
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  }

  render() {
    if (!this.flock) return html``;

    const survivalRate = this.calculateSurvivalRate();
    const ageWeeks = this.calculateAgeWeeks();
    const isLayer = this.flock.type === 'Layers';

    return html`
      <div class="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-lg overflow-hidden flex flex-col transition-all hover:shadow-lg group">
        <!-- Header -->
        <div class="p-4 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-start">
          <div class="flex flex-col">
            <h3 class="font-bold text-neutral-900 dark:text-neutral-50 text-[16px]">${this.flock.name}</h3>
            <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mt-0.5">
              ${this.flock.breed} • ${this.flock.pen_id}
            </span>
          </div>
          <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md-xs border ${isLayer ? 'bg-primary-100/50 text-primary-700 dark:text-primary-300 border-primary-200/20' : 'bg-tertiary-100/50 text-tertiary-700 dark:text-tertiary-300 border-tertiary-200/20'}">
            ${this.flock.type}
          </span>
        </div>

        <!-- Body -->
        <div class="p-4 flex flex-col gap-4">
          <!-- Survival Rate Range -->
          <div class="space-y-1.5">
            <div class="flex justify-between text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              <span>Survival Rate</span>
              <span class="${survivalRate < 95 ? 'text-error-500' : 'text-success-500'}">${survivalRate}%</span>
            </div>
            <div class="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div class="h-full bg-success-500 rounded-full transition-all duration-500" style="width: ${survivalRate}%"></div>
            </div>
            <div class="flex justify-between text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
              <span>${this.flock.current_count.toLocaleString()} current</span>
              <span>${this.flock.initial_count.toLocaleString()} initial</span>
            </div>
          </div>

          <!-- Key Metrics -->
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-0.5">
              <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Feed Consumed</span>
              <div class="flex items-center gap-1">
                <span class="material-symbols-rounded text-[14px] text-tertiary-500">inventory_2</span>
                <span class="text-[13px] font-bold text-neutral-900 dark:text-neutral-50">${(this.flock.total_consumption || 0).toLocaleString()} kg</span>
              </div>
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Current Age</span>
              <div class="flex items-center gap-1">
                <span class="material-symbols-rounded text-[14px] text-primary-500">calendar_today</span>
                <span class="text-[13px] font-bold text-neutral-900 dark:text-neutral-50">${ageWeeks} weeks</span>
              </div>
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                ${isLayer ? 'Total Production' : 'Total Mortality'}
              </span>
              <div class="flex items-center gap-1">
                <span class="material-symbols-rounded text-[14px] ${isLayer ? 'text-secondary-500' : 'text-error-500'}">
                  ${isLayer ? 'egg' : 'skull'}
                </span>
                <span class="text-[13px] font-bold text-neutral-900 dark:text-neutral-50">
                  ${isLayer ? (this.flock.total_production || 0).toLocaleString() : (this.flock.total_mortality_recorded || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Status</span>
              <span class="text-[12px] font-bold ${this.flock.status === 'Active' ? 'text-success-600' : 'text-neutral-500'}">
                ${this.flock.status}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-auto bg-neutral-50 dark:bg-neutral-800/30 p-2 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          ${this.actions ? this.actions.map(action => html`
            <button 
              @click=${() => action.handler(this.flock)}
              class="p-2 hover:bg-white dark:hover:bg-neutral-700 rounded-md transition-colors text-neutral-500 hover:text-primary-500"
              title=${action.label}
            >
              <span class="material-symbols-rounded text-[18px]">${action.icon}</span>
            </button>
          `) : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('flock-card', FlockCard);
