import { LitElement, html } from 'lit';
import { BasePage } from '../base/BasePage.js';
import '../ui/Button.js';

export class NotFoundPage extends BasePage {

  render() {
    return html`
      <section class="relative flex min-h-[100vh] items-center justify-center overflow-hidden bg-neutral-100 dark:bg-neutral-900 px-6 transition-colors duration-300">

        <!-- M3 Tonal background glows -->
        <div class="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none">
          <div class="absolute w-96 h-96 bg-primary-500 dark:bg-primary-400 blur-[100px] rounded-md-full animate-pulse -top-20 -left-20"></div>
          <div class="absolute w-96 h-96 bg-tertiary-500 dark:bg-tertiary-400 blur-[100px] rounded-md-full animate-pulse bottom-0 right-0"></div>
        </div>

        <div class="relative text-center max-w-xl animate-in fade-in zoom-in duration-500">

          <h1 class="text-[120px] font-normal text-primary-600 dark:text-primary-500 leading-none tracking-tight animate-[float_4s_ease-in-out_infinite]">
            404
          </h1>

          <h2 class="text-[28px] font-normal text-neutral-900 dark:text-neutral-50 mt-6">
            This page flew the coop
          </h2>

          <p class="text-neutral-500 dark:text-neutral-400 text-[16px] mt-4 mb-10 tracking-wide">
            The page you're looking for doesn't exist or wandered somewhere else in the farm.
          </p>

          <div class="flex justify-center gap-4">
            <ui-button 
              variant="filled" 
              label="Return Home" 
              icon="home"
              @click=${() => window.location.href = '/'}>
            </ui-button>

            <ui-button 
              variant="outlined" 
              label="Go Back" 
              icon="arrow_back"
              @click=${() => history.back()}>
            </ui-button>
          </div>

        </div>

        <style>
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
        </style>

      </section>
    `;
  }
}

customElements.define('not-found-page', NotFoundPage);

