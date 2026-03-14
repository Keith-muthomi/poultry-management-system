import { LitElement, html } from 'lit';
import { BasePage } from '../base/BasePage.js';
import { ProductionService } from '../../services/ProductionService.js';
import { FlockService } from '../../services/FlockService.js';

export class ProductionPage extends BasePage {

  static properties = {
    ...BasePage.properties,
    mode: { type: String },
    logs: { type: Array },
    flocks: { type: Array },
    isModalOpen: { type: Boolean },
    saving: { type: Boolean }
  };

  constructor() {
    super();
    this.mode = "layers";
    this.logs = [];
    this.flocks = [];
    this.isModalOpen = false;
    this.saving = false;

    this.layerColumns = [
      { key: 'date', label: 'Cycle Date', render: (val) => new Date(val).toLocaleDateString() },
      { key: 'flock_name', label: 'Asset Unit' },
      { key: 'egg_count', label: 'Yield' },
      { key: 'cracked_count', label: 'Loss (Broken)', render: (val) => html`<span class="text-md-error dark:text-md-error font-bold">${val}</span>` },
      { key: 'mortality_count', label: 'Loss (Mort)', render: (val) => html`<span class="text-md-error dark:text-md-error font-bold">${val}</span>` },
      { key: 'feed_consumed_kg', label: 'Resource (kg)' },
    ];

    this.broilerColumns = [
      { key: 'date', label: 'Cycle Date', render: (val) => new Date(val).toLocaleDateString() },
      { key: 'flock_name', label: 'Asset Unit' },
      { key: 'mortality_count', label: 'Loss', render: (val) => html`<span class="text-md-error dark:text-md-error font-bold">${val}</span>` },
      { key: 'feed_consumed_kg', label: 'Resource (kg)' },
      { key: 'notes', label: 'Internal Notes' }
    ];
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchData();
  }

  async fetchData() {
    this.loading = true;
    try {
      const [logs, flocks] = await Promise.all([
        ProductionService.getLogs(),
        FlockService.getFlocks()
      ]);
      this.logs = logs;
      this.flocks = flocks;
    } catch (err) {
      this.error = "Failed to retrieve operational data logs.";
    } finally {
      this.loading = false;
    }
  }

  openRecordModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  async handleSave(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Numeric conversion
    data.flock_id = parseInt(data.flock_id);
    data.egg_count = parseInt(data.egg_count || 0);
    data.cracked_count = parseInt(data.cracked_count || 0);
    data.mortality_count = parseInt(data.mortality_count || 0);
    data.feed_consumed_kg = parseFloat(data.feed_consumed_kg || 0);

    this.saving = true;
    try {
      await ProductionService.recordLog(data);
      this.closeModal();
      await this.fetchData();
    } catch (err) {
      alert('Operational record commit failed: ' + err.message);
    } finally {
      this.saving = false;
    }
  }

  async handleDelete(row) {
    if (confirm('Authorize deletion of this operational log?')) {
      await ProductionService.deleteLog(row.id);
      await this.fetchData();
    }
  }

  renderStats() {
    const filteredLogs = this.logs.filter(l => l.flock_type.toLowerCase() === this.mode);
    const totalEggs = filteredLogs.reduce((sum, l) => sum + (l.egg_count || 0), 0);
    const totalMortality = filteredLogs.reduce((sum, l) => sum + (l.mortality_count || 0), 0);
    const totalFeed = filteredLogs.reduce((sum, l) => sum + (l.feed_consumed_kg || 0), 0);

    if (this.mode === 'layers') {
        return html`
            <stat-card label="Aggregate Yield" value="${totalEggs.toLocaleString()}" icon="egg" colorClass="bg-amber-500"></stat-card>
            <stat-card label="Total Deficit" value="${filteredLogs.reduce((sum, l) => sum + (l.cracked_count || 0), 0)}" icon="warning" colorClass="bg-rose-500"></stat-card>
            <stat-card label="Input Analysis" value="${totalFeed}kg" icon="inventory_2" colorClass="bg-emerald-500"></stat-card>
            <stat-card label="Cycle Average" value="${filteredLogs.length ? Math.round(totalEggs / filteredLogs.length) : 0}" icon="monitoring" colorClass="bg-blue-500"></stat-card>
        `;
    }

    return html`
        <stat-card label="Mortality Loss" value="${totalMortality}" icon="monitoring" colorClass="bg-rose-500"></stat-card>
        <stat-card label="Input Total" value="${totalFeed}kg" icon="inventory_2" colorClass="bg-emerald-500"></stat-card>
        <stat-card label="Record Volume" value="${filteredLogs.length}" icon="assignment" colorClass="bg-blue-500"></stat-card>
        <stat-card label="Efficiency" value="N/A" icon="scale" colorClass="bg-amber-500"></stat-card>
    `;
  }

