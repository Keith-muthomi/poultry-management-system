import { LitElement, html } from 'lit';
import { BasePage } from '../base/BasePage.js';
import { FlockService } from '../../services/FlockService.js';

export class FlockPage extends BasePage {

  static properties = {
    ...BasePage.properties,
    flocks: { type: Array },
    isModalOpen: { type: Boolean },
    currentFlock: { type: Object }, 
    saving: { type: Boolean },
    toast: { type: Object }
  };

  constructor() {
    super();
    this.flocks = [];
    this.isModalOpen = false;
    this.currentFlock = null;
    this.saving = false;
    this.toast = { open: false, message: '', type: 'info' };

    this.columns = [
      { key: 'name', label: 'Flock Identity' },
      { 
        key: 'type', 
        label: 'Type',
        render: (val) => html`
          <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md-xs border ${val === 'Layers' ? 'bg-primary-100/50 text-primary-700 dark:text-primary-300 border-primary-200/20' : 'bg-tertiary-100/50 text-tertiary-700 dark:text-tertiary-300 border-tertiary-200/20'}">
            ${val}
          </span>
        `
      },
      { key: 'breed', label: 'Genetic Breed' },
      { 
        key: 'current_count', 
        label: 'Quantity',
        render: (val) => val.toLocaleString()
      },
      { 
        key: 'hatch_date', 
        label: 'Registry Date',
        render: (val) => val ? new Date(val).toLocaleDateString() : '—'
      },
      { key: 'pen_id', label: 'Unit' },
      { 
        key: 'status', 
        label: 'Status',
        render: (val) => html`
          <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md-xs border ${val === 'Active' ? 'bg-success-100/50 text-success-700 border-success-200/20' : 'bg-neutral-200 text-neutral-600 border-neutral-300/20'}">
            ${val}
          </span>
        `
      }
    ];

    this.tableActions = [
      { icon: 'edit', label: 'Modify', handler: (row) => this.handleEdit(row) },
      { icon: 'delete', label: 'Remove', handler: (row) => this.handleDelete(row) }
    ];
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchData();
  }

  async fetchData() {
    this.loading = true;
    try {
      this.flocks = await FlockService.getFlocks();
      this.error = null;
    } catch (err) {
      this.error = 'Failed to load flocks. Is the backend server running?';
    } finally {
      this.loading = false;
    }
  }

  showToast(message, type = 'info') {
    this.toast = { open: true, message, type };
  }

  openAddModal() {
    this.currentFlock = { name: '', type: 'Layers', breed: '', count: 0, hatch_date: '', pen_id: '' };
    this.isModalOpen = true;
  }

  handleEdit(row) {
    this.currentFlock = { ...row, count: row.current_count }; 
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.currentFlock = null;
  }

  async handleSave(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    data.count = parseInt(data.count);
    if (this.currentFlock?.id) {
        data.current_count = data.count;
    }

    this.saving = true;
    try {
      if (this.currentFlock?.id) {
        await FlockService.updateFlock(this.currentFlock.id, data);
        this.showToast('Flock updated successfully.', 'success');
      } else {
        await FlockService.createFlock(data);
        this.showToast('Flock created successfully.', 'success');
      }
      this.closeModal();
      await this.fetchData();
    } catch (err) {
      this.showToast(`Failed to save flock: ${err.message}`, 'error');
    } finally {
      this.saving = false;
    }
  }

  async handleDelete(row) {
    if (confirm(`Are you sure you want to delete ${row.name}?`)) {
      try {
        await FlockService.deleteFlock(row.id);
        this.showToast('Flock deleted successfully.', 'success');
        await this.fetchData();
      } catch (err) {
        this.showToast('Failed to delete flock.', 'error');
      }
    }
  }

