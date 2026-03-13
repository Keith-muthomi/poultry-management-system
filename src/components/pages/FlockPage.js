import { LitElement, html } from 'lit';
import { BasePage } from '../base/BasePage.js';

export class FlockPage extends BasePage {

  renderStatCard(label, value, icon, colorClass) {
    return html`
      <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">

          <span class="p-2 rounded-lg ${colorClass} bg-opacity-10">
            <span class="material-symbols-rounded text-xl ${colorClass.replace('bg-', 'text-')}">
              ${icon}
            </span>
          </span>

        </div>

        <h3 class="text-gray-500 text-sm font-medium">${label}</h3>
        <p class="text-2xl font-bold text-gray-900 mt-1">${value}</p>
      </div>
    `;
  }

  render() {
    return html`

      <div class="space-y-8">

        <!-- Header -->
        <div class="flex items-center justify-between flex-wrap gap-4">

          <div>
            <h1 class="text-2xl font-bold text-gray-900">Flock Manager</h1>
            <p class="text-gray-500 text-sm">
              Manage poultry batches, flock health, and population data.
            </p>
          </div>

          <button class="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition">
            <span class="material-symbols-rounded text-lg">add</span>
            Add New Flock
          </button>

        </div>


        <!-- Flock Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          ${this.renderStatCard('Total Birds', '12,450', 'eco', 'bg-blue-500')}

          ${this.renderStatCard('Active Flocks', '6', 'groups', 'bg-emerald-500')}

          ${this.renderStatCard('Layers', '7,820', 'egg', 'bg-amber-500')}

          ${this.renderStatCard('Broilers', '4,630', 'restaurant', 'bg-rose-500')}

        </div>


        <!-- Flock Table -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

          <div class="flex items-center justify-between p-6 border-b border-gray-100">

            <h2 class="font-semibold text-gray-800">Flock Groups</h2>

            <input
              type="text"
              placeholder="Search flock..."
              class="text-sm border-gray-200 rounded-lg px-3 py-2 focus:ring-primary-500"
            />

          </div>


          <table class="w-full text-sm">

            <thead class="bg-gray-50 text-gray-500">
              <tr>
                <th class="text-left px-6 py-3 font-medium">Flock Name</th>
                <th class="text-left px-6 py-3 font-medium">Type</th>
                <th class="text-left px-6 py-3 font-medium">Breed</th>
                <th class="text-left px-6 py-3 font-medium">Bird Count</th>
                <th class="text-left px-6 py-3 font-medium">Age</th>
                <th class="text-left px-6 py-3 font-medium">Pen</th>
                <th class="text-left px-6 py-3 font-medium">Status</th>
                <th class="text-left px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>


            <tbody class="divide-y divide-gray-100">

              <tr class="hover:bg-gray-50">

                <td class="px-6 py-4 font-medium text-gray-900">
                  Layer Batch A
                </td>

                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700">
                    Layers
                  </span>
                </td>

                <td class="px-6 py-4">Hy-Line Brown</td>

                <td class="px-6 py-4">3,200</td>

                <td class="px-6 py-4">28 weeks</td>

                <td class="px-6 py-4">Pen 03</td>

                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                    Active
                  </span>
                </td>

                <td class="px-6 py-4 flex gap-2">

                  <button class="text-gray-500 hover:text-gray-700">
                    <span class="material-symbols-rounded">edit</span>
                  </button>

                  <button class="text-gray-500 hover:text-red-600">
                    <span class="material-symbols-rounded">delete</span>
                  </button>

                </td>

              </tr>


              <tr class="hover:bg-gray-50">

                <td class="px-6 py-4 font-medium text-gray-900">
                  Broiler Batch B
                </td>

                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                    Broilers
                  </span>
                </td>

                <td class="px-6 py-4">Cobb 500</td>

                <td class="px-6 py-4">4,600</td>

                <td class="px-6 py-4">5 weeks</td>

                <td class="px-6 py-4">Pen 06</td>

                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                    Active
                  </span>
                </td>

                <td class="px-6 py-4 flex gap-2">

                  <button class="text-gray-500 hover:text-gray-700">
                    <span class="material-symbols-rounded">edit</span>
                  </button>

                  <button class="text-gray-500 hover:text-red-600">
                    <span class="material-symbols-rounded">delete</span>
                  </button>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>
    `;
  }
}

customElements.define('flock-page', FlockPage);
