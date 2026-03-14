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
      <div class="flex h-screen bg-md-background dark:bg-md-dark-background overflow-hidden font-sans antialiased text-md-on-surface dark:text-md-dark-on-surface transition-colors duration-300">
        <!-- Material 3 Corporate Sidebar -->
        <side-nav 
          .currentPath=${this.currentPath}
          .mobileOpen=${this.isMobileMenuOpen}
          @toggle-menu=${() => this.isMobileMenuOpen = !this.isMobileMenuOpen}>
        </side-nav>

        <div class="flex flex-col flex-1 min-w-0 overflow-hidden relative">
          <!-- Corporate App Bar -->
          <header class="h-14 bg-md-surface dark:bg-md-dark-surface border-b border-md-outline/10 dark:border-md-dark-outline/10 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0 shadow-elevation-1 transition-colors duration-300">
            <div class="flex items-center gap-4">
              <button 
                @click=${() => this.isMobileMenuOpen = !this.isMobileMenuOpen}
                class="p-1.5 -ml-2 text-md-on-surface-variant dark:text-md-dark-on-surface-variant md:hidden hover:bg-md-surface-variant dark:hover:bg-md-dark-surface-variant rounded-md-full transition-colors">
                <span class="material-symbols-rounded text-[24px] leading-none">menu</span>
              </button>
              
              <div class="flex items-center gap-2 px-3 py-1 bg-md-tertiary/5 dark:bg-md-tertiary/10 rounded-md-full border border-md-tertiary/10 dark:border-md-tertiary/20">
                <div class="w-1.5 h-1.5 rounded-full bg-md-tertiary animate-pulse"></div>
                <p class="text-[11px] font-bold text-md-tertiary uppercase tracking-wider">
                  System Live
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 md:gap-4">
                <p class="hidden lg:block text-[12px] font-medium text-md-on-surface-variant dark:text-md-dark-on-surface-variant">
                    ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                
                <div class="h-6 w-px bg-md-outline/20 dark:bg-md-dark-outline/20 mx-1 hidden md:block"></div>
                
                <theme-toggle></theme-toggle>

                <div class="w-8 h-8 rounded-md-full bg-md-primary/10 dark:bg-md-dark-primary/10 border border-md-primary/20 dark:border-md-dark-primary/20 flex items-center justify-center overflow-hidden">
                  <span class="material-symbols-rounded text-md-primary dark:text-md-dark-primary text-[20px]">person</span>
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
