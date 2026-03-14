import { LitElement, html } from 'lit';

export class UITable extends LitElement {
  createRenderRoot() { return this; }

  static properties = {
    columns: { type: Array },
    data: { type: Array },
    actions: { type: Array },
    loading: { type: Boolean },
    emptyMessage: { type: String },
  };

  constructor() {
    super();
    this.columns = [];
    this.data = [];
    this.actions = [];
    this.loading = false;
    this.emptyMessage = 'No data available';
  }

  _renderCell(row, col) {
    const value = row[col.key];
    if (col.render) return col.render(value, row);
    return value ?? '—';
  }

  _renderActions(row) {
    if (!this.actions.length) return '';

    return html`
      <td class="px-2 py-1.5 text-right border-b border-md-outline/5 dark:border-md-dark-outline/5">
        <div class="flex items-center justify-end gap-0.5">
          ${this.actions.map(action => html`
            <button
              @click=${(e) => { e.stopPropagation(); action.handler(row); }}
              title=${action.label}
              class="p-1.5 rounded-md-full text-md-on-surface-variant dark:text-md-dark-on-surface-variant hover:bg-md-primary/10 dark:hover:bg-md-dark-primary/10 transition-colors">
              <span class="material-symbols-rounded text-[18px] leading-none">${action.icon}</span>
            </button>
          `)}
        </div>
      </td>
    `;
  }

  render() {
    return html`
      <div class="w-full bg-md-surface dark:bg-md-dark-surface rounded-md-md border border-md-outline/10 dark:border-md-dark-outline/10 overflow-hidden shadow-elevation-1 transition-all duration-300">
        <div class="overflow-x-auto">
          <table class="w-full text-[13px] text-left border-collapse">
            <thead>
              <tr class="bg-md-surface-variant/50 dark:bg-md-dark-surface-variant/50 border-b border-md-outline/10 dark:border-md-dark-outline/10">
                ${this.columns.map(col => html`
                  <th class="px-4 py-2.5 font-bold text-md-on-surface-variant dark:text-md-dark-on-surface-variant uppercase tracking-wider text-[11px]
                    ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}">
                    ${col.label}
                  </th>`)}
                ${this.actions.length ? html`<th class="px-4 py-2.5"></th>` : ''}
              </tr>
            </thead>

            <tbody>
              ${this.loading ? html`
                ${[...Array(3)].map(() => html`
                  <tr>
                    ${this.columns.map(() => html`
                      <td class="px-4 py-3 border-b border-md-outline/5 dark:border-md-dark-outline/5"><div class="h-3 bg-md-surface-variant dark:bg-md-dark-surface-variant rounded w-3/4 animate-pulse"></div></td>`)}
                    ${this.actions.length ? html`<td class="px-4 py-3 border-b border-md-outline/5 dark:border-md-dark-outline/5"></td>` : ''}
                  </tr>`)}
              ` : this.data.length === 0 ? html`
                <tr>
                  <td colspan="100%" class="px-4 py-10 text-center text-md-on-surface-variant dark:text-md-dark-on-surface-variant opacity-50 italic">
                    ${this.emptyMessage}
                  </td>
                </tr>
              ` : this.data.map(row => html`
                <tr class="hover:bg-md-primary/5 dark:hover:bg-md-dark-primary/5 transition-colors duration-75 group">
                  ${this.columns.map(col => html`
                    <td class="px-4 py-2 border-b border-md-outline/5 dark:border-md-dark-outline/5 text-md-on-surface dark:text-md-dark-on-surface
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
