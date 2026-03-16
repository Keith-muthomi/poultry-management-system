// src/components/pages/AuthPage.js
import { html } from 'lit';
import { BasePage } from '../base/BasePage.js';
import { AuthService } from '../../services/AuthService.js';
import '../ui/Button.js';

export class AuthPage extends BasePage {
  static properties = {
    ...BasePage.properties,
    mode: { type: String }, // 'login' or 'register'
    errorMsg: { type: String },
    loading: { type: Boolean }
  };

  constructor() {
    super();
    this.mode = 'login';
    this.errorMsg = '';
    this.loading = false;
  }

  toggleMode() {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.errorMsg = '';
  }

  async handleAuth(e) {
    e.preventDefault();
    this.errorMsg = '';
    this.loading = true;

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      if (this.mode === 'login') {
        await AuthService.login(data);
        window.location.href = '/'; // Reload to re-check auth in main.js
      } else {
        await AuthService.register(data);
        alert('Account created successfully! Please sign in.');
        this.mode = 'login';
      }
    } catch (err) {
      this.errorMsg = err.message || 'Authentication failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <div class="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center px-6 animate-in fade-in duration-500 transition-colors duration-300">
        <div class="bg-white dark:bg-neutral-950 p-8 rounded-md-xl border border-neutral-200/10 dark:border-neutral-800/10 w-full max-w-sm shadow-elevation-2">

          <div class="flex flex-col items-center mb-8">
            <div class="w-12 h-12 rounded-md-md bg-primary-600 dark:bg-primary-500 flex items-center justify-center mb-4 shadow-elevation-1">
              <span class="material-symbols-rounded text-white text-[28px]">eco</span>
            </div>
            <h1 class="text-[24px] font-normal text-neutral-900 dark:text-neutral-50 tracking-tight">
              ${this.mode === 'login' ? 'Sign in to PoultryDocs' : 'Create an account'}
            </h1>
            <p class="text-neutral-500 dark:text-neutral-400 text-[14px] mt-1">Manage your farm with ease</p>
          </div>

          ${this.errorMsg ? html`
            <div class="mb-6 p-3 bg-error-500/10 border border-error-500/20 rounded-md-xs text-error-600 dark:text-error-400 text-[13px] font-medium flex items-center gap-2">
              <span class="material-symbols-rounded text-[18px]">error</span>
              ${this.errorMsg}
            </div>
          ` : ''}

          <form class="flex flex-col gap-5" @submit=${this.handleAuth}>

            ${this.mode === 'register' ? html`
              <div class="flex flex-col gap-1.5">
                <label for="full-name" class="text-[14px] font-medium text-neutral-500 dark:text-neutral-400 ml-1">Full Name</label>
                <input
                  id="full-name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  class="bg-neutral-200/30 dark:bg-neutral-800/30 border-b border-neutral-300 dark:border-neutral-700 rounded-t-md-xs p-3 text-[16px] text-neutral-900 dark:text-neutral-50 focus:border-b-2 focus:border-primary-600 dark:focus:border-primary-500 outline-none transition-all placeholder:text-neutral-500/50 dark:placeholder:text-neutral-400/50"
                />
              </div>
            ` : ''}

            <div class="flex flex-col gap-1.5">
              <label for="email" class="text-[14px] font-medium text-neutral-500 dark:text-neutral-400 ml-1">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                class="bg-neutral-200/30 dark:bg-neutral-800/30 border-b border-neutral-300 dark:border-neutral-700 rounded-t-md-xs p-3 text-[16px] text-neutral-900 dark:text-neutral-50 focus:border-b-2 focus:border-primary-600 dark:focus:border-primary-500 outline-none transition-all placeholder:text-neutral-500/50 dark:placeholder:text-neutral-400/50"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="password" class="text-[14px] font-medium text-neutral-500 dark:text-neutral-400 ml-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                class="bg-neutral-200/30 dark:bg-neutral-800/30 border-b border-neutral-300 dark:border-neutral-700 rounded-t-md-xs p-3 text-[16px] text-neutral-900 dark:text-neutral-50 focus:border-b-2 focus:border-primary-600 dark:focus:border-primary-500 outline-none transition-all placeholder:text-neutral-500/50 dark:placeholder:text-neutral-400/50"
              />
            </div>

            <ui-button 
              variant="filled" 
              fullWidth
              size="lg"
              .loading=${this.loading}
              label="${this.mode === 'login' ? 'Sign in' : 'Register'}" 
              class="mt-2"
              type="submit">
            </ui-button>

          </form>

          <div class="text-[14px] text-neutral-500 dark:text-neutral-400 text-center mt-6">
            ${this.mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button
              @click=${() => this.toggleMode()}
              class="text-primary-600 dark:text-primary-500 font-medium hover:underline ml-1"
            >
              ${this.mode === 'login' ? 'Register now' : 'Sign in instead'}
            </button>
          </div>

        </div>
      </div>
    `;
  }
}
customElements.define('auth-page', AuthPage);
