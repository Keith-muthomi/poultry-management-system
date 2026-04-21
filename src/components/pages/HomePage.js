import { html } from 'lit';
import { BasePage } from '../base/BasePage.js';
import { FlockService } from '../../services/FlockService.js';
import { ProductionService } from '../../services/ProductionService.js';
import { AuthService } from '../../services/AuthService.js';
import { ProtocolService } from '../../services/ProtocolService.js';
import { 
  Chart, 
  LineController, 
  LineElement, 
  PointElement, 
  LinearScale, 
  Title, 
  CategoryScale, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend, Filler);

// This is the main dashboard where the farmer sees everything at a glance
export class HomePage extends BasePage {
  static properties = {
    ...BasePage.properties,
    stats: { type: Object },
    user: { type: Object },
    protocols: { type: Array }, // list of things to do today
    isModalOpen: { type: Boolean },
    saving: { type: Boolean },
    toast: { type: Object }
  };

  constructor() {
    super();
    this.user = AuthService.getUser();
    this.protocols = [];
    this.isModalOpen = false;
    this.saving = false;
    this.toast = { open: false, message: '', type: 'info' };
    this.stats = { totalBirds: 0, todayEggs: 0, todayMortality: 0, todayFeed: 0, activeFlocks: 0 };
    this.chart = null;
  }

  async connectedCallback() {
    super.connectedCallback();
    // Get all the data we need when the page loads
    await Promise.all([this.fetchOverview(), this.fetchProtocols()]);
  }

  disconnectedCallback() {
    // Clean up the chart so it doesn't cause memory leaks
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    super.disconnectedCallback();
  }

  firstUpdated() {
    this.initChart();
  }

  // Load the quick stats for the top cards
  async fetchOverview() {
    try {
      const [flocks, prodStats] = await Promise.all([
        FlockService.getFlocks(),
        ProductionService.getTodayStats()
      ]);
      this.stats = {
        totalBirds: flocks.reduce((sum, f) => sum + f.current_count, 0),
        activeFlocks: flocks.filter(f => f.status === 'Active').length,
        todayEggs: prodStats?.total_eggs || 0,
        todayMortality: prodStats?.total_mortality || 0,
        todayFeed: prodStats?.total_feed || 0
      };
    } catch (err) {
      this.error = "Could not load dashboard data.";
    }
  }

  // Get the list of active protocols (tasks)
  async fetchProtocols() {
    try {
      this.protocols = await ProtocolService.getProtocols();
    } catch (err) {
      console.error("Failed to fetch protocols");
    }
  }

