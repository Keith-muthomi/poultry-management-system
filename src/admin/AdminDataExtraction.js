import { html } from 'lit';
import { BasePage } from '../components/base/BasePage.js';
import { AdminService } from '../services/AdminService.js';

// This page lets admins download all the system data as a JSON file.
// Good for backups or if we need to move the data somewhere else.
export class AdminDataExtraction extends BasePage {
  static properties = {
    ...BasePage.properties,
    toast: { type: Object }
  };

  constructor() {
    super();
    this.toast = { open: false, message: '', type: 'info' };
  }

  // Handles the export button click. It calls the service and shows a toast if it worked or failed.
  async handleExport() {
    try {
      await AdminService.exportData();
      this.toast = { open: true, message: 'System data exported successfully.', type: 'success' };
    } catch (err) {
      this.toast = { open: true, message: 'Failed to export data.', type: 'error' };
    }
  }

  renderContent() {
    return html`
      <div class="space-y-6 animate-in fade-in duration-500">
        <div class="flex flex-col gap-0.5">
          <h1 class="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">Data Extraction</h1>
          <p class="text-neutral-500 text-[12px] font-medium uppercase tracking-wider">Database Portability / JSON Export</p>
        </div>

        <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/5 rounded-md-lg p-8">
          <div class="flex flex-col gap-2 mb-6">
            <h2 class="text-neutral-900 dark:text-white font-bold text-[18px]">Download System Snapshot</h2>
            <p class="text-neutral-500 text-[14px]">Extract all relational data including Users, Flocks, Production, and Finance records into a single portable JSON file.</p>
          </div>
          
          <div class="p-4 bg-error-600/5 dark:bg-error-600/10 border border-error-500/20 rounded-md-lg mb-8">
            <p class="text-error-700 dark:text-error-400 text-[13px] flex items-center gap-2">
              <span class="material-symbols-rounded text-[18px]">info</span>
              This operation includes sensitive system data. Ensure the exported file is handled securely.
            </p>
          </div>

          <ui-button variant="filled" size="lg" label="Generate Full Export" icon="download" @click=${this.handleExport}></ui-button>
        </div>

        <ui-toast .open=${this.toast.open} .message=${this.toast.message} .type=${this.toast.type} @toast-closed=${() => this.toast = { ...this.toast, open: false }}></ui-toast>
      </div>
    `;
  }
}
customElements.define('admin-data-extraction', AdminDataExtraction);
