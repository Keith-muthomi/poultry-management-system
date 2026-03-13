// Import Web Components so they are registered before the router tries to use them
import './components/layout/AppLayout.js';
import './components/pages/HomePage.js';
import './components/pages/AuthPage.js';
import './components/pages/NotFoundPage.js';
import './components/pages/ProductionPage.js';
import './components/pages/FlockPage.js';
import 'material-symbols';

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
        console.log(`[Router] Registered: ${path} -> <${component}>`);
    }

    findRoute(path) {
        return this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '*');
    }

    init() {
        // Handle Browser Back/Forward
        window.addEventListener('popstate', () => {
            console.log('[Router] Browser navigation detected (popstate)');
            this.navigate(window.location.pathname, false);
        });

        // Intercept Link Clicks
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
        const route = this.findRoute(path);

        if (!route) {
            console.error(`[Router] 404: No route matches "${path}"`);
            return;
        }

        console.group(`[Router] Navigating to: ${path}`);
        console.log(`[Router] Component: <${route.component}> | Layout: ${route.useLayout}`);

        const outlet = document.getElementById(this.targetId);
        const shouldUseLayout = this.useLayout && route.useLayout;

        if (shouldUseLayout) {
            let layout = outlet.querySelector(this.layoutComponent);

            if (!layout) {
                console.log(`[Router] Creating new layout: <${this.layoutComponent}>`);
                outlet.innerHTML = `<${this.layoutComponent}></${this.layoutComponent}>`;
                layout = outlet.querySelector(this.layoutComponent);
                await customElements.whenDefined(this.layoutComponent);
                await layout.updateComplete;
            }

            const view = layout.querySelector(this.routerView) || layout.shadowRoot?.querySelector(this.routerView);
            if (view && navId === this.navCounter) {
                view.innerHTML = `<${route.component}></${route.component}>`;
            }
        } else {
            console.log(`[Router] Rendering without layout`);
            outlet.innerHTML = `<${route.component}></${route.component}>`;
        }

        if (addToHistory) {
            window.history.pushState(null, null, path);
        }

        // Always dispatch this so components can highlight active links
        window.dispatchEvent(new CustomEvent('route-changed', { 
            detail: { path: window.location.pathname } 
        }));
        
        console.groupEnd();
    }
}

// Create router instance
export const router = new ClientRouter({
    useLayout: true,
    layoutComponent: 'app-layout',
    targetId: 'app'
});


// Register application routes
router.registerRoute('/', 'home-page', true);
router.registerRoute('/auth', 'auth-page', false); // ✅ tests the layout: false path
router.registerRoute('*', 'not-found-page', false); // 404 page for unmatched routes
router.registerRoute('/production', 'production-page', true); // ✅ new production page route
router.registerRoute('/flock', 'flock-page', true); // ✅ new flock page route