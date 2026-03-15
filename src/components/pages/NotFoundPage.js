import { LitElement, html } from 'lit';
import { BasePage } from '../base/BasePage.js';
import '../ui/Button.js';

export class NotFoundPage extends BasePage {

  render() {
    return html`
      <section class="relative flex min-h-[100vh] items-center justify-center overflow-hidden bg-md-surface-container dark:bg-md-dark-surface-container px-6 transition-colors duration-300">

        <!-- M3 Tonal background glows -->
        <div class="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none">
          <div class="absolute w-96 h-96 bg-md-primary dark:bg-md-dark-primary blur-[100px] rounded-md-full animate-pulse -top-20 -left-20"></div>
          <div class="absolute w-96 h-96 bg-md-tertiary dark:bg-md-dark-tertiary blur-[100px] rounded-md-full animate-pulse bottom-0 right-0"></div>
        </div>

        <div class="relative text-center max-w-xl animate-in fade-in zoom-in duration-500">

          <h1 class="text-[120px] font-normal text-md-primary dark:text-md-dark-primary leading-none tracking-tight animate-[float_4s_ease-in-out_infinite]">
            404
          </h1>

          <h2 class="text-[28px] font-normal text-md-on-surface dark:text-md-dark-on-surface mt-6">
            This page flew the coop
          </h2>

          <p class="text-md-on-surface-variant dark:text-md-dark-on-surface-variant text-[16px] mt-4 mb-10 tracking-wide">
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

