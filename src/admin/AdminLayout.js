import { LitElement, html } from 'lit';
import { AuthService } from '../services/AuthService.js';
import './AdminSideNav.js';
import '../components/ui/ThemeToggle.js';

export class AdminLayout extends LitElement {
  createRenderRoot() { return this; }

  static properties = {
    isMobileMenuOpen: { type: Boolean },
    currentPath: { type: String },
    user: { type: Object }
  };

  constructor() {
    super();
    this.isMobileMenuOpen = false;
    this.currentPath = window.location.pathname;
    this.user = AuthService.getUser();

    this._onRouteChanged = (e) => {
      this.currentPath = e.detail.path;
      this.isMobileMenuOpen = false;
    };
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('route-changed', this._onRouteChanged);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('route-changed', this._onRouteChanged);
  }

  render() {
    return html`
      <div class="flex h-screen bg-neutral-50 dark:bg-neutral-950 overflow-hidden font-sans antialiased text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
        <admin-side-nav 
          .currentPath=${this.currentPath}
          .mobileOpen=${this.isMobileMenuOpen}
          @toggle-menu=${() => this.isMobileMenuOpen = !this.isMobileMenuOpen}>
        </admin-side-nav>
<div class="flex flex-col flex-1 min-w-0 overflow-hidden relative">
  <!-- Admin Top Bar -->
  <header class="h-14 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white border-b border-neutral-200/15 dark:border-white/5 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0 transition-colors duration-300">
    <div class="flex items-center gap-4">
      <button 
        @click=${() => this.isMobileMenuOpen = !this.isMobileMenuOpen}
        class="p-1.5 -ml-2 text-neutral-500 dark:text-neutral-400 md:hidden hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md-full transition-colors">
        <span class="material-symbols-rounded text-[24px] leading-none">menu</span>
      </button>

      <div class="flex items-center gap-2 px-3 py-1 bg-primary-600/10 dark:bg-primary-600/20 rounded-md-full border border-primary-500/20 dark:border-primary-500/30">
        <span class="material-symbols-rounded text-primary-600 dark:text-primary-400 text-[16px]">admin_panel_settings</span>
        <p class="text-[11px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
          Admin Control Mode
        </p>
      </div>
    </div>

    <div class="flex items-center gap-4">
        <theme-toggle></theme-toggle>
        <div class="flex items-center gap-3 pl-3 border-l border-neutral-200/20 dark:border-white/10">
          <div class="flex flex-col items-end hidden sm:flex">
            <span class="text-[12px] font-bold leading-tight text-neutral-900 dark:text-white">${this.user?.name}</span>
            <span class="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-widest font-bold">Root Admin</span>
          </div>
          <div class="w-8 h-8 rounded-md-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 flex items-center justify-center">
            <span class="material-symbols-rounded text-primary-600 dark:text-primary-500 text-[20px]">engineering</span>
          </div>
        </div>
    </div>
  </header>

          <main class="flex-1 overflow-y-auto p-4 md:p-6">
            <div class="max-w-[1600px] mx-auto">
                <router-view></router-view>
            </div>
          </main>
        </div>
      </div>
    `;
  }
}
customElements.define('admin-layout', AdminLayout);
