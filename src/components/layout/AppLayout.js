import { LitElement, html } from 'lit';
import '../ui/SideNav.js';

export class AppLayout extends LitElement {
  createRenderRoot() { return this; }

  static properties = {
    isMobileMenuOpen: { type: Boolean },
    currentPath: { type: String } // ✅ CRITICAL: Lit now watches this for changes
  };

  constructor() {
    super();
    this.isMobileMenuOpen = false;
    this.currentPath = window.location.pathname;

    this._onRouteChanged = (e) => {
      console.log(`[AppLayout] Route change detected: ${e.detail.path}`);
      this.currentPath = e.detail.path;
      this.isMobileMenuOpen = false; // ✅ Bonus: Close mobile menu on navigation
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
      <div class="flex h-screen bg-gray-50 overflow-hidden">
        <side-nav 
          .currentPath=${this.currentPath}
          .mobileOpen=${this.isMobileMenuOpen}
          @toggle-menu=${() => this.isMobileMenuOpen = !this.isMobileMenuOpen}>
        </side-nav>

        <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
          <header class="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">
            <div class="flex items-center gap-4">
              <button 
                @click=${() => this.isMobileMenuOpen = !this.isMobileMenuOpen}
                class="p-2 -ml-2 text-gray-600 md:hidden hover:bg-gray-100 rounded-lg">
                <span class="material-symbols-rounded">menu</span>
              </button>
              <p class="hidden sm:block text-sm text-gray-400">
                ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
            </header>

          <main class="flex-1 overflow-y-auto p-4 md:p-8">
            <router-view></router-view>
          </main>
        </div>
      </div>
    `;
  }
}
customElements.define('app-layout', AppLayout);