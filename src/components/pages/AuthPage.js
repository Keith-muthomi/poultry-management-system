import { html } from 'lit';
import { BasePage } from '../base/BasePage.js';
import { AuthService } from '../../services/AuthService.js';
import { pwaService } from '../../services/PwaService.js';
import '../ui/Button.js';
import '../ui/Modal.js';

// This is the login/register page. We also handle the extra admin security check here.
export class AuthPage extends BasePage {
  static properties = {
    ...BasePage.properties,
    mode: { type: String }, // Can be 'login' or 'register'
    errorMsg: { type: String },
    loading: { type: Boolean },
    showPassword: { type: Boolean },
    touched: { type: Object },
    isAdminModalOpen: { type: Boolean },
    adminUser: { type: Object },
    secondaryPassword: { type: String },
    verifyingAdmin: { type: Boolean },
    installable: { type: Boolean }
  };

  constructor() {
    super();
    this.mode = 'login';
    this.errorMsg = '';
    this.loading = false;
    this.showPassword = false;
    this.touched = {};
    this.isAdminModalOpen = false;
    this.adminUser = null;
    this.secondaryPassword = '';
    this.verifyingAdmin = false;
    this.installable = false;

    // Just checking if we can show that "Install App" button.
    this._pwaListener = (state) => {
      this.installable = state.installable;
    };
  }

