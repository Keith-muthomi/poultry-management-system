import { html } from 'lit';
import { BasePage } from '../base/BasePage.js';
import { RecordsService } from '../../services/RecordsService.js';
import { jsPDF } from 'jspdf';

export class RecordsPage extends BasePage {
  static properties = {
    ...BasePage.properties,
    selectedTable: { type: String },
    data: { type: Array },
    searchTerm: { type: String }
  };

  constructor() {
    super();
    this.selectedTable = 'flocks';
    this.data = [];
    this.searchTerm = '';
    this.tables = [
      { id: 'flocks', label: 'Flock Assets', icon: 'inventory' },
      { id: 'production', label: 'Production Logs', icon: 'egg' },
      { id: 'finance', label: 'Financial Records', icon: 'payments' },
      { id: 'supplies', label: 'Supplies Inventory', icon: 'category' }
    ];
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchData();
  }

  async fetchData() {
    this.loading = true;
    try {
      this.data = await RecordsService.getTableRecords(this.selectedTable);
    } catch (err) {
      this.error = "Failed to load records.";
    } finally {
      this.loading = false;
    }
  }

  async handleTableChange(tableId) {
    this.selectedTable = tableId;
    this.searchTerm = '';
    await this.fetchData();
  }

  handleSearch(e) {
    this.searchTerm = e.target.value.toLowerCase();
  }

  downloadPDF() {
    const doc = new jsPDF({ orientation: 'landscape' }); // Landscape fits more columns
    const filteredData = this.getFilteredData();
    const tableName = this.tables.find(t => t.id === this.selectedTable)?.label || 'Report';

    // PDF Dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const availableWidth = pageWidth - (margin * 2);

    // PDF Header
    doc.setFontSize(20);
    doc.setTextColor(22, 163, 74); 
    doc.text('PoultryDocs Official Record', margin, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Entity: ${tableName} | Generated: ${new Date().toLocaleString()} | Total: ${filteredData.length} records`, margin, 28);
    doc.line(margin, 32, pageWidth - margin, 32);

    if (filteredData.length > 0) {
      const keys = Object.keys(filteredData[0]);
      const colWidth = availableWidth / keys.length;
      
      // Dynamic Font Size based on column count
      let fontSize = 9;
      if (keys.length > 8) fontSize = 7;
      if (keys.length > 12) fontSize = 6;
      
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);

      let y = 42;
      
      // Header
      keys.forEach((key, i) => {
        const x = margin + (i * colWidth);
        const label = key.replace(/_/g, ' ').toUpperCase();
        doc.text(doc.splitTextToSize(label, colWidth - 2), x, y);
      });

      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60);

      // Rows
      filteredData.forEach((row) => {
        if (y > 185) { // Landscape page limit
          doc.addPage();
          y = 20;
        }

        keys.forEach((key, i) => {
          const x = margin + (i * colWidth);
          let val = String(row[key] || '');
          
          // Truncate text if it's too long for the column
          const textWidth = doc.getTextWidth(val);
          if (textWidth > colWidth - 2) {
             val = doc.splitTextToSize(val, colWidth - 2)[0] + '...';
          }

          doc.text(val, x, y);
        });
        y += 6;
      });
    } else {
      doc.text('No records found.', margin, 42);
    }

    doc.save(`PoultryDocs_${this.selectedTable}_Report.pdf`);
  }

  getFilteredData() {
    if (!this.searchTerm) return this.data;
    return this.data.filter(row => 
      Object.values(row).some(val => 
        String(val).toLowerCase().includes(this.searchTerm)
      )
    );
  }

  renderContent() {
    const filteredData = this.getFilteredData();
    const columns = this.data.length > 0 ? Object.keys(this.data[0]).map(key => ({
      key,
      label: key.replace(/_/g, ' ').toUpperCase()
    })) : [];

    return html`
      <style>
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; }
          .card { border: none !important; box-shadow: none !important; }
        }
      </style>

      <div class="space-y-6 animate-in fade-in duration-500">
        <!-- Header -->
        <div class="flex items-center justify-between flex-wrap gap-4 no-print">
          <div class="flex flex-col gap-0.5">
            <h1 class="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">System Records</h1>
            <p class="text-neutral-500 dark:text-neutral-400 text-[12px] font-medium uppercase tracking-wider">Reports / Data Explorer</p>
          </div>
          <ui-button variant="outlined" size="md" label="Export PDF" icon="picture_as_pdf" @click=${this.downloadPDF}></ui-button>
        </div>

        <!-- Controls Bar -->
        <div class="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-lg p-3 flex flex-wrap gap-4 items-center no-print">
          <div class="flex items-center gap-2 flex-grow min-w-[240px]">
            <div class="relative w-48">
              <select 
                @change=${(e) => this.handleTableChange(e.target.value)}
                .value=${this.selectedTable}
                class="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-md px-3 py-2 text-[13px] font-bold text-neutral-900 dark:text-neutral-50 outline-none appearance-none focus:ring-2 ring-primary-500/20"
              >
                ${this.tables.map(t => html`<option value="${t.id}">${t.label}</option>`)}
              </select>
              <span class="absolute right-2 top-1/2 -translate-y-1/2 material-symbols-rounded text-neutral-400 pointer-events-none">unfold_more</span>
            </div>

            <div class="relative flex-grow">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-rounded text-neutral-400 text-[18px]">search</span>
              <input 
                type="text" 
                placeholder="Search within ${this.selectedTable}..." 
                .value=${this.searchTerm}
                @input=${this.handleSearch}
                class="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-md pl-10 pr-4 py-2 text-[13px] focus:ring-2 ring-primary-500/20 outline-none" />
            </div>
          </div>
          
          <div class="text-[12px] font-bold text-neutral-400 uppercase tracking-widest hidden md:block">
            ${filteredData.length} records found
          </div>
        </div>

        <!-- Data Table -->
        <div class="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 rounded-lg overflow-hidden card">
          <div class="overflow-x-auto">
            <ui-table .columns=${columns} .data=${filteredData}></ui-table>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('records-page', RecordsPage);
