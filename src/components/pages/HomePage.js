import { LitElement, html } from 'lit';
import { BasePage } from '../base/BasePage.js';
import { FlockService } from '../../services/FlockService.js';
import { ProductionService } from '../../services/ProductionService.js';

export class HomePage extends BasePage {

  static properties = {
    ...BasePage.properties,
    stats: { type: Object }
  };

  constructor() {
    super();
    this.stats = {
      totalBirds: 0,
      todayEggs: 0,
      todayMortality: 0,
      todayFeed: 0
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchOverview();
  }

  async fetchOverview() {
    this.loading = true;
    try {
      const [flocks, prodStats] = await Promise.all([
        FlockService.getFlocks(),
        ProductionService.getTodayStats()
      ]);

      this.stats = {
        totalBirds: flocks.reduce((sum, f) => sum + f.current_count, 0),
        todayEggs: prodStats?.total_eggs || 0,
        todayMortality: prodStats?.total_mortality || 0,
        todayFeed: prodStats?.total_feed || 0
      };
    } catch (err) {
      console.error('Home Page fetch error:', err);
      this.error = "Could not load dashboard data.";
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading || this.error) return super.render();

    return html`
      <div class="space-y-6 animate-in fade-in duration-500">
        <div class="flex flex-col gap-0.5">
          <h1 class="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">Enterprise Overview</h1>
          <p class="text-neutral-500 dark:text-neutral-400 text-[12px] font-medium uppercase tracking-wider">Dashboard / Management Suite</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <stat-card label="Total Population" value="${this.stats.totalBirds.toLocaleString()}" icon="groups" colorClass="border-primary-500 dark:border-primary-400"></stat-card>
          <stat-card label="Yield Today" value="${this.stats.todayEggs.toLocaleString()}" icon="egg" colorClass="border-secondary-500"></stat-card>
          <stat-card label="Input (Feed)" value="${this.stats.todayFeed}kg" icon="inventory_2" colorClass="border-tertiary-500"></stat-card>
          <stat-card label="Incidents" value="${this.stats.todayMortality}" icon="monitoring" colorClass="border-error-500"></stat-card>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div class="lg:col-span-2 bg-white dark:bg-neutral-900 p-5 rounded-md-md border border-neutral-200/10 dark:border-neutral-800/10 min-h-[300px]">
            <div class="flex items-center justify-between mb-5 pb-3 border-b border-neutral-200/5 dark:border-neutral-800/5">
              <h2 class="text-[14px] font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">Production Analytics</h2>
              <ui-button variant="text" size="sm" label="Report" icon="analytics"></ui-button>
            </div>
            <div class="flex items-center justify-center h-48 border border-neutral-200/10 dark:border-neutral-800/10 rounded-md-sm bg-neutral-100/20 dark:bg-neutral-800/20">
              <p class="text-neutral-500 dark:text-neutral-400 text-[12px] font-medium italic">Data visualization is initializing for current cycle.</p>
            </div>
          </div>

          <div class="bg-white dark:bg-neutral-900 p-5 rounded-md-md border border-neutral-200/10 dark:border-neutral-800/10">
            <h2 class="text-[14px] font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider mb-5 pb-3 border-b border-neutral-200/5 dark:border-neutral-800/5">Active Protocol</h2>
            <div class="space-y-2">
              <div class="flex items-center gap-3 p-3 bg-neutral-100/30 dark:bg-neutral-800/30 rounded-md-sm border border-neutral-200/5 dark:border-neutral-800/5 hover:border-primary-500/30 transition-all group cursor-pointer">
                <div class="w-9 h-9 rounded-md-sm bg-primary-100/50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                  <span class="material-symbols-rounded text-[20px]">vaccines</span>
                </div>
                <div class="flex-grow min-w-0">
                  <p class="text-[13px] font-bold text-neutral-900 dark:text-neutral-50 leading-none truncate">Vaccination Batch A</p>
                  <p class="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">14:00 HRS • Pending</p>
                </div>
                <span class="material-symbols-rounded text-neutral-500 dark:text-neutral-400 text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </div>
              
              <div class="flex items-center gap-3 p-3 bg-neutral-100/30 dark:bg-neutral-800/30 rounded-md-sm border border-neutral-200/5 dark:border-neutral-800/10 hover:border-primary-500/30 transition-all group cursor-pointer">
                <div class="w-9 h-9 rounded-md-sm bg-success-100/50 dark:bg-success-900/20 text-success-600 dark:text-success-400 flex items-center justify-center shrink-0">
                  <span class="material-symbols-rounded text-[20px]">cleaning_services</span>
                </div>
                <div class="flex-grow min-w-0">
                  <p class="text-[13px] font-bold text-neutral-900 dark:text-neutral-50 leading-none truncate">Facility Sanitization</p>
                  <p class="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">Pen 04 • Routine</p>
                </div>
                <span class="material-symbols-rounded text-neutral-500 dark:text-neutral-400 text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  }
}
customElements.define('home-page', HomePage);
