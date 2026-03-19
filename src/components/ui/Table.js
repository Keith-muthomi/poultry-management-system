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
      <td class="px-2 py-1.5 text-right border-b border-neutral-200/5 dark:border-neutral-800/5">
        <div class="flex items-center justify-end gap-0.5">
          ${this.actions.map(action => {
            const icon = typeof action.icon === 'function' ? action.icon(row) : action.icon;
            const label = typeof action.label === 'function' ? action.label(row) : action.label;
            
            return html`
              <button
                @click=${(e) => { e.stopPropagation(); action.handler(row); }}
                title=${label}
                class="p-1.5 rounded-md-full text-neutral-500 dark:text-neutral-400 hover:bg-primary-600/10 dark:hover:bg-primary-500/10 transition-colors">
                <span class="material-symbols-rounded text-[18px] leading-none">${icon}</span>
              </button>
            `;
          })}
        </div>
      </td>
    `;
  }

  render() {
    return html`
      <div class="w-full bg-white dark:bg-neutral-900 rounded-md-md border border-neutral-200/10 dark:border-neutral-800/10 overflow-hidden transition-all duration-300">
        <div class="overflow-x-auto">
          <table class="w-full text-[13px] text-left border-collapse">
            <thead>
              <tr class="bg-neutral-200/50 dark:bg-neutral-800/50 border-b border-neutral-200/10 dark:border-neutral-800/10">
                ${this.columns.map(col => html`
                  <th class="px-4 py-2.5 font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[11px]
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
                      <td class="px-4 py-3 border-b border-neutral-200/5 dark:border-neutral-800/5"><div class="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4 animate-pulse"></div></td>`)}
                    ${this.actions.length ? html`<td class="px-4 py-3 border-b border-neutral-200/5 dark:border-neutral-800/5"></td>` : ''}
                  </tr>`)}
              ` : this.data.length === 0 ? html`
                <tr>
                  <td colspan="100%" class="px-4 py-10 text-center text-neutral-500 dark:text-neutral-400 opacity-50 italic">
                    ${this.emptyMessage}
                  </td>
                </tr>
              ` : this.data.map(row => html`
                <tr class="hover:bg-primary-600/5 dark:hover:bg-primary-500/5 transition-colors duration-75 group">
                  ${this.columns.map(col => html`
                    <td class="px-4 py-2 border-b border-neutral-200/5 dark:border-neutral-800/5 text-neutral-900 dark:text-neutral-50
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
