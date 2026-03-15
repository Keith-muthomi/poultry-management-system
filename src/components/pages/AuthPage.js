// src/components/pages/AuthPage.js
import { html } from 'lit';
import { BasePage } from '../base/BasePage.js';
import '../ui/Button.js';

export class AuthPage extends BasePage {
  static properties = {
    mode: { type: String }, // 'login' or 'register'
  };

  constructor() {
    super();
    this.mode = 'login';
  }

  toggleMode() {
    this.mode = this.mode === 'login' ? 'register' : 'login';
  }

  render() {
    return html`
    <div class="min-h-screen bg-md-surface-container dark:bg-md-dark-surface-container flex items-center justify-center px-6 animate-in fade-in duration-500 transition-colors duration-300">

        <div class="bg-md-surface dark:bg-md-dark-surface p-8 rounded-md-xl border border-md-outline/10 dark:border-md-dark-outline/10 w-full max-w-sm shadow-elevation-2">

          <div class="flex flex-col items-center mb-8">
            <div class="w-12 h-12 rounded-md-md bg-md-primary dark:bg-md-dark-primary flex items-center justify-center mb-4 shadow-elevation-1">
              <span class="material-symbols-rounded text-md-on-primary text-[28px]">eco</span>
            </div>
            <h1 class="text-[24px] font-normal text-md-on-surface dark:text-md-dark-on-surface tracking-tight">
              ${this.mode === 'login' ? 'Sign in to PoultryDocs' : 'Create an account'}
            </h1>
            <p class="text-md-on-surface-variant dark:text-md-dark-on-surface-variant text-[14px] mt-1">Manage your farm with ease</p>
          </div>

          <form class="flex flex-col gap-5" @submit=${(e) => e.preventDefault()}>

            ${this.mode === 'register' ? html`
              <div class="flex flex-col gap-1.5">
                <label for="full-name" class="text-[14px] font-medium text-md-on-surface-variant dark:text-md-dark-on-surface-variant ml-1">Full Name</label>
                <input
                  id="full-name"
                  type="text"
                  placeholder="John Doe"
                  aria-label="Full Name"
                  class="bg-md-surface-variant/30 dark:bg-md-dark-surface-variant/30 border-b border-md-outline dark:border-md-dark-outline rounded-t-md-xs p-3 text-[16px] text-md-on-surface dark:text-md-dark-on-surface focus:border-b-2 focus:border-md-primary dark:focus:border-md-dark-primary outline-none transition-all placeholder:text-md-on-surface-variant/50 dark:placeholder:text-md-dark-on-surface-variant/50"
                />
              </div>
            ` : ''}

            <div class="flex flex-col gap-1.5">
              <label for="email" class="text-[14px] font-medium text-md-on-surface-variant dark:text-md-dark-on-surface-variant ml-1">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                aria-label="Email Address"
                class="bg-md-surface-variant/30 dark:bg-md-dark-surface-variant/30 border-b border-md-outline dark:border-md-dark-outline rounded-t-md-xs p-3 text-[16px] text-md-on-surface dark:text-md-dark-on-surface focus:border-b-2 focus:border-md-primary dark:focus:border-md-dark-primary outline-none transition-all placeholder:text-md-on-surface-variant/50 dark:placeholder:text-md-dark-on-surface-variant/50"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="password" class="text-[14px] font-medium text-md-on-surface-variant dark:text-md-dark-on-surface-variant ml-1">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                aria-label="Password"
                class="bg-md-surface-variant/30 dark:bg-md-dark-surface-variant/30 border-b border-md-outline dark:border-md-dark-outline rounded-t-md-xs p-3 text-[16px] text-md-on-surface dark:text-md-dark-on-surface focus:border-b-2 focus:border-md-primary dark:focus:border-md-dark-primary outline-none transition-all placeholder:text-md-on-surface-variant/50 dark:placeholder:text-md-dark-on-surface-variant/50"
              />
            </div>

            <ui-button 
              variant="filled" 
              fullWidth
              size="lg"
              label="${this.mode === 'login' ? 'Sign in' : 'Register'}" 
              class="mt-2"
              type="submit">
            </ui-button>

          </form>

          <div class="text-[14px] text-md-on-surface-variant dark:text-md-dark-on-surface-variant text-center mt-6">
            ${this.mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button
              @click=${() => this.toggleMode()}
              class="text-md-primary dark:text-md-dark-primary font-medium hover:underline ml-1"
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