  // Set up the pretty line chart for egg production
  initChart() {
    const ctx = this.querySelector('#productionChart')?.getContext('2d');
    if (!ctx) return;
    if (this.chart) this.chart.destroy();
    const isDark = document.documentElement.classList.contains('dark');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Egg Yield',
          data: [2100, 2400, 2200, 2800, 2600, 3100, 2900],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#f59e0b',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: isDark ? '#171717' : '#ffffff',
            titleColor: isDark ? '#ffffff' : '#171717',
            bodyColor: isDark ? '#d4d4d4' : '#525252',
            borderColor: 'rgba(0,0,0,0.1)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', drawBorder: false },
            ticks: { color: '#a3a3a3', font: { size: 10, weight: 'bold' } }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#a3a3a3', font: { size: 10, weight: 'bold' } }
          }
        }
      }
    });
  }

  showToast(message, type = 'info') {
    this.toast = { open: true, message, type };
  }

  // Save a new protocol to the database
  async handleSaveProtocol(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    this.saving = true;
    try {
      await ProtocolService.createProtocol(data);
      this.showToast('Protocol added successfully', 'success');
      this.isModalOpen = false;
      await this.fetchProtocols();
    } catch (err) {
      this.showToast('Failed to add protocol', 'error');
    } finally {
      this.saving = false;
    }
  }

  // Delete a protocol when it's done or not needed
  async handleDeleteProtocol(id) {
    if (confirm('Remove this protocol?')) {
      try {
        await ProtocolService.deleteProtocol(id);
        this.showToast('Protocol removed', 'success');
        await this.fetchProtocols();
      } catch (err) {
        this.showToast('Failed to remove protocol', 'error');
      }
    }
  }

  renderContent() {
    const hours = new Date().getHours();
    const greeting = hours < 12 ? 'Good Morning' : hours < 18 ? 'Good Afternoon' : 'Good Evening';

    return html`
      <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <!-- Welcome Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
              ${greeting}, <span class="text-primary-600 dark:text-primary-400">${this.user?.name || 'Manager'}</span>
            </h1>
            <p class="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Here is what's happening on your farm today.</p>
          </div>
          <div class="flex items-center gap-2">
            <ui-button variant="outlined" size="sm" label="Add Protocol" icon="playlist_add" @click=${() => this.isModalOpen = true}></ui-button>
            <ui-button variant="filled" size="sm" label="Log Production" icon="add" @click=${() => window.location.href='/production'}></ui-button>
          </div>
        </div>

        <!-- Primary Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <stat-card label="Total Assets" value="${this.stats.totalBirds.toLocaleString()}" icon="groups" colorClass="border-primary-500"></stat-card>
          <stat-card label="Egg Yield" value="${this.stats.todayEggs.toLocaleString()}" icon="egg" colorClass="border-secondary-500"></stat-card>
          <stat-card label="Feed Usage" value="${this.stats.todayFeed}kg" icon="inventory_2" colorClass="border-tertiary-500"></stat-card>
          <stat-card label="Active Units" value="${this.stats.activeFlocks}" icon="fact_check" colorClass="border-success-500"></stat-card>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-4">
            <div class="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm">
              <div class="flex items-center justify-between mb-8">
                <div>
                  <h2 class="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-widest">Production Status</h2>
                  <p class="text-xs text-neutral-500 mt-1">Weekly yield analytics</p>
                </div>
                <div class="flex gap-2">
                  <div class="flex items-center gap-1.5">
                    <div class="w-2 h-2 rounded-full bg-secondary-500"></div>
                    <span class="text-[10px] font-bold text-neutral-500 uppercase">Yield Trend</span>
                  </div>
                </div>
              </div>
              <div class="h-64 w-full">
                <canvas id="productionChart"></canvas>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button class="flex flex-col items-center justify-center p-4 bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/20 rounded-xl hover:shadow-md transition-all group" @click=${() => window.location.href='/flock'}>
                <span class="material-symbols-rounded text-primary-600 mb-2 group-hover:scale-110 transition-transform">add_circle</span>
                <span class="text-[11px] font-bold text-primary-700 uppercase">New Batch</span>
              </button>
              <button class="flex flex-col items-center justify-center p-4 bg-secondary-50 dark:bg-secondary-900/10 border border-secondary-100 dark:border-secondary-800/20 rounded-xl hover:shadow-md transition-all group" @click=${() => window.location.href='/finance'}>
                <span class="material-symbols-rounded text-secondary-600 mb-2 group-hover:scale-110 transition-transform">payments</span>
                <span class="text-[11px] font-bold text-secondary-700 uppercase">Log Sale</span>
              </button>
              <button class="flex flex-col items-center justify-center p-4 bg-tertiary-50 dark:bg-tertiary-900/10 border border-tertiary-100 dark:border-tertiary-800/20 rounded-xl hover:shadow-md transition-all group" @click=${() => window.location.href='/records'}>
                <span class="material-symbols-rounded text-tertiary-600 mb-2 group-hover:scale-110 transition-transform">description</span>
                <span class="text-[11px] font-bold text-tertiary-700 uppercase">Reports</span>
              </button>
              <button class="flex flex-col items-center justify-center p-4 bg-success-50 dark:bg-success-900/10 border border-success-100 dark:border-success-800/20 rounded-xl hover:shadow-md transition-all group" @click=${() => window.location.href='/production'}>
                <span class="material-symbols-rounded text-success-600 mb-2 group-hover:scale-110 transition-transform">history</span>
                <span class="text-[11px] font-bold text-success-700 uppercase">Audit Log</span>
              </button>
            </div>
          </div>

          <!-- Protocols Sidebar -->
          <div class="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm h-full">
            <h3 class="text-sm font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-widest mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-3">Active Protocols</h3>
            
            <div class="space-y-4">
              ${this.protocols.length === 0 ? html`<p class="text-xs text-neutral-500 italic">No protocols scheduled.</p>` : ''}
              ${this.protocols.map(p => html`
                <div class="relative pl-6 border-l-2 ${p.status === 'Completed' ? 'border-success-500' : p.status === 'Next Up' ? 'border-primary-500' : 'border-neutral-200 dark:border-neutral-800'} pb-4 group">
                  <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white dark:bg-neutral-900 border-2 ${p.status === 'Completed' ? 'border-success-500' : p.status === 'Next Up' ? 'border-primary-500' : 'border-neutral-300 dark:border-neutral-700'}"></div>
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="text-[13px] font-bold text-neutral-900 dark:text-neutral-50 leading-none">${p.title}</p>
                      <p class="text-[11px] text-neutral-500 mt-1">${p.location} • ${p.time}</p>
                    </div>
                    <button @click=${() => this.handleDeleteProtocol(p.id)} class="text-error-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span class="material-symbols-rounded text-[18px]">delete</span>
                    </button>
                  </div>
                  <span class="inline-block mt-2 px-2 py-0.5 ${p.status === 'Completed' ? 'bg-success-100 text-success-700' : p.status === 'Next Up' ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-600'} text-[10px] font-bold rounded uppercase">${p.status}</span>
                </div>
              `)}
            </div>
          </div>
        </div>

        <!-- Add Protocol Modal -->
        <ui-modal .open=${this.isModalOpen} title="Schedule New Protocol" @modal-close=${() => this.isModalOpen = false}>
          <form id="protocolForm" slot="body" @submit=${this.handleSaveProtocol} class="space-y-4">
            <div class="space-y-4">
              <div>
                <label class="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Title</label>
                <input name="title" required class="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-md px-3 py-2 text-[13px] outline-none" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Time</label>
                  <input name="time" placeholder="e.g. 08:00 AM" class="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-md px-3 py-2 text-[13px] outline-none" />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Location / Batch</label>
                  <input name="location" placeholder="e.g. Pen 04" class="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-md px-3 py-2 text-[13px] outline-none" />
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Status</label>
                <select name="status" class="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-md px-3 py-2 text-[13px] outline-none">
                  <option value="Pending">Pending</option>
                  <option value="Next Up">Next Up</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </form>
          <div slot="footer" class="flex gap-2">
            <ui-button variant="outlined" size="sm" label="Cancel" @click=${() => this.isModalOpen = false}></ui-button>
            <ui-button type="submit" form="protocolForm" size="sm" .loading=${this.saving} label="Save Protocol"></ui-button>
          </div>
        </ui-modal>

        <ui-toast .open=${this.toast.open} .message=${this.toast.message} .type=${this.toast.type} @toast-closed=${() => this.toast = { ...this.toast, open: false }}></ui-toast>
      </div>
    `;
  }
}
customElements.define('home-page', HomePage);
