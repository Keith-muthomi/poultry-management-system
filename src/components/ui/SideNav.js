import { LitElement, html } from 'lit';

export class SideNav extends LitElement {
  createRenderRoot() { return this; }

  static properties = {
    currentPath: { type: String },
    collapsed: { type: Boolean },
    mobileOpen: { type: Boolean }, // New property for mobile state
  };

  constructor() {
    super();
    this.currentPath = window.location.pathname;
    this.collapsed = false;
    this.mobileOpen = false;
  }

  isActive(path) {
    return this.currentPath === path;
  }

  navItem(path, label, icon) {
    const active = this.isActive(path);
    return html`
      <a href=${path} data-link
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 
        ${active ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}">
        <span class="material-symbols-rounded w-5 h-5 flex items-center justify-center">${icon}</span>
        <span class="${this.collapsed ? 'md:hidden' : 'block'}">${label}</span>
      </a>
    `;
  }

  render() {
    return html`
      <div 
        @click=${() => this.dispatchEvent(new CustomEvent('toggle-menu'))}
        class="fixed inset-0 bg-gray-900/50 z-40 md:hidden transition-opacity ${this.mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}">
      </div>

      <aside class="fixed inset-y-0 left-0 z-50 flex flex-col h-screen bg-white border-r border-gray-200 px-3 py-4 transition-all duration-300 transform 
        ${this.mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:relative 
        ${this.collapsed ? 'md:w-16' : 'md:w-64'} w-64">

        <div class="flex items-center gap-2 px-3 mb-6">
          <div class="w-7 h-7 rounded-md bg-primary-600 flex items-center justify-center shrink-0">
            <span class="text-white text-xs font-bold">P</span>
          </div>
          <span class="font-semibold text-gray-900 text-sm ${this.collapsed ? 'md:hidden' : 'block'}">PoultryDocs</span>
        </div>

        <nav class="flex flex-col gap-1 flex-grow">
          ${this.navItem('/', 'Dashboard', 'home')}
          ${this.navItem('/production', 'Production', 'factory')}
          ${this.navItem('/flock', 'Flock', 'warehouse')}
          ${this.navItem('/feed', 'Feed', 'package')}
          ${this.navItem('/inventory', 'Inventory', 'archive')}
          ${this.navItem('/health', 'Health', 'health_metrics')}
          ${this.navItem('/finance', 'Finance', 'wallet')}
          ${this.navItem('/reports', 'Reports', 'analytics')}
          ${this.navItem('/settings', 'Settings', 'settings')}
        </nav>

        <button
          @click=${() => { this.collapsed = !this.collapsed; }}
          class="hidden md:flex mt-auto items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span>${this.collapsed ? '→' : '←'}</span>
          ${!this.collapsed ? html`<span>Collapse</span>` : ''}
        </button>
      </aside>
    `;
  }
}
customElements.define('side-nav', SideNav);


