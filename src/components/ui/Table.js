import { LitElement, html } from 'lit';

export class UITable extends LitElement {
  createRenderRoot() { return this; }

  static properties = {
    columns: { type: Array },   // [{ key, label, width?, align? }]
    data: { type: Array },      // [{ ...rowData }]
    actions: { type: Array },   // [{ label, icon, variant?, handler }]
    loading: { type: Boolean },
    emptyMessage: { type: String },
    selectable: { type: Boolean },
    selectedRows: { type: Array },
  };

  constructor() {
    super();
    this.columns = [];
    this.data = [];
    this.actions = [];
    this.loading = false;
    this.emptyMessage = 'No data available';
    this.selectable = false;
    this.selectedRows = [];
  }

  _toggleRow(row) {
    const exists = this.selectedRows.find(r => r === row);
    this.selectedRows = exists
      ? this.selectedRows.filter(r => r !== row)
      : [...this.selectedRows, row];
    this.dispatchEvent(new CustomEvent('selection-change', { detail: { selected: this.selectedRows } }));
  }

  _toggleAll(e) {
    this.selectedRows = e.target.checked ? [...this.data] : [];
    this.dispatchEvent(new CustomEvent('selection-change', { detail: { selected: this.selectedRows } }));
  }

  _isSelected(row) {
    return this.selectedRows.includes(row);
  }

  _renderCell(row, col) {
    const value = row[col.key];
    if (col.render) return col.render(value, row);
    return value ?? '—';
  }

  _renderActions(row) {
    if (!this.actions.length) return '';

    const variantClasses = {
      primary: 'text-primary-600 hover:text-primary-800 hover:bg-primary-50',
      danger:  'text-error-600 hover:text-error-800 hover:bg-error-50',
      ghost:   'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
    };

    return html`
      <td class="px-4 py-3 text-right">
        <div class="flex items-center justify-end gap-1">
          ${this.actions.map(action => html`
            <button
              @click=${(e) => { e.stopPropagation(); action.handler(row); }}
              title=${action.label}
              class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-150
                ${variantClasses[action.variant ?? 'ghost']}">
              ${action.icon ? html`<span class="material-symbols-rounded" style="font-size:16px">${action.icon}</span>` : ''}
              ${action.showLabel ? html`<span>${action.label}</span>` : ''}
            </button>
          `)}
        </div>
      </td>
    `;
  }

  render() {
    const allSelected = this.data.length > 0 && this.selectedRows.length === this.data.length;
    const someSelected = this.selectedRows.length > 0 && !allSelected;

    return html`
      <div class="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">

            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                ${this.selectable ? html`
                  <th class="px-4 py-3 w-10">
                    <input type="checkbox"
                      .checked=${allSelected}
                      .indeterminate=${someSelected}
                      @change=${this._toggleAll}
                      class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"/>
                  </th>` : ''}

                ${this.columns.map(col => html`
                  <th class="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide
                    ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                    ${col.width ? `w-[${col.width}]` : ''}">
                    ${col.label}
                  </th>`)}

                ${this.actions.length ? html`<th class="px-4 py-3 w-24"></th>` : ''}
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100">

              ${this.loading ? html`
                ${[...Array(4)].map(() => html`
                  <tr>
                    ${this.selectable ? html`<td class="px-4 py-3"><div class="h-4 w-4 bg-gray-200 rounded animate-pulse"></div></td>` : ''}
                    ${this.columns.map(() => html`
                      <td class="px-4 py-3">
                        <div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      </td>`)}
                    ${this.actions.length ? html`<td class="px-4 py-3"></td>` : ''}
                  </tr>`)}
              ` : this.data.length === 0 ? html`
                <tr>
                  <td colspan=${this.columns.length + (this.selectable ? 1 : 0) + (this.actions.length ? 1 : 0)}
                    class="px-4 py-12 text-center text-gray-400 text-sm">
                    <span class="material-symbols-rounded text-3xl block mb-2">inbox</span>
                    ${this.emptyMessage}
                  </td>
                </tr>
              ` : this.data.map(row => html`
                <tr class="hover:bg-gray-50 transition-colors duration-100
                  ${this._isSelected(row) ? 'bg-primary-50' : ''}
                  ${this.selectable ? 'cursor-pointer' : ''}">

                  ${this.selectable ? html`
                    <td class="px-4 py-3" @click=${() => this._toggleRow(row)}>
                      <input type="checkbox"
                        .checked=${this._isSelected(row)}
                        @click=${(e) => e.stopPropagation()}
                        @change=${() => this._toggleRow(row)}
                        class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"/>
                    </td>` : ''}

                  ${this.columns.map(col => html`
                    <td class="px-4 py-3 text-gray-700
                      ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}">
                      ${this._renderCell(row, col)}
                    </td>`)}

                  ${this._renderActions(row)}
                </tr>`)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

customElements.define('ui-table', UITable);