import { html } from 'lit';
import { BasePage } from '../base/BasePage.js';
import { AuthService } from '../../services/AuthService.js';
import { SettingsService } from '../../services/SettingsService.js';

// This is where users can change their name, email, or password
export class SettingsPage extends BasePage {
  static properties = {
    ...BasePage.properties,
    user: { type: Object },
    saving: { type: Boolean },
    toast: { type: Object }
  };

  constructor() {
    super();
    this.user = AuthService.getUser();
    this.saving = false;
    this.toast = { open: false, message: '', type: 'info' };
  }

  showToast(message, type = 'info') {
    this.toast = { open: true, message, type };
  }

  // Update the user's basic info like name and email
  async handleProfileUpdate(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    this.saving = true;
    try {
      const response = await SettingsService.updateProfile(data);
      this.user = AuthService.getUser(); // Refresh user data from local storage
      this.showToast('Profile updated successfully.', 'success');
    } catch (err) {
      this.showToast('Failed to update profile.', 'error');
    } finally {
      this.saving = false;
    }
  }

  // Change the user's password, making sure they typed it right twice
  async handlePasswordUpdate(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (data.newPassword !== data.confirmPassword) {
      this.showToast('Passwords do not match.', 'error');
      return;
    }

    this.saving = true;
    try {
      await SettingsService.updatePassword(data);
      this.showToast('Password updated successfully.', 'success');
      e.target.reset(); // Clear the form after success
    } catch (err) {
      this.showToast('Failed to update password.', 'error');
    } finally {
      this.saving = false;
    }
  }

  renderContent() {
    return html`
      <div class="space-y-6 animate-in fade-in duration-500">
        <div class="flex flex-col gap-0.5">
          <h1 class="text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">Settings</h1>
          <p class="text-neutral-500 dark:text-neutral-400 text-[12px] font-medium uppercase tracking-wider">Account & Preferences</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Profile Section -->
          <div class="bg-white dark:bg-neutral-900 rounded-md-lg border border-neutral-200/10 dark:border-neutral-800/10 overflow-hidden">
            <div class="px-6 py-4 border-b border-neutral-200/10 dark:border-neutral-800/10">
              <h2 class="text-[14px] font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">Profile Information</h2>
            </div>
            <form @submit=${this.handleProfileUpdate} class="p-6 space-y-4">
              <div>
                <label class="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <input name="name" .value=${this.user?.name} required class="w-full bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 outline-none" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <input type="email" name="email" .value=${this.user?.email} required class="w-full bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 outline-none" />
              </div>
              <div class="flex justify-end pt-2">
                <ui-button type="submit" size="sm" .loading=${this.saving} label="Save Profile"></ui-button>
              </div>
            </form>
          </div>

          <!-- Security Section -->
          <div class="bg-white dark:bg-neutral-900 rounded-md-lg border border-neutral-200/10 dark:border-neutral-800/10 overflow-hidden">
            <div class="px-6 py-4 border-b border-neutral-200/10 dark:border-neutral-800/10">
              <h2 class="text-[14px] font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">Security</h2>
            </div>
            <form @submit=${this.handlePasswordUpdate} class="p-6 space-y-4">
              <div>
                <label class="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Current Password</label>
                <input type="password" name="currentPassword" required class="w-full bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 outline-none" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">New Password</label>
                <input type="password" name="newPassword" required class="w-full bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 outline-none" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                <input type="password" name="confirmPassword" required class="w-full bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300/20 dark:border-neutral-700/20 rounded-md-xs px-3 py-2 text-[13px] text-neutral-900 dark:text-neutral-50 outline-none" />
              </div>
              <div class="flex justify-end pt-2">
                <ui-button type="submit" size="sm" .loading=${this.saving} label="Update Password"></ui-button>
              </div>
            </form>
          </div>
        </div>

        <ui-toast .open=${this.toast.open} .message=${this.toast.message} .type=${this.toast.type} @toast-closed=${() => this.toast = { ...this.toast, open: false }}></ui-toast>
      </div>
    `;
  }
}

customElements.define('settings-page', SettingsPage);
