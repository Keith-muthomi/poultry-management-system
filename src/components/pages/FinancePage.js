import { html } from 'lit';
import { BasePage } from '../base/BasePage.js';
import { FinanceService } from '../../services/FinanceService.js';

// This is where we track all the money coming in and going out.
export class FinancePage extends BasePage {
  static properties = {
    ...BasePage.properties,
    records: { type: Array },
    isModalOpen: { type: Boolean },
    currentRecord: { type: Object },
    saving: { type: Boolean },
    toast: { type: Object }
  };

  constructor() {
    super();
    this.records = [];
    this.isModalOpen = false;
    this.currentRecord = null;
    this.saving = false;
    this.toast = { open: false, message: '', type: 'info' };

    // Setting up the table columns so we know what's what.
    this.columns = [
      { key: 'date', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
      { 
        key: 'type', 
        label: 'Type',
        render: (val) => html`
          <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md-xs border ${val === 'Sale' ? 'bg-success-100/50 text-success-700 border-success-200/20' : 'bg-error-100/50 text-error-700 border-error-200/20'}">
            ${val}
          </span>
        `
      },
      { key: 'category', label: 'Category' },
      { key: 'description', label: 'Description' },
      { 
        key: 'amount', 
        label: 'Amount',
        render: (val, row) => html`
          <span class="font-bold ${row.type === 'Sale' ? 'text-success-600' : 'text-error-600'}">
            ${row.type === 'Sale' ? '+' : '-'}${val.toLocaleString()}
          </span>
        `
      }
    ];

    // These buttons let us edit or delete rows.
    this.actions = [
      { icon: 'edit', label: 'Edit', handler: (row) => this.handleEdit(row) },
      { icon: 'delete', label: 'Delete', handler: (row) => this.handleDelete(row) }
    ];
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchData();
  }

  async fetchData() {
    this.loading = true;
    try {
      this.records = await FinanceService.getFinanceRecords();
    } catch (err) {
      this.error = "Failed to load finance records.";
    } finally {
      this.loading = false;
    }
  }

  showToast(message, type = 'info') {
    this.toast = { open: true, message, type };
  }

  openAddModal() {
    this.currentRecord = { type: 'Sale', category: '', amount: 0, description: '', date: new Date().toISOString().split('T')[0] };
    this.isModalOpen = true;
  }

  handleEdit(row) {
    this.currentRecord = { ...row };
    this.isModalOpen = true;
  }

  async handleDelete(row) {
    if (confirm(`Delete this ${row.type} record?`)) {
      try {
        await FinanceService.deleteFinanceRecord(row.id);
        this.showToast('Record deleted.', 'success');
        await this.fetchData();
      } catch (err) {
        this.showToast('Failed to delete record.', 'error');
      }
    }
  }

  async handleSave(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.amount = parseFloat(data.amount);

    this.saving = true;
    try {
      if (this.currentRecord?.id) {
        await FinanceService.updateFinanceRecord(this.currentRecord.id, data);
        this.showToast('Record updated.', 'success');
      } else {
        await FinanceService.createFinanceRecord(data);
        this.showToast('Record created.', 'success');
      }
      this.isModalOpen = false;
      await this.fetchData();
    } catch (err) {
      this.showToast('Failed to save record.', 'error');
    } finally {
      this.saving = false;
    }
  }

  renderContent() {
    const totalSales = this.records.filter(r => r.type === 'Sale').reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = this.records.filter(r => r.type === 'Expense').reduce((sum, r) => sum + r.amount, 0);
    const revenue = totalSales - totalExpenses;

    return html`
      <div class="space-y-6 animate-in fade-in duration-500">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex flex-col gap-0.5">
            <h1 class="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">Finance Management</h1>
            <p class="text-neutral-500 dark:text-neutral-400 text-[12px] font-medium uppercase tracking-wider">Accounting / Cash Flow</p>
          </div>
          <ui-button variant="filled" size="md" label="Add Record" icon="add" @click=${this.openAddModal}></ui-button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <stat-card label="Total Sales" value="${totalSales.toLocaleString()}" icon="trending_up" colorClass="border-success-500"></stat-card>
          <stat-card label="Total Expenses" value="${totalExpenses.toLocaleString()}" icon="trending_down" colorClass="border-error-500"></stat-card>
          <stat-card label="Net Revenue" value="${revenue.toLocaleString()}" icon="account_balance_wallet" colorClass="${revenue >= 0 ? 'border-primary-500' : 'border-error-500'}"></stat-card>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between border-b border-neutral-200/10 dark:border-neutral-800/10 pb-2">
            <h2 class="text-[14px] font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">Transaction History</h2>
          </div>
          <ui-table .columns=${this.columns} .data=${this.records} .actions=${this.actions}></ui-table>
        </div>

        <ui-modal .open=${this.isModalOpen} .title=${this.currentRecord?.id ? 'Edit Record' : 'Add Record'} @modal-close=${() => this.isModalOpen = false}>
          <form id="financeForm" slot="body" @submit=${this.handleSave} class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Type</label>
                <select name="type" .value=${this.currentRecord?.type} class="w-full bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 outline-none">
                  <option value="Sale">Sale</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Category</label>
                <select name="category" .value=${this.currentRecord?.category} required class="w-full bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 outline-none">
                  <option value="Feed">Feed</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Labor">Labor</option>
                  <option value="Sales">Sales</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Amount</label>
                <input type="number" name="amount" .value=${this.currentRecord?.amount} required class="w-full bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 outline-none" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Date</label>
                <input type="date" name="date" .value=${this.currentRecord?.date} required class="w-full bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 outline-none" />
              </div>
              <div class="col-span-2">
                <label class="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea name="description" .value=${this.currentRecord?.description} rows="2" class="w-full bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 outline-none"></textarea>
              </div>
            </div>
          </form>
          <div slot="footer" class="flex gap-2">
            <ui-button variant="outlined" size="sm" label="Cancel" @click=${() => this.isModalOpen = false}></ui-button>
            <ui-button type="submit" form="financeForm" size="sm" .loading=${this.saving} label="Save Record"></ui-button>
          </div>
        </ui-modal>

        <ui-toast .open=${this.toast.open} .message=${this.toast.message} .type=${this.toast.type} @toast-closed=${() => this.toast = { ...this.toast, open: false }}></ui-toast>
      </div>
    `;
  }
}

customElements.define('finance-page', FinancePage);
