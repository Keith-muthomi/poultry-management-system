import { LitElement, html } from 'lit';
import { BasePage } from '../base/BasePage.js';
import { ProductionService } from '../../services/ProductionService.js';
import { FlockService } from '../../services/FlockService.js';

// This page is where we keep track of how many eggs were laid and if any birds died
export class ProductionPage extends BasePage {

  static properties = {
    ...BasePage.properties,
    mode: { type: String }, // either 'layers' or 'broilers'
    logs: { type: Array },
    flocks: { type: Array },
    isModalOpen: { type: Boolean },
    saving: { type: Boolean },
    toast: { type: Object }
  };

  constructor() {
    super();
    this.mode = "layers";
    this.logs = [];
    this.flocks = [];
    this.isModalOpen = false;
    this.saving = false;
    this.toast = { open: false, message: '', type: 'info' };

    // Tables for layers (the ones that lay eggs)
    this.layerColumns = [
      { key: 'date', label: 'Cycle Date', render: (val) => new Date(val).toLocaleDateString() },
      { key: 'flock_name', label: 'Asset Unit' },
      { key: 'egg_count', label: 'Yield' },
      { key: 'cracked_count', label: 'Loss (Broken)', render: (val) => html`<span class="text-error-600 dark:text-error-500 font-bold">${val}</span>` },
      { key: 'mortality_count', label: 'Loss (Mort)', render: (val) => html`<span class="text-error-600 dark:text-error-500 font-bold">${val}</span>` },
      { key: 'feed_consumed_kg', label: 'Resource (kg)' },
    ];

    // Tables for broilers (the ones for meat)
    this.broilerColumns = [
      { key: 'date', label: 'Cycle Date', render: (val) => new Date(val).toLocaleDateString() },
      { key: 'flock_name', label: 'Asset Unit' },
      { key: 'mortality_count', label: 'Loss', render: (val) => html`<span class="text-error-600 dark:text-error-500 font-bold">${val}</span>` },
      { key: 'feed_consumed_kg', label: 'Resource (kg)' },
      { key: 'notes', label: 'Internal Notes' }
    ];
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchData();
  }

  // Go grab all the production logs and flock info from the server
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

  showToast(message, type = 'info') {
    this.toast = { open: true, message, type };
  }

  openRecordModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // Save the new production log
  async handleSave(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Convert strings to numbers so the database doesn't complain
    data.flock_id = parseInt(data.flock_id);
    data.egg_count = parseInt(data.egg_count || 0);
    data.cracked_count = parseInt(data.cracked_count || 0);
    data.mortality_count = parseInt(data.mortality_count || 0);
    data.feed_consumed_kg = parseFloat(data.feed_consumed_kg || 0);

    this.saving = true;
    try {
      await ProductionService.recordLog(data);
      this.showToast('Production log recorded successfully.', 'success');
      this.closeModal();
      await this.fetchData();
    } catch (err) {
      this.showToast(`Failed to record log: ${err.message}`, 'error');
    } finally {
      this.saving = false;
    }
  }

  // Delete a log entry, but ask first!
  async handleDelete(row) {
    if (confirm('Authorize deletion of this operational log?')) {
      try {
        await ProductionService.deleteLog(row.id);
        this.showToast('Log deleted successfully.', 'success');
        await this.fetchData();
      } catch (err) {
        this.showToast('Failed to delete log.', 'error');
      }
    }
  }

