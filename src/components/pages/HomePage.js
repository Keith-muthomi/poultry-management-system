import { LitElement, html } from 'lit';
import { BasePage } from '../base/BasePage.js';

export class HomePage extends BasePage {

  // Helper for Stat Cards
  renderStatCard(label, value, trend, icon, colorClass) {
    return html`
      <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <span class="p-2 rounded-lg ${colorClass} bg-opacity-10">
            <span class="material-symbols-rounded text-xl ${colorClass.replace('bg-', 'text-')}">${icon}</span>
          </span>
          <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">${trend}</span>
        </div>
        <h3 class="text-gray-500 text-sm font-medium">${label}</h3>
        <p class="text-2xl font-bold text-gray-900 mt-1">${value}</p>
      </div>
    `;
  }

  render() {
    return html`
      <div class="space-y-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Farm Overview</h1>
          <p class="text-gray-500 text-sm">Real-time health and production metrics for today.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${this.renderStatCard('Total Birds', '12,450', '+2.4%', 'eco', 'bg-blue-500')}
          ${this.renderStatCard('Egg Production', '8,902', '+0.8%', 'egg', 'bg-amber-500')}
          ${this.renderStatCard('Feed Stock', '450kg', '-12%', 'inventory_2', 'bg-emerald-500')}
          ${this.renderStatCard('Mortality Rate', '0.02%', '-0.1%', 'monitoring', 'bg-rose-500')}
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div class="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[300px]">
            <div class="flex items-center justify-between mb-6">
              <h2 class="font-semibold text-gray-800">Production Trends</h2>
              <select class="text-sm border-gray-200 rounded-lg focus:ring-primary-500">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div class="flex items-center justify-center h-48 border-2 border-dashed border-gray-100 rounded-lg bg-gray-50">
              <p class="text-gray-400 text-sm">Growth/Production Chart Area</p>
            </div>
          </div>

          <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 class="font-semibold text-gray-800 mb-4">Today's Schedule</h2>
            <div class="space-y-4">
              <div class="flex gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <span class="material-symbols-rounded text-blue-600">vaccines</span>
                <div>
                  <p class="text-sm font-medium text-blue-900">Vaccination: Batch A</p>
                  <p class="text-xs text-blue-700">Due by 2:00 PM</p>
                </div>
              </div>
              <div class="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span class="material-symbols-rounded text-gray-500">cleaning_services</span>
                <div>
                  <p class="text-sm font-medium text-gray-900">Pen 04 Cleaning</p>
                  <p class="text-xs text-gray-500">Routine Maintenance</p>
                </div>
              </div>
            </div>
            <button class="w-full mt-6 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
              View All Tasks
            </button>
          </div>

        </div>
      </div>
    `;
  }
}
customElements.define('home-page', HomePage);