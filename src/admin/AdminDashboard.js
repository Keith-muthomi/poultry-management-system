import { html } from 'lit';
import { BasePage } from '../components/base/BasePage.js';
import { AdminService } from '../services/AdminService.js';

export class AdminDashboard extends BasePage {
  static properties = {
    ...BasePage.properties,
    users: { type: Array },
    toast: { type: Object }
  };

  constructor() {
    super();
    this.users = [];
    this.toast = { open: false, message: '', type: 'info' };

    this.columns = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { 
        key: 'role', 
        label: 'Role',
        render: (val) => html`
          <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md-xs border ${val === 'Admin' ? 'bg-primary-100/50 text-primary-700 border-primary-200/20' : 'bg-neutral-100/50 text-neutral-700 border-neutral-200/20'}">
            ${val}
          </span>
        `
      },
      { 
        key: 'status', 
        label: 'Status',
        render: (val) => html`
          <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md-xs border ${val === 'Active' ? 'bg-success-100/50 text-success-700 border-success-200/20' : 'bg-error-100/50 text-error-700 border-error-200/20'}">
            ${val}
          </span>
        `
      },
      { key: 'created_at', label: 'Joined', render: (val) => new Date(val).toLocaleDateString() }
    ];

    this.actions = [
      { 
        icon: (row) => row.status === 'Active' ? 'block' : 'check_circle', 
        label: (row) => row.status === 'Active' ? 'Suspend' : 'Activate', 
        handler: (row) => this.toggleUserStatus(row) 
      },
      { icon: 'delete', label: 'Delete', handler: (row) => this.handleDelete(row) }
    ];
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchUsers();
  }

  async fetchUsers() {
    this.loading = true;
    try {
      this.users = await AdminService.getAllUsers();
    } catch (err) {
      this.error = "Failed to load users.";
    } finally {
      this.loading = false;
    }
  }

  showToast(message, type = 'info') {
    this.toast = { open: true, message, type };
  }

  async toggleUserStatus(row) {
    const newStatus = row.status === 'Active' ? 'Suspended' : 'Active';
    try {
      await AdminService.updateUserStatus(row.id, newStatus);
      this.showToast(`User ${row.name} ${newStatus === 'Suspended' ? 'suspended' : 'activated'}.`, 'success');
      await this.fetchUsers();
    } catch (err) {
      this.showToast('Failed to update user status.', 'error');
    }
  }

  async handleDelete(row) {
    if (confirm(`Are you sure you want to permanently delete user ${row.name}?`)) {
      try {
        await AdminService.deleteUser(row.id);
        this.showToast('User deleted.', 'success');
        await this.fetchUsers();
      } catch (err) {
        this.showToast('Failed to delete user.', 'error');
      }
    }
  }

  renderContent() {
    const activeUsers = this.users.filter(u => u.status === 'Active').length;
    const suspendedUsers = this.users.filter(u => u.status === 'Suspended').length;

    return html`
      <div class="space-y-6 animate-in fade-in duration-500">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex flex-col gap-0.5">
            <h1 class="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">Users Management</h1>
            <p class="text-neutral-500 dark:text-neutral-400 text-[12px] font-medium uppercase tracking-wider">Control Panel / Users</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <stat-card label="Total Users" value="${this.users.length}" icon="people" colorClass="border-primary-500"></stat-card>
          <stat-card label="Active Accounts" value="${activeUsers}" icon="person_check" colorClass="border-success-500"></stat-card>
          <stat-card label="Suspended" value="${suspendedUsers}" icon="person_off" colorClass="border-error-500"></stat-card>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between border-b border-neutral-200/10 dark:border-neutral-800/10 pb-2">
            <h2 class="text-[14px] font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">User Directory</h2>
          </div>
          <ui-table .columns=${this.columns} .data=${this.users} .actions=${this.actions}></ui-table>
        </div>

        <ui-toast .open=${this.toast.open} .message=${this.toast.message} .type=${this.toast.type} @toast-closed=${() => this.toast = { ...this.toast, open: false }}></ui-toast>
      </div>
    `;
  }
}

customElements.define('admin-dashboard', AdminDashboard);
