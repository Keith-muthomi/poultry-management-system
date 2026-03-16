import { LitElement, html } from 'lit';

export class ThemeToggle extends LitElement {
  createRenderRoot() { return this; }

  static properties = {
    isDark: { type: Boolean }
  };

  constructor() {
    super();
    this.isDark = localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (this.isDark) {
      document.documentElement.classList.add('dark');
    }
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    this.dispatchEvent(new CustomEvent('theme-changed', { detail: { isDark: this.isDark }, bubbles: true, composed: true }));
  }

  render() {
    return html`
      <button 
        @click=${this.toggleTheme}
        class="w-10 h-10 flex items-center justify-center rounded-md-full bg-neutral-200/50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all duration-200"
        title="Toggle Theme"
      >
        <span class="material-symbols-rounded text-[24px]">
          ${this.isDark ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
    `;
  }
}

customElements.define('theme-toggle', ThemeToggle);
