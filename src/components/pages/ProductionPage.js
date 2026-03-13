import { LitElement, html } from 'lit';
import { BasePage } from '../base/BasePage.js';
import '../ui/Button.js';
import '../ui/Table.js';

export class ProductionPage extends BasePage {

  mode = "layers";


  renderStatCard(label, value, trend, icon, colorClass) {
    return html`
      <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <span class="p-2 rounded-lg ${colorClass} bg-opacity-10">
            <span class="material-symbols-rounded text-xl ${colorClass.replace('bg-', 'text-')}">${icon}</span>
          </span>
          <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">${trend}</span>
        </div>

        <h3 class="text-gray-500 text-sm font-medium">${label}</h3>
        <p class="text-2xl font-bold text-gray-900 mt-1">${value}</p>
      </div>
    `;
  }


  renderLayerStats() {
    return html`
      ${this.renderStatCard('Eggs Today', '1,248', '+3%', 'egg', 'bg-amber-500')}
      ${this.renderStatCard('Avg Eggs / Bird', '0.82', '+1%', 'monitoring', 'bg-blue-500')}
      ${this.renderStatCard('Broken Eggs', '12', '-0.4%', 'warning', 'bg-rose-500')}
      ${this.renderStatCard('Collection Batches', '3', '+0%', 'schedule', 'bg-emerald-500')}
    `;
  }


  renderBroilerStats() {
    return html`
      ${this.renderStatCard('Avg Weight', '2.1kg', '+0.3%', 'scale', 'bg-blue-500')}
      ${this.renderStatCard('Feed Consumed', '85kg', '+5%', 'inventory_2', 'bg-emerald-500')}
      ${this.renderStatCard('Mortality', '3', '-0.2%', 'monitoring', 'bg-rose-500')}
      ${this.renderStatCard('Ready for Market', '420', '+8%', 'local_shipping', 'bg-amber-500')}
    `;
  }


    renderLayerTable() {
    const columns = [
        { key: 'date',    label: 'Date' },
        { key: 'batch',   label: 'Batch' },
        { key: 'eggs',    label: 'Eggs Collected' },
        { key: 'broken',  label: 'Broken', render: (val) => html`<span class="text-rose-500">${val}</span>` },
        { key: 'collector', label: 'Collector' },
        { key: 'notes',   label: 'Notes', render: (val) => html`<span class="text-gray-500">${val}</span>` },
    ];

    const data = [
        { date: 'Mar 13', batch: 'Batch A', eggs: 420, broken: 3, collector: 'John', notes: 'Normal collection' },
    ];

    return html`
        <ui-table
        .columns=${columns}
        .data=${data}
        .actions=${[
            { label: 'Edit',   icon: 'edit',   variant: 'ghost',  handler: (row) => console.log('edit', row) },
            { label: 'Delete', icon: 'delete', variant: 'danger', handler: (row) => console.log('delete', row) },
        ]}
        .loading=${this.loading}>
        </ui-table>
    `;
    }

    renderBroilerTable() {
    const columns = [
        { key: 'date',      label: 'Date' },
        { key: 'batch',     label: 'Batch' },
        { key: 'weight',    label: 'Avg Weight' },
        { key: 'feed',      label: 'Feed Used' },
        { key: 'mortality', label: 'Mortality', render: (val) => html`<span class="text-rose-500">${val}</span>` },
        { key: 'notes',     label: 'Notes', render: (val) => html`<span class="text-gray-500">${val}</span>` },
    ];

    const data = [
        { date: 'Mar 13', batch: 'Batch B', weight: '2.1kg', feed: '25kg', mortality: 1, notes: 'Healthy growth' },
    ];

    return html`
        <ui-table
        .columns=${columns}
        .data=${data}
        .actions=${[
            { label: 'Edit',   icon: 'edit',   variant: 'ghost',  handler: (row) => console.log('edit', row) },
            { label: 'Delete', icon: 'delete', variant: 'danger', handler: (row) => console.log('delete', row) },
        ]}
        .loading=${this.loading}>
        </ui-table>
    `;
    }

  render() {
    return html`

      <div class="space-y-8">

        <!-- Header -->
        <div class="flex items-center justify-between flex-wrap gap-4">

          <div>
            <h1 class="text-2xl font-bold text-gray-900">Production</h1>
            <p class="text-gray-500 text-sm">Monitor flock production performance.</p>
          </div>

          <div class="flex items-center gap-3">

            <select
              class="text-sm border-gray-200 rounded-lg px-3 py-2"
              @change=${e => {
                this.mode = e.target.value;
                this.requestUpdate();
              }}
            >
              <option value="layers">Layers</option>
              <option value="broilers">Broilers</option>
            </select>

            <ui-button 
            variant="primary" 
            size="md"
            label="Save Changes"
            icon="save"
            ?loading=${this.loading} 
            @click=${this._handleSave}>
            </ui-button>

          </div>

        </div>


        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${this.mode === "layers"
            ? this.renderLayerStats()
            : this.renderBroilerStats()}
        </div>


        <!-- Logs -->
        <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-800">Production Logs</h2>
        </div>

        ${this.mode === 'layers'
          ? this.renderLayerTable()
          : this.renderBroilerTable()}
      </div>

      </div>
    `;
  }
}

customElements.define('production-page', ProductionPage);
