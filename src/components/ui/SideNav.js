import { LitElement, html } from 'lit';

export class SideNav extends LitElement {
  createRenderRoot() { return this; }

  static properties = {
    currentPath: { type: String },
    collapsed: { type: Boolean },
    mobileOpen: { type: Boolean },
  };

  constructor() {
    super();
    this.currentPath = window.location.pathname;
    this.collapsed = false;
    this.mobileOpen = false;
  }

  isActive(path) {
    if (path === '/') return this.currentPath === '/';
    return this.currentPath.startsWith(path);
  }

  navItem(path, label, icon) {
    const active = this.isActive(path);
    return html`
      <a href=${path} data-link
        class="flex items-center gap-3 px-4 py-3 rounded-md-full text-[14px] transition-all duration-200 group mx-3 mb-1
        ${active 
          ? 'bg-md-primary-container dark:bg-md-dark-primary-container text-md-on-primary-container dark:text-md-on-primary-container font-semibold' 
          : 'text-md-on-surface-variant dark:text-md-dark-on-surface-variant hover:bg-md-surface-variant dark:hover:bg-md-dark-surface-variant'}">
        <span class="material-symbols-rounded text-[24px] leading-none ${active ? 'text-md-primary dark:text-md-dark-primary' : 'text-md-on-surface-variant dark:text-md-dark-on-surface-variant'}">${icon}</span>
        <span class="${this.collapsed ? 'md:hidden' : 'block'}">${label}</span>
      </a>
    `;
  }

  render() {
    return html`
      <!-- Backdrop -->
      <div 
        @click=${() => this.dispatchEvent(new CustomEvent('toggle-menu'))}
        class="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300 ${this.mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}">
      </div>

      <aside class="fixed inset-y-0 left-0 z-50 flex flex-col h-screen bg-md-surface dark:bg-md-dark-surface border-r border-md-outline/10 dark:border-md-dark-outline/10 transition-all duration-300 transform 
        ${this.mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:relative 
        ${this.collapsed ? 'md:w-20' : 'md:w-72'} w-72">

        <!-- Logo -->
        <div class="flex items-center gap-4 px-6 h-16 border-b border-md-outline/5 dark:border-md-dark-outline/5 mb-4">
          <div class="w-10 h-10 rounded-md-md bg-md-primary dark:bg-md-dark-primary flex items-center justify-center shadow-elevation-1">
            <span class="material-symbols-rounded text-md-on-primary text-[24px]">eco</span>
          </div>
          <div class="${this.collapsed ? 'md:hidden' : 'flex flex-col'}">
            <span class="font-bold text-md-on-surface dark:text-md-dark-on-surface text-[18px] tracking-tight">PoultryDocs</span>
          </div>
        </div>

        <!-- Navigation Items -->
        <nav class="flex flex-col flex-grow overflow-y-auto scrollbar-hide">
          <div class="text-[11px] font-bold text-md-on-surface-variant dark:text-md-dark-on-surface-variant uppercase tracking-widest px-8 mb-3 mt-2 ${this.collapsed ? 'md:hidden' : ''}">Core Assets</div>
          ${this.navItem('/', 'Dashboard', 'dashboard')}
          ${this.navItem('/production', 'Production', 'egg')}
          ${this.navItem('/flock', 'Flocks', 'inventory')}
          
          <div class="my-4 border-t border-md-outline/5 dark:border-md-dark-outline/5 mx-6"></div>
          
          <div class="text-[11px] font-bold text-md-on-surface-variant dark:text-md-dark-on-surface-variant uppercase tracking-widest px-8 mb-3 ${this.collapsed ? 'md:hidden' : ''}">Resources</div>
          ${this.navItem('/inventory', 'Supplies', 'category')}
          ${this.navItem('/finance', 'Finance', 'payments')}
          ${this.navItem('/settings', 'Settings', 'settings')}
        </nav>

        <!-- Footer / Collapse -->
        <div class="mt-auto p-3 border-t border-md-outline/5 dark:border-md-dark-outline/5">
           <button
            @click=${() => { this.collapsed = !this.collapsed; }}
            class="flex items-center gap-4 px-5 py-3 w-full rounded-md-full text-md-on-surface-variant dark:text-md-dark-on-surface-variant hover:bg-md-surface-variant dark:hover:bg-md-dark-surface-variant transition-colors"
          >
            <span class="material-symbols-rounded text-[24px] leading-none">${this.collapsed ? 'menu_open' : 'menu'}</span>
            ${!this.collapsed ? html`<span class="text-[14px] font-semibold">Collapse Drawer</span>` : ''}
          </button>
        </div>
      </aside>
    `;
  }
}
customElements.define('side-nav', SideNav);
