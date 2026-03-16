import { LitElement, html } from 'lit';
import '../ui/SideNav.js';
import '../ui/ThemeToggle.js';

export class AppLayout extends LitElement {
  createRenderRoot() { return this; }

  static properties = {
    isMobileMenuOpen: { type: Boolean },
    currentPath: { type: String }
  };

  constructor() {
    super();
    this.isMobileMenuOpen = false;
    this.currentPath = window.location.pathname;

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
        <!-- Material 3 Corporate Sidebar -->
        <side-nav 
          .currentPath=${this.currentPath}
          .mobileOpen=${this.isMobileMenuOpen}
          @toggle-menu=${() => this.isMobileMenuOpen = !this.isMobileMenuOpen}>
        </side-nav>

        <div class="flex flex-col flex-1 min-w-0 overflow-hidden relative">
          <!-- Corporate App Bar -->
          <header class="h-14 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200/15 dark:border-neutral-800/30 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0 transition-colors duration-300">
            <div class="flex items-center gap-4">
              <button 
                @click=${() => this.isMobileMenuOpen = !this.isMobileMenuOpen}
                class="p-1.5 -ml-2 text-neutral-500 dark:text-neutral-400 md:hidden hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md-full transition-colors">
                <span class="material-symbols-rounded text-[24px] leading-none">menu</span>
              </button>
              
              <div class="flex items-center gap-2 px-3 py-1 bg-success-100/50 dark:bg-success-900/20 rounded-md-full border border-success-200/20 dark:border-success-800/30">
                <div class="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse"></div>
                <p class="text-[11px] font-bold text-success-700 dark:text-success-300 uppercase tracking-wider">
                  System Live
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 md:gap-4">
                <p class="hidden lg:block text-[12px] font-medium text-neutral-500 dark:text-neutral-400">
                    ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                
                <div class="h-6 w-px bg-neutral-200/20 dark:bg-neutral-800/20 mx-1 hidden md:block"></div>
                
                <theme-toggle></theme-toggle>

                <div class="w-8 h-8 rounded-md-full bg-primary-100/50 dark:bg-primary-900/20 border border-primary-200/20 dark:border-primary-800/20 flex items-center justify-center overflow-hidden">
                  <span class="material-symbols-rounded text-primary-600 dark:text-primary-400 text-[20px]">person</span>
                </div>
            </div>
          </header>

          <!-- Main View -->
          <main class="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
            <div class="max-w-[1600px] mx-auto">
                <router-view></router-view>
            </div>
          </main>
        </div>
      </div>
    `;
  }
}
customElements.define('app-layout', AppLayout);
