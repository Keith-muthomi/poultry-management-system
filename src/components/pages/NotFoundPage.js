import { LitElement, html } from 'lit';
import { BasePage } from '../base/BasePage.js';

export class NotFoundPage extends BasePage {

  render() {
    return html`
      <section class="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-50 px-6">

        <!-- animated background glow -->
        <div class="absolute inset-0 opacity-30">
          <div class="absolute w-96 h-96 bg-primary-500 blur-3xl rounded-full animate-pulse -top-20 -left-20"></div>
          <div class="absolute w-96 h-96 bg-yellow-400 blur-3xl rounded-full animate-pulse bottom-0 right-0"></div>
        </div>

        <!-- floating eggs -->
        <div class="absolute inset-0 pointer-events-none">
          <span class="absolute text-3xl animate-bounce top-20 left-20">🥚</span>
          <span class="absolute text-2xl animate-bounce delay-300 top-40 right-32">🥚</span>
          <span class="absolute text-4xl animate-bounce delay-700 bottom-32 left-1/3">🥚</span>
        </div>

        <div class="relative text-center max-w-xl">

          <h1 class="text-8xl font-extrabold text-primary-600 tracking-tight animate-[float_4s_ease-in-out_infinite]">
            404
          </h1>

          <h2 class="text-2xl font-semibold text-neutral-800 mt-4">
            This page flew the coop
          </h2>

          <p class="text-neutral-500 mt-2 mb-8">
            The page you're looking for doesn't exist or wandered somewhere else in the farm.
          </p>

          <div class="flex justify-center gap-4">

            <a
              href="/"
              class="px-6 py-3 rounded-xl bg-primary-600 text-white font-medium shadow-lg
              hover:shadow-xl hover:scale-105 hover:bg-primary-700 transition-all duration-200"
            >
              Return Home
            </a>

            <button
              onclick="history.back()"
              class="px-6 py-3 rounded-xl border border-neutral-300 text-neutral-700
              hover:bg-neutral-100 hover:scale-105 transition-all duration-200"
            >
              Go Back
            </button>

          </div>

        </div>

        <style>
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
            100% { transform: translateY(0px); }
          }
        </style>

      </section>
    `;
  }
}

customElements.define('not-found-page', NotFoundPage);