  renderFlockModal() {
    return html`
      <ui-modal 
          .open=${this.isModalOpen} 
          .title=${this.currentFlock?.id ? 'Edit Asset Record' : 'Register New Asset'}
          @modal-close=${this.closeModal}>
          
          <form id="flockForm" slot="body" @submit=${this.handleSave} class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                  <div class="col-span-2">
                      <label class="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Identification Name</label>
                      <input name="name" .value=${this.currentFlock?.name || ''} required
                          class="w-full bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 focus:border-primary-500 outline-none transition-all" />
                  </div>
                  
                  <div>
                      <label class="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Asset Classification</label>
                      <select name="type" .value=${this.currentFlock?.type || 'Layers'}
                          class="w-full bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 focus:border-primary-500 outline-none transition-all">
                          <option value="Layers">Layers</option>
                          <option value="Broilers">Broilers</option>
                      </select>
                  </div>

                  <div>
                      <label class="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Genetic Breed</label>
                      <input name="breed" .value=${this.currentFlock?.breed || ''}
                          class="w-full bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 focus:border-primary-500 outline-none transition-all" />
                  </div>

                  <div>
                      <label class="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Initial Quantity</label>
                      <input type="number" name="count" .value=${this.currentFlock?.count || 0} required
                          class="w-full bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 focus:border-primary-500 outline-none transition-all" />
                  </div>

                  <div>
                      <label class="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Facility ID</label>
                      <input name="pen_id" .value=${this.currentFlock?.pen_id || ''}
                          class="w-full bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 focus:border-primary-500 outline-none transition-all" />
                  </div>

                  <div class="col-span-2 grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Acquisition Date</label>
                        <input type="date" name="hatch_date" .value=${this.currentFlock?.hatch_date || ''}
                            class="w-full bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 focus:border-primary-500 outline-none transition-all" />
                    </div>

                    ${this.currentFlock?.id ? html`
                        <div>
                            <label class="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Status</label>
                            <select name="status" .value=${this.currentFlock?.status || 'Active'}
                                class="w-full bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 focus:border-primary-500 outline-none transition-all">
                                <option value="Active">Active</option>
                                <option value="Sold">Sold</option>
                                <option value="Culled">Culled</option>
                            </select>
                        </div>
                    ` : ''}
                  </div>
              </div>
          </form>

          <div slot="footer" class="flex gap-2">
              <ui-button variant="outlined" size="sm" label="Discard" @click=${this.closeModal}></ui-button>
              <ui-button type="submit" form="flockForm" size="sm" .loading=${this.saving} label="Commit Registry"></ui-button>
          </div>
      </ui-modal>
    `;
  }

  render() {
    if (this.loading || this.error) return super.render();

    return html`
      <div class="space-y-6 animate-in fade-in duration-500">
        <!-- Header -->
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex flex-col gap-0.5">
            <h1 class="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">Inventory Registry</h1>
            <p class="text-neutral-500 dark:text-neutral-400 text-[12px] font-medium uppercase tracking-wider">Management / Active Batches</p>
          </div>

          <ui-button 
            variant="filled"
            size="md"
            label="Register Batch" 
            icon="add" 
            @click=${this.openAddModal}>
          </ui-button>
        </div>

        <!-- Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <stat-card label="Total Assets" value="${this.flocks.reduce((sum, f) => sum + f.current_count, 0).toLocaleString()}" icon="groups" colorClass="border-primary-500 dark:border-primary-400"></stat-card>
          <stat-card label="Operational" value="${this.flocks.filter(f => f.status === 'Active').length}" icon="fact_check" colorClass="border-success-500"></stat-card>
          <stat-card label="Layers" value="${this.flocks.filter(f => f.type === 'Layers').reduce((sum, f) => sum + f.current_count, 0).toLocaleString()}" icon="egg" colorClass="border-secondary-500"></stat-card>
          <stat-card label="Broilers" value="${this.flocks.filter(f => f.type === 'Broilers').reduce((sum, f) => sum + f.current_count, 0).toLocaleString()}" icon="restaurant" colorClass="border-error-500"></stat-card>
        </div>

        <!-- Data Section -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between border-b border-neutral-200/10 dark:border-neutral-800/10 pb-2">
            <h2 class="text-[14px] font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">Asset Registry</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${this.flocks.map(flock => html`
              <flock-card .flock=${flock} .actions=${this.tableActions}></flock-card>
            `)}
          </div>

          ${this.flocks.length === 0 ? html`
            <div class="flex flex-col items-center justify-center py-12 bg-neutral-100/50 dark:bg-neutral-900/50 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
              <span class="material-symbols-rounded text-[48px] text-neutral-400">inventory</span>
              <p class="mt-2 text-neutral-500 dark:text-neutral-400 font-medium">No active batches found in the registry.</p>
              <ui-button variant="outlined" size="sm" label="Register First Batch" class="mt-4" @click=${this.openAddModal}></ui-button>
            </div>
          ` : ''}
        </div>

        <!-- Modal -->
        ${this.renderFlockModal()}
        
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

customElements.define('flock-page', FlockPage);
