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

  renderContent() {
    return html`
      <div class="min-h-screen bg-md-background flex items-center justify-center px-6 animate-in fade-in duration-500">
        <div class="bg-md-surface p-8 rounded-md-xl border border-md-outline-variant/30 w-full max-w-sm shadow-elevation-1">

          <div class="flex flex-col items-center mb-8">
            <div class="w-12 h-12 rounded-md-md bg-md-primary flex items-center justify-center mb-4 shadow-elevation-1">
              <span class="material-symbols-rounded text-md-on-primary text-[28px]">eco</span>
            </div>
            <h1 class="text-[24px] font-normal text-md-on-surface tracking-tight">
              ${this.mode === 'login' ? 'Sign in to PoultryDocs' : 'Create an account'}
            </h1>
            <p class="text-md-on-surface-variant text-[14px] mt-1">Manage your farm with ease</p>
          </div>

          <div class="flex flex-col gap-5">

            ${this.mode === 'register' ? html`
              <div class="flex flex-col gap-1.5">
                <label class="text-[14px] font-medium text-md-on-surface-variant ml-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  class="bg-md-surface-variant/30 border-b border-md-outline rounded-t-md-xs p-3 text-[16px] focus:border-b-2 focus:border-md-primary outline-none transition-all placeholder:text-md-on-surface-variant/50"
                />
              </div>
            ` : ''}

            <div class="flex flex-col gap-1.5">
              <label class="text-[14px] font-medium text-md-on-surface-variant ml-1">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                class="bg-md-surface-variant/30 border-b border-md-outline rounded-t-md-xs p-3 text-[16px] focus:border-b-2 focus:border-md-primary outline-none transition-all placeholder:text-md-on-surface-variant/50"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[14px] font-medium text-md-on-surface-variant ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                class="bg-md-surface-variant/30 border-b border-md-outline rounded-t-md-xs p-3 text-[16px] focus:border-b-2 focus:border-md-primary outline-none transition-all placeholder:text-md-on-surface-variant/50"
              />
            </div>

            <ui-button 
              variant="filled" 
              fullWidth
              size="lg"
              label="${this.mode === 'login' ? 'Sign in' : 'Register'}" 
              class="mt-2">
            </ui-button>

          </div>

          <div class="text-[14px] text-md-on-surface-variant text-center mt-6">
            ${this.mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button
              @click=${() => this.toggleMode()}
              class="text-md-primary font-medium hover:underline ml-1"
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