  // Calculate the totals for the top cards based on the selected mode
  renderStats() {
    const filteredLogs = this.logs.filter(l => l.flock_type.toLowerCase() === this.mode);
    const totalEggs = filteredLogs.reduce((sum, l) => sum + (l.egg_count || 0), 0);
    const totalMortality = filteredLogs.reduce((sum, l) => sum + (l.mortality_count || 0), 0);
    const totalFeed = filteredLogs.reduce((sum, l) => sum + (l.feed_consumed_kg || 0), 0);

    if (this.mode === 'layers') {
        return html`
            <stat-card label="Aggregate Yield" value="${totalEggs.toLocaleString()}" icon="egg" colorClass="border-secondary-500"></stat-card>
            <stat-card label="Total Deficit" value="${filteredLogs.reduce((sum, l) => sum + (l.cracked_count || 0), 0)}" icon="warning" colorClass="border-error-500"></stat-card>
            <stat-card label="Input Analysis" value="${totalFeed}kg" icon="inventory_2" colorClass="border-tertiary-500"></stat-card>
            <stat-card label="Cycle Average" value="${filteredLogs.length ? Math.round(totalEggs / filteredLogs.length) : 0}" icon="monitoring" colorClass="border-primary-500 dark:border-primary-400"></stat-card>
        `;
    }

    return html`
        <stat-card label="Mortality Loss" value="${totalMortality}" icon="monitoring" colorClass="border-error-500"></stat-card>
        <stat-card label="Input Total" value="${totalFeed}kg" icon="inventory_2" colorClass="border-tertiary-500"></stat-card>
        <stat-card label="Record Volume" value="${filteredLogs.length}" icon="assignment" colorClass="border-primary-500 dark:border-primary-400"></stat-card>
        <stat-card label="Efficiency" value="N/A" icon="scale" colorClass="border-secondary-500"></stat-card>
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
            <h1 class="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">Production Management</h1>
            <p class="text-neutral-500 dark:text-neutral-400 text-[12px] font-medium uppercase tracking-wider">Operation / Asset Monitoring</p>
          </div>

          <div class="flex items-center gap-2">
            <select
              class="bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-1.5 text-xs font-bold text-neutral-900 dark:text-neutral-50 outline-none transition-all appearance-none"
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
            <div class="flex items-center justify-between border-b border-neutral-200/10 dark:border-neutral-800/10 pb-2">
                <h2 class="text-[14px] font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">Operational Audit logs</h2>
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
        <ui-modal 
            .open=${this.isModalOpen} 
            title="Operational Data Entry"
            @modal-close=${this.closeModal}>
            
            <form id="prodForm" slot="body" @submit=${this.handleSave} class="space-y-4">
                <div class="flex flex-col gap-1.5">
                    <label class="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Asset Unit Selection</label>
                    <select name="flock_id" required 
                        class="bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 outline-none transition-all">
                        <option value="">-- AUTHORIZE UNIT --</option>
                        ${this.flocks.map(f => html`<option value="${f.id}">${f.name} (${f.type})</option>`)}
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1.5">
                        <label class="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Yield Quantity</label>
                        <input type="number" name="egg_count" defaultValue="0" 
                            class="bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 focus:border-primary-500 outline-none transition-all" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Damaged Yield</label>
                        <input type="number" name="cracked_count" defaultValue="0" 
                            class="bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 focus:border-primary-500 outline-none transition-all" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Mortality Count</label>
                        <input type="number" name="mortality_count" defaultValue="0" 
                            class="bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 focus:border-primary-500 outline-none transition-all" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Resource allocation (kg)</label>
                        <input type="number" step="0.1" name="feed_consumed_kg" defaultValue="0" 
                            class="bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 focus:border-primary-500 outline-none transition-all" />
                    </div>
                </div>

                <div class="flex flex-col gap-1.5">
                    <label class="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Audit Remarks</label>
                    <textarea name="notes" rows="2" 
                        class="bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 focus:border-primary-500 outline-none transition-all placeholder:text-neutral-500/50"></textarea>
                </div>
            </form>

            <div slot="footer" class="flex gap-2">
                <ui-button variant="outlined" size="sm" label="Discard" @click=${this.closeModal}></ui-button>
                <ui-button type="submit" form="prodForm" size="sm" .loading=${this.saving} label="Commit Record"></ui-button>
            </div>
        </ui-modal>
        <ui-toast 
            .open=${this.toast.open} 
            .message=${this.toast.message} 
            .type=${this.toast.type}
            @toast-closed=${() => this.toast = { ...this.toast, open: false }}>
        </ui-toast>
      </div>
    `;
  }
}

customElements.define('production-page', ProductionPage);
