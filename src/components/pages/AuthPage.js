// src/components/pages/AuthPage.js
import { html } from 'lit';
import { BasePage } from '../base/BasePage.js';

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
      <div class="min-h-screen bg-gray-50 flex items-center justify-center">
        <div class="bg-white p-8 rounded-lg border border-gray-200 w-full max-w-sm">

          <h1 class="text-xl font-semibold text-gray-900 mb-6">
            ${this.mode === 'login' ? 'Sign in' : 'Create account'}
          </h1>

          <div class="flex flex-col gap-4">

            ${this.mode === 'register' ? html`
              <div class="flex flex-col gap-1">
                <label class="text-sm text-gray-600">Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            ` : ''}

            <div class="flex flex-col gap-1">
              <label class="text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm text-gray-600">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button class="bg-primary-600 text-white text-sm font-medium py-2 rounded-md hover:bg-primary-700 transition-colors">
              ${this.mode === 'login' ? 'Sign in' : 'Register'}
            </button>

          </div>

          <p class="text-sm text-gray-500 text-center mt-4">
            ${this.mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button
              @click=${() => this.toggleMode()}
              class="text-primary-600 hover:underline ml-1"
            >
              ${this.mode === 'login' ? 'Register' : 'Sign in'}
            </button>
          </p>

        </div>
      </div>
    `;
  }
}
customElements.define('auth-page', AuthPage);