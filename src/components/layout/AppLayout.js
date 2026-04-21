import { LitElement, html } from 'lit';
import { AuthService } from '../../services/AuthService.js';
import { pwaService } from '../../services/PwaService.js';
import '../ui/SideNav.js';
import '../ui/ThemeToggle.js';
import '../ui/Popover.js';

// The main skeleton of our app. It's got the sidebar, the top bar, and the main view area.
export class AppLayout extends LitElement {
  createRenderRoot() { return this; }

  static properties = {
    isMobileMenuOpen: { type: Boolean },
    currentPath: { type: String },
    user: { type: Object },
    isUserPopoverOpen: { type: Boolean },
    installable: { type: Boolean }
  };

  constructor() {
    super();
    this.isMobileMenuOpen = false;
    this.currentPath = window.location.pathname;
    this.user = AuthService.getUser();
    this.isUserPopoverOpen = false;
    this.installable = false;

    // We close the mobile menu whenever the route changes so it doesn't stay open.
    this._onRouteChanged = (e) => {
      this.currentPath = e.detail.path;
      this.isMobileMenuOpen = false;
    };

    // Toggle that little user profile popover.
    this._onOpenUserPopover = (e) => {
      this.isUserPopoverOpen = !this.isUserPopoverOpen;
    };

    // Keep an eye on if the app can be installed as a PWA.
    this._pwaListener = (state) => {
      this.installable = state.installable;
    };
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('route-changed', this._onRouteChanged);
    window.addEventListener('open-user-popover', this._onOpenUserPopover);
    pwaService.addListener(this._pwaListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('route-changed', this._onRouteChanged);
    window.removeEventListener('open-user-popover', this._onOpenUserPopover);
    pwaService.removeListener(this._pwaListener);
  }

  // Trigger the PWA installation prompt.
  handleInstall() {
    pwaService.install();
  }

  // Helper to get initials from a name. If no name, just show question marks.
  _getInitials(name) {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  // Generates a consistent color for the user avatar based on their name.
  _getUserColor(name) {
    if (!name) return '#256eff';
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Use HSL for better control over accessibility
    const h = Math.abs(hash % 360);
    const s = 65; 
    const l = 40; 

    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  render() {
    const initials = this._getInitials(this.user?.name);
    const userColor = this._getUserColor(this.user?.name);

    return html`
      <div class="flex h-screen bg-neutral-50 dark:bg-neutral-950 overflow-hidden font-sans antialiased text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
        <!-- Sidebar for navigation links -->
        <side-nav 
          .currentPath=${this.currentPath}
          .mobileOpen=${this.isMobileMenuOpen}
          @toggle-menu=${() => this.isMobileMenuOpen = !this.isMobileMenuOpen}>
        </side-nav>

        <div class="flex flex-col flex-1 min-w-0 overflow-hidden relative">
          <!-- Top bar with logo and user menu -->
          <header class="h-14 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200/15 dark:border-neutral-800/30 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0 transition-colors duration-300">
            <div class="flex items-center gap-4">
              <!-- Mobile Logo - only shows on small screens -->
              <div class="flex items-center gap-2 md:hidden">
                <div class="w-8 h-8 rounded-md-md bg-primary-600 dark:bg-primary-500 flex items-center justify-center shadow-elevation-1">
                  <span class="material-symbols-rounded text-white text-[18px]">eco</span>
                </div>
                <span class="font-bold text-neutral-900 dark:text-neutral-50 text-[16px] tracking-tight">PoultryDocs</span>
              </div>
              
              <div class="hidden md:flex items-center gap-2 px-3 py-1 bg-success-100/50 dark:bg-success-900/20 rounded-md-full border border-success-200/20 dark:border-success-800/30">
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

                <!-- User avatar button to open the popover -->
                <button 
                  id="userAvatarBtn"
                  @click=${(e) => { e.stopPropagation(); this.isUserPopoverOpen = !this.isUserPopoverOpen; }}
                  class="w-8 h-8 rounded-md-full flex items-center justify-center overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-elevation-1"
                  style="background-color: ${userColor}">
                  <span class="text-[12px] font-bold text-white tracking-tighter">${initials}</span>
                </button>

                <!-- The user menu itself -->
                <ui-popover 
                  anchorId="userAvatarBtn" 
                  .open=${this.isUserPopoverOpen}
                  @popover-close=${() => this.isUserPopoverOpen = false}
                  width="300px">
                  <div class="p-5 flex flex-col gap-4">
                    <div class="flex items-center gap-4">
                      <div class="w-16 h-16 rounded-md-2xl flex items-center justify-center text-[24px] font-bold text-white shadow-lg shadow-primary-500/10"
                           style="background-color: ${userColor}">
                        ${initials}
                      </div>
                      <div class="flex flex-col">
                        <h3 class="font-bold text-neutral-900 dark:text-neutral-50 text-[16px]">${this.user?.name}</h3>
                        <p class="text-neutral-500 dark:text-neutral-400 text-[13px]">${this.user?.email}</p>
                        <span class="mt-1 px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-bold uppercase rounded-md-xs w-fit">
                          ${this.user?.role}
                        </span>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/50 mt-2">
                      <div class="flex flex-col">
                        <span class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Joined</span>
                        <span class="text-[12px] text-neutral-700 dark:text-neutral-300 font-medium">
                          ${this.user?.created_at ? new Date(this.user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                        </span>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Account Status</span>
                        <div class="flex items-center gap-1.5 mt-0.5">
                          <div class="w-1.5 h-1.5 rounded-full bg-success-500"></div>
                          <span class="text-[12px] text-neutral-700 dark:text-neutral-300 font-medium">${this.user?.status || 'Active'}</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex flex-col gap-1 pt-2">
                      ${this.installable ? html`
                        <div class="px-3 py-2">
                          <ui-button 
                            variant="outlined"
                            size="sm"
                            icon="download_for_offline"
                            label="Install App"
                            @click=${this.handleInstall}
                            fullWidth
                          ></ui-button>
                        </div>
                      ` : ''}
                      
                      <a href="/settings" data-link class="flex items-center gap-3 px-3 py-2 rounded-md-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group">
                        <span class="material-symbols-rounded text-[20px] text-neutral-400 group-hover:text-primary-600">settings</span>
                        <span class="text-[14px] font-medium text-neutral-700 dark:text-neutral-300">Account Settings</span>
                      </a>
                      <button @click=${() => { AuthService.logout(); }} class="flex items-center gap-3 px-3 py-2 rounded-md-lg hover:bg-error-50 dark:hover:bg-error-900/10 transition-colors group w-full text-left">
                        <span class="material-symbols-rounded text-[20px] text-neutral-400 group-hover:text-error-600">logout</span>
                        <span class="text-[14px] font-medium text-neutral-700 dark:text-neutral-300">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </ui-popover>
            </div>
          </header>

          <!-- Main View - where all the page content actually goes -->
          <main class="flex-1 overflow-y-auto p-4 pb-20 md:pb-6 md:p-6 scroll-smooth">
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
