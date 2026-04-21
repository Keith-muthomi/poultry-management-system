// This service helps users install our app on their phone or computer
class PwaService {
  constructor() {
    this.deferredPrompt = null;
    this.installable = false;
    this._listeners = new Set();
    this._isDebug = false;

    // Listen for the browser saying "hey, you can install this!"
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.installable = true;
      this._notifyListeners();
    });

    // Cleanup when the app is actually installed
    window.addEventListener('appinstalled', (evt) => {
      console.log('INSTALL: Success');
      this.installable = false;
      this.deferredPrompt = null;
      this._notifyListeners();
    });
  }

  // Force the install button to show so we can test it
  enableDebugMode() {
    this._isDebug = true;
    this.installable = true;
    this._notifyListeners();
    console.log('PWA Service: Debug mode enabled. Install button will be forced visible.');
  }

  // Let components know when the install status changes
  addListener(callback) {
    this._listeners.add(callback);
    callback({ installable: this.installable });
  }

  removeListener(callback) {
    this._listeners.delete(callback);
  }

  _notifyListeners() {
    this._listeners.forEach(callback => callback({ installable: this.installable }));
  }

  // Trigger the actual install prompt
  async install() {
    if (!this.deferredPrompt) {
      if (this._isDebug) {
        alert('DEBUG: Install triggered! (In a real environment, the browser install prompt would appear now)');
      } else {
        console.warn('PWA Install prompt not available.');
      }
      return;
    }
    
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    this.deferredPrompt = null;
    this.installable = false;
    this._notifyListeners();
  }
}

export const pwaService = new PwaService();
