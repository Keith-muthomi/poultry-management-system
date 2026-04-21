import { LitElement, html } from 'lit';
import { AuthService } from '../services/AuthService.js';

// The sidebar for the admin dashboard. 
// It handles all the links and even lets you collapse the menu to save space.
export class AdminSideNav extends LitElement {
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

  // Helper to figure out if a link should look "active" based on where we are.
  isActive(path) {
    if (path === '/') return this.currentPath === '/';
    if (path === '/admin') return this.currentPath === '/admin';
    return this.currentPath.startsWith(path) && path !== '/';
  }

  // Generates a single navigation link. We reuse this for all the items in the sidebar.
  navItem(path, label, icon) {
    const active = this.isActive(path);
    return html`
      <a href=${path} data-link
        class="flex items-center gap-3 px-4 py-3 rounded-md-full text-[14px] transition-all duration-200 group mx-3 mb-1
        ${active 
          ? 'bg-primary-600/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-500 font-bold shadow-sm' 
          : 'text-neutral-500 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-800'}">
        <span class="material-symbols-rounded text-[24px] leading-none ${active ? 'text-primary-600 dark:text-primary-500' : 'text-neutral-500 dark:text-neutral-400'}">${icon}</span>
        <span class="${this.collapsed ? 'md:hidden' : 'block'}">${label}</span>
      </a>
    `;
  }

  render() {
    return html`
      <!-- Backdrop for mobile - clicks here close the menu -->
      <div 
        @click=${() => this.dispatchEvent(new CustomEvent('toggle-menu'))}
        class="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden ${this.mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}">
      </div>

      <aside class="fixed inset-y-0 left-0 z-50 flex flex-col h-screen bg-neutral-100 dark:bg-neutral-900 border-r border-neutral-200/10 dark:border-neutral-800/20 transition-all duration-300 transform 
        ${this.mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:relative 
        ${this.collapsed ? 'md:w-20' : 'md:w-72'} w-72">

        <!-- Logo / Brand section -->
        <div class="flex items-center gap-4 px-6 h-14 border-b border-neutral-200/5 dark:border-neutral-800/10 mb-4">
          <div class="w-10 h-10 rounded-md-md bg-primary-600 dark:bg-primary-500 flex items-center justify-center shadow-elevation-1">
            <span class="material-symbols-rounded text-white text-[24px]">shield</span>
          </div>
          <div class="${this.collapsed ? 'md:hidden' : 'flex flex-col'}">
            <span class="font-bold text-neutral-900 dark:text-neutral-50 text-[18px] tracking-tight">Admin Central</span>
          </div>
        </div>

        <!-- Navigation Items - split into sections like Overview and System -->
        <nav class="flex flex-col flex-grow overflow-y-auto scrollbar-hide">
          <div class="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest px-8 mb-3 mt-2 ${this.collapsed ? 'md:hidden' : ''}">Overview</div>
          ${this.navItem('/admin', 'Users Management', 'group')}
          ${this.navItem('/admin/reports', 'Debug Reports', 'bug_report')}
          ${this.navItem('/admin/data', 'Data Extraction', 'database')}
          
          <div class="my-4 border-t border-neutral-200/5 dark:border-neutral-800/10 mx-6"></div>
          
          <div class="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest px-8 mb-3 ${this.collapsed ? 'md:hidden' : ''}">System</div>
          ${this.navItem('/admin/settings', 'System Settings', 'settings_suggest')}
          ${this.navItem('/', 'Back to Main Site', 'arrow_back')}

          <div class="my-4 border-t border-neutral-200/5 dark:border-neutral-800/10 mx-6"></div>

          <!-- Sign out button at the bottom -->
          <button
            @click=${() => AuthService.logout()}
            class="flex items-center gap-3 px-4 py-3 rounded-md-full text-[14px] transition-all duration-200 group mx-3 mb-1 text-error-600 hover:bg-error-600/5"
          >
            <span class="material-symbols-rounded text-[24px] leading-none text-error-600">logout</span>
            <span class="${this.collapsed ? 'md:hidden' : 'block'}">Sign Out</span>
          </button>
        </nav>

        <!-- Footer / Collapse toggle -->
        <div class="mt-auto p-3 border-t border-neutral-200/5 dark:border-neutral-800/10 hidden md:block">
           <button
            @click=${() => { this.collapsed = !this.collapsed; }}
            class="flex items-center gap-4 px-5 py-3 w-full rounded-md-full text-neutral-500 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-900 transition-colors"
          >
            <span class="material-symbols-rounded text-[24px] leading-none">${this.collapsed ? 'menu_open' : 'menu'}</span>
            ${!this.collapsed ? html`<span class="text-[14px] font-semibold">Collapse Drawer</span>` : ''}
          </button>
        </div>
      </aside>
    `;
  }
}
customElements.define('admin-side-nav', AdminSideNav);
