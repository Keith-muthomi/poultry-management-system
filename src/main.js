// Import Web Components so they are registered before the router tries to use them
import './components/layout/AppLayout.js';
import './components/pages/HomePage.js';
import './components/pages/AuthPage.js';
import './components/pages/NotFoundPage.js';
import './components/pages/ProductionPage.js';
import './components/pages/FlockPage.js';
import './components/pages/RecordsPage.js';
import './components/pages/FinancePage.js';
import './components/pages/SettingsPage.js';

// Admin Components
import './admin/AdminLayout.js';
import './admin/AdminSideNav.js';
import './admin/AdminDashboard.js';
import './admin/AdminReports.js';
import './admin/AdminDataExtraction.js';

// UI Components
import './components/ui/StatCard.js';
import './components/ui/FlockCard.js';
import './components/ui/Table.js';
import './components/ui/Button.js';
import './components/ui/Modal.js';
import './components/ui/Toast.js';
import './components/ui/Popover.js';

import 'material-symbols';
import { AuthService } from './services/AuthService.js';

class ClientRouter {
    constructor(options = {}) {
        this.routes = [];
        this.navCounter = 0;
        this.useLayout = options.useLayout ?? true;
        this.layoutComponent = options.layoutComponent || 'app-layout';
        this.routerView = options.routerView || 'router-view';
        this.targetId = options.targetId || 'app';

        this.init();
    }

    registerRoute(path, component, useLayout = true) {
        this.routes.push({ path, component, useLayout });
    }

    findRoute(path) {
        return this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '*');
    }

    init() {
        window.addEventListener('popstate', () => {
            this.navigate(window.location.pathname, false);
        });

        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-link]');
            if (!link) return;
            e.preventDefault();
            this.navigate(link.getAttribute('href'));
        });

        customElements.whenDefined(this.layoutComponent).then(() => {
            this.navigate(window.location.pathname, false);
        });
    }

    async navigate(path, addToHistory = true) {
        const navId = ++this.navCounter;
        
        // AUTH GUARD
        if (!AuthService.isAuthenticated() && path !== '/auth') {
            path = '/auth';
            addToHistory = true;
        } else if (AuthService.isAuthenticated() && path === '/auth') {
            path = '/';
            addToHistory = true;
        }

        const route = this.findRoute(path);

        if (!route) {
            console.error(`[Router] 404: No route matches "${path}"`);
            return;
        }

        const outlet = document.getElementById(this.targetId);
        const shouldUseLayout = this.useLayout && route.useLayout;

        if (shouldUseLayout) {
            const isAdminRoute = path.startsWith('/admin');
            const layoutTag = isAdminRoute ? 'admin-layout' : this.layoutComponent;

            let layout = outlet.querySelector(layoutTag);

            if (!layout) {
                outlet.innerHTML = `<${layoutTag}></${layoutTag}>`;
                layout = outlet.querySelector(layoutTag);
                await customElements.whenDefined(layoutTag);
                await layout.updateComplete;
            }

            const view = layout.querySelector(this.routerView) || layout.shadowRoot?.querySelector(this.routerView);
            if (view && navId === this.navCounter) {
                view.innerHTML = `<${route.component}></${route.component}>`;
            }
        } else {
            outlet.innerHTML = `<${route.component}></${route.component}>`;
        }

        if (addToHistory) {
            window.history.pushState(null, null, path);
        }

        window.dispatchEvent(new CustomEvent('route-changed', { 
            detail: { path: window.location.pathname } 
        }));
    }
}

export const router = new ClientRouter({
    useLayout: true,
    layoutComponent: 'app-layout',
    targetId: 'app'
});

// Register application routes
router.registerRoute('/', 'home-page', true);
router.registerRoute('/auth', 'auth-page', false);
router.registerRoute('*', 'not-found-page', false);
router.registerRoute('/production', 'production-page', true);
router.registerRoute('/flock', 'flock-page', true);
router.registerRoute('/records', 'records-page', true);
router.registerRoute('/finance', 'finance-page', true);
router.registerRoute('/settings', 'settings-page', true);

// Admin Routes
router.registerRoute('/admin', 'admin-dashboard', true);
router.registerRoute('/admin/reports', 'admin-reports', true);
router.registerRoute('/admin/data', 'admin-data-extraction', true);
router.registerRoute('/admin/settings', 'settings-page', true);