  connectedCallback() {
    super.connectedCallback();
    
    // For local testing, we might want to force the install button to show up.
    if (import.meta.env.DEV) {
      pwaService.enableDebugMode();
    }
    
    pwaService.addListener(this._pwaListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    pwaService.removeListener(this._pwaListener);
  }

  // Trigger the browser's install prompt.
  handleInstall() {
    pwaService.install();
  }

  // Switch between Login and Register views.
  toggleMode() {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.errorMsg = '';
    this.touched = {};
    this.showPassword = false;
  }

  // Keep track of what the user is typing.
  handleInput(e) {
    const { name, value } = e.target;
    if (name === 'secondaryPassword') {
      this.secondaryPassword = value;
    } else {
      this.touched = { ...this.touched, [name]: true };
    }
    if (this.errorMsg) this.errorMsg = '';
  }

  // The main auth function. It handles both signing in and signing up.
  async handleAuth(e) {
    e.preventDefault();
    this.errorMsg = '';
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Basic validation before we even talk to the server.
    if (!data.email || !data.password || (this.mode === 'register' && !data.name)) {
      this.errorMsg = 'Please fill in all required fields.';
      return;
    }

    this.loading = true;
    try {
      if (this.mode === 'login') {
        const response = await AuthService.login(data);
        // If they are an admin, we don't let them in yet - need that second password.
        if (response.user?.role === 'Admin') {
          this.adminUser = response.user;
          this.isAdminModalOpen = true;
          this.loading = false;
        } else {
          window.location.href = '/'; 
        }
      } else {
        // Just registering a new user.
        await AuthService.register(data);
        this.errorMsg = '';
        this.mode = 'login';
        alert('Account created! Please sign in.');
      }
    } catch (err) {
      this.errorMsg = err.message || 'Authentication failed. Please check your credentials.';
    } finally {
      if (!this.isAdminModalOpen) this.loading = false;
    }
  }

  // Verifies the secondary password for admin accounts.
  async handleAdminVerify(e) {
    if (e) e.preventDefault();
    this.verifyingAdmin = true;
    this.errorMsg = '';

    try {
      await AuthService.verifyAdmin(this.adminUser.id, this.secondaryPassword);
      window.location.href = '/admin';
    } catch (err) {
      this.errorMsg = 'Invalid secondary password. Access denied.';
      this.isAdminModalOpen = false;
    } finally {
      this.verifyingAdmin = false;
    }
  }

  render() {
    const isError = (name) => this.touched[name] && this.errorMsg && (this.errorMsg.toLowerCase().includes(name) || this.errorMsg.toLowerCase().includes('fields') || this.errorMsg.toLowerCase().includes('credentials'));

    return html`
      <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center px-4 py-12 animate-in fade-in duration-700 transition-colors duration-300">
        <div class="bg-white dark:bg-neutral-900 p-8 rounded-md-xl w-full max-w-[420px] shadow-elevation-3 relative overflow-hidden border border-transparent dark:border-neutral-800/50">
          
          <div class="absolute top-0 left-0 w-full h-1 bg-primary-600 dark:bg-primary-500"></div>

          <!-- Logo and Header -->
          <div class="flex flex-col items-center mb-10">
            <div class="w-14 h-14 rounded-md-md bg-primary-600 dark:bg-primary-500 flex items-center justify-center mb-5 shadow-lg shadow-primary-500/20">
              <span class="material-symbols-rounded text-white text-[32px]">eco</span>
            </div>
            <h1 class="text-[28px] font-bold text-neutral-900 dark:text-neutral-50 tracking-tight text-center">
              ${this.mode === 'login' ? 'Welcome Back' : 'Get Started'}
            </h1>
            <p class="text-neutral-500 dark:text-neutral-400 text-[15px] mt-2 text-center">
              ${this.mode === 'login' ? 'Enter your credentials to access your farm' : 'Create an account to start managing your poultry'}
            </p>
          </div>

          <!-- Error message box -->
          ${this.errorMsg ? html`
            <div class="mb-8 p-4 bg-error-50 dark:bg-error-500/10 border border-error-200 dark:border-error-500/20 rounded-md-lg text-error-700 dark:text-error-400 text-[14px] font-medium flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
              <span class="material-symbols-rounded text-[20px] shrink-0 mt-0.5">error</span>
              <p>${this.errorMsg}</p>
            </div>
          ` : ''}

          <!-- The main form -->
          <form class="flex flex-col gap-6" @submit=${this.handleAuth} novalidate>

            ${this.mode === 'register' ? html`
              <div class="flex flex-col gap-2">
                <label for="name" class="text-[12px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest ml-1">Full Name</label>
                <div class="relative group">
                   <span class="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 text-[20px] group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors">person</span>
                   <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g. John Doe"
                    required
                    @input=${this.handleInput}
                    class="w-full bg-neutral-50 dark:bg-neutral-800/30 border ${isError('name') ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-800'} rounded-md-lg pl-10 pr-4 py-3 text-[15px] text-neutral-900 dark:text-neutral-50 focus:border-primary-600 dark:focus:border-primary-500 focus:ring-0 outline-none transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                  />
                </div>
              </div>
            ` : ''}

            <div class="flex flex-col gap-2">
              <label for="email" class="text-[12px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest ml-1">Email Address</label>
              <div class="relative group">
                <span class="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 text-[20px] group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors">mail</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  @input=${this.handleInput}
                  class="w-full bg-neutral-50 dark:bg-neutral-800/30 border ${isError('email') ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-800'} rounded-md-lg pl-10 pr-4 py-3 text-[15px] text-neutral-900 dark:text-neutral-50 focus:border-primary-600 dark:focus:border-primary-500 focus:ring-0 outline-none transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between ml-1">
                <label for="password" class="text-[12px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">Password</label>
                ${this.mode === 'login' ? html`<a href="#" class="text-[12px] font-bold text-primary-600 dark:text-primary-500 hover:underline">Forgot?</a>` : ''}
              </div>
              <div class="relative group">
                <span class="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 text-[20px] group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors">lock</span>
                <input
                  id="password"
                  name="password"
                  .type=${this.showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  @input=${this.handleInput}
                  class="w-full bg-neutral-50 dark:bg-neutral-800/30 border ${isError('password') ? 'border-error-500' : 'border-neutral-200 dark:border-neutral-800'} rounded-md-lg pl-10 pr-4 py-3 text-[15px] text-neutral-900 dark:text-neutral-50 focus:border-primary-600 dark:focus:border-primary-500 focus:ring-0 outline-none transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                />
              </div>
              
              <div class="flex items-center gap-2 mt-1 ml-1">
                <input 
                  type="checkbox" 
                  id="show-password" 
                  .checked=${this.showPassword}
                  @change=${(e) => this.showPassword = e.target.checked}
                  class="w-4 h-4 rounded border-neutral-300 dark:border-neutral-800 text-primary-600 dark:text-primary-500 focus:ring-primary-500 bg-neutral-100 dark:bg-neutral-800 transition-colors"
                >
                <label for="show-password" class="text-[13px] text-neutral-600 dark:text-neutral-400 cursor-pointer select-none">Show password</label>
              </div>
            </div>

            <ui-button 
              variant="filled" 
              fullWidth
              size="lg"
              .loading=${this.loading}
              label="${this.mode === 'login' ? 'Sign In' : 'Create Account'}" 
              class="mt-4"
              type="submit">
            </ui-button>

          </form>

          <!-- Toggle between login and register -->
          <div class="mt-10 pt-8 border-t border-neutral-100 dark:border-neutral-800/50 text-center flex flex-col gap-4">
            <p class="text-[14px] text-neutral-500 dark:text-neutral-400">
              ${this.mode === 'login' ? "New to PoultryDocs?" : 'Already have an account?'}
              <button
                @click=${() => this.toggleMode()}
                class="text-primary-600 dark:text-primary-500 font-bold hover:underline ml-1"
              >
                ${this.mode === 'login' ? 'Create one for free' : 'Sign in here'}
              </button>
            </p>

            ${this.installable ? html`
              <ui-button 
                variant="outlined"
                size="sm"
                icon="download_for_offline"
                label="Install App"
                @click=${this.handleInstall}
                class="mx-auto block mt-4"
              ></ui-button>
            ` : ''}
          </div>

        </div>
      </div>

      <!-- Admin Secondary Verification Modal - pops up if an admin logs in -->
      <ui-modal 
        .open=${this.isAdminModalOpen} 
        title="Elevated Access Required"
        @modal-close=${() => this.isAdminModalOpen = false}>
        <form slot="body" class="space-y-4" @submit=${this.handleAdminVerify}>
          <div class="p-3 bg-primary-600/10 border border-primary-500/20 rounded-md-lg">
            <p class="text-[13px] text-primary-700 dark:text-primary-300 leading-relaxed">
              Account <strong>${this.adminUser?.name}</strong> has administrative privileges. Please enter your secondary security password to proceed.
            </p>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">Secondary Password</label>
            <input 
              type="password" 
              name="secondaryPassword"
              .value=${this.secondaryPassword}
              @input=${this.handleInput}
              placeholder="Enter security key"
              required
              class="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md-lg px-4 py-3 text-[15px] outline-none focus:border-primary-500 text-neutral-900 dark:text-neutral-50"
            />
          </div>
          <button type="submit" class="hidden"></button>
        </form>
        <div slot="footer" class="flex gap-3">
          <ui-button variant="outlined" size="md" label="Cancel" @click=${() => this.isAdminModalOpen = false}></ui-button>
          <ui-button variant="filled" size="md" label="Verify & Access" .loading=${this.verifyingAdmin} @click=${this.handleAdminVerify}></ui-button>
        </div>
      </ui-modal>
    `;
  }
}
customElements.define('auth-page', AuthPage);