  render() {
    if (this.loading || this.error) return super.render();

    const filteredLogs = this.logs.filter(l => l.flock_type.toLowerCase() === this.mode);

    return html`
      <div class="space-y-6 animate-in fade-in duration-500">
        <!-- Header -->
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex flex-col gap-0.5">
            <h1 class="text-2xl font-bold text-md-on-surface dark:text-md-dark-on-surface tracking-tight">Production Management</h1>
            <p class="text-md-on-surface-variant dark:text-md-dark-on-surface-variant text-[12px] font-medium uppercase tracking-wider">Operation / Asset Monitoring</p>
          </div>

          <div class="flex items-center gap-2">
            <select
              class="bg-md-surface-variant/30 dark:bg-md-dark-surface-variant/30 border border-md-outline/20 dark:border-md-dark-outline/20 rounded-md-xs px-3 py-1.5 text-xs font-bold text-md-on-surface dark:text-md-dark-on-surface outline-none transition-all appearance-none"
              @change=${e => this.mode = e.target.value}
            >
              <option value="layers">LAYER ASSETS</option>
              <option value="broilers">BROILER ASSETS</option>
            </select>

            <ui-button 
                variant="filled"
                size="sm"
                label="Log Production" 
                icon="add" 
                @click=${this.openRecordModal}>
            </ui-button>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          ${this.renderStats()}
        </div>

        <!-- Logs -->
        <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between border-b border-md-outline/10 dark:border-md-dark-outline/10 pb-2">
                <h2 class="text-[14px] font-bold text-md-on-surface dark:text-md-dark-on-surface uppercase tracking-wider">Operational Audit logs</h2>
            </div>

            <ui-table
                .columns=${this.mode === 'layers' ? this.layerColumns : this.broilerColumns}
                .data=${filteredLogs}
                .actions=${[
                    { label: 'Delete', icon: 'delete', handler: (row) => this.handleDelete(row) },
                ]}>
            </ui-table>
        </div>

        <!-- Record Modal -->
        ${this.isModalOpen ? html`
            <ui-modal 
                .open=${this.isModalOpen} 
                title="Operational Data Entry"
                @modal-close=${this.closeModal}>
                
                <form id="prodForm" slot="body" @submit=${this.handleSave} class="space-y-4">
                    <div class="flex flex-col gap-1.5">
                        <label class="text-[11px] font-bold text-md-on-surface-variant dark:text-md-dark-on-surface-variant uppercase tracking-wider">Asset Unit Selection</label>
                        <select name="flock_id" required 
                            class="bg-md-surface-variant/30 dark:bg-md-dark-surface-variant/30 border border-md-outline/20 dark:border-md-dark-outline/20 rounded-md-xs px-3 py-2 text-[13px] text-md-on-surface dark:text-md-dark-on-surface outline-none transition-all">
                            <option value="">-- AUTHORIZE UNIT --</option>
                            ${this.flocks.map(f => html`<option value="${f.id}">${f.name} (${f.type})</option>`)}
                        </select>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1.5">
                            <label class="text-[11px] font-bold text-md-on-surface-variant dark:text-md-dark-on-surface-variant uppercase tracking-wider">Yield Quantity</label>
                            <input type="number" name="egg_count" defaultValue="0" 
                                class="bg-md-surface-variant/30 dark:bg-md-dark-surface-variant/30 border border-md-outline/20 dark:border-md-dark-outline/20 rounded-md-xs px-3 py-2 text-[13px] text-md-on-surface dark:text-md-dark-on-surface focus:border-md-primary outline-none transition-all" />
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label class="text-[11px] font-bold text-md-on-surface-variant dark:text-md-dark-on-surface-variant uppercase tracking-wider">Damaged Yield</label>
                            <input type="number" name="cracked_count" defaultValue="0" 
                                class="bg-md-surface-variant/30 dark:bg-md-dark-surface-variant/30 border border-md-outline/20 dark:border-md-dark-outline/20 rounded-md-xs px-3 py-2 text-[13px] text-md-on-surface dark:text-md-dark-on-surface focus:border-md-primary outline-none transition-all" />
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label class="text-[11px] font-bold text-md-on-surface-variant dark:text-md-dark-on-surface-variant uppercase tracking-wider">Mortality Count</label>
                            <input type="number" name="mortality_count" defaultValue="0" 
                                class="bg-md-surface-variant/30 dark:bg-md-dark-surface-variant/30 border border-md-outline/20 dark:border-md-dark-outline/20 rounded-md-xs px-3 py-2 text-[13px] text-md-on-surface dark:text-md-dark-on-surface focus:border-md-primary outline-none transition-all" />
                        </div>
                        <div class="flex flex-col gap-1.5">
                            <label class="text-[11px] font-bold text-md-on-surface-variant dark:text-md-dark-on-surface-variant uppercase tracking-wider">Resource allocation (kg)</label>
                            <input type="number" step="0.1" name="feed_consumed_kg" defaultValue="0" 
                                class="bg-md-surface-variant/30 dark:bg-md-dark-surface-variant/30 border border-md-outline/20 dark:border-md-dark-outline/20 rounded-md-xs px-3 py-2 text-[13px] text-md-on-surface dark:text-md-dark-on-surface focus:border-md-primary outline-none transition-all" />
                        </div>
                    </div>

                    <div class="flex flex-col gap-1.5">
                        <label class="text-[11px] font-bold text-md-on-surface-variant dark:text-md-dark-on-surface-variant uppercase tracking-wider">Audit Remarks</label>
                        <textarea name="notes" rows="2" 
                            class="bg-md-surface-variant/30 dark:bg-md-dark-surface-variant/30 border border-md-outline/20 dark:border-md-dark-outline/20 rounded-md-xs px-3 py-2 text-[13px] text-md-on-surface dark:text-md-dark-on-surface focus:border-md-primary outline-none transition-all placeholder:text-neutral-400"></textarea>
                    </div>
                </form>

                <div slot="footer" class="flex gap-2">
                    <ui-button variant="outlined" size="sm" label="Discard" @click=${this.closeModal}></ui-button>
                    <ui-button type="submit" form="prodForm" size="sm" .loading=${this.saving} label="Commit Record"></ui-button>
                </div>
            </ui-modal>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('production-page', ProductionPage);
