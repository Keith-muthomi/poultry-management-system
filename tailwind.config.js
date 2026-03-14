/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Corporate Material 3 Design Tokens (Slate/Navy Baseline)
        md: {
          // Primary: Professional Navy
          primary: "#1e40af", // blue-800
          "on-primary": "#FFFFFF",
          "primary-container": "#dbeafe", // blue-100
          "on-primary-container": "#1e3a8a", // blue-900
          
          // Secondary: Sophisticated Slate
          secondary: "#475569", // slate-600
          "on-secondary": "#FFFFFF",
          "secondary-container": "#f1f5f9", // slate-100
          "on-secondary-container": "#0f172a", // slate-900
          
          // Tertiary: Teal/Indigo accent
          tertiary: "#0d9488", // teal-600
          "on-tertiary": "#FFFFFF",
          "tertiary-container": "#ccfbf1", // teal-100
          "on-tertiary-container": "#115e59", // teal-800
          
          error: "#b91c1c",
          "on-error": "#FFFFFF",
          "error-container": "#fee2e2",
          "on-error-container": "#7f1d1d",
          
          // Surfaces (Light)
          surface: "#ffffff",
          "on-surface": "#0f172a",
          "surface-variant": "#f1f5f9",
          "on-surface-variant": "#475569",
          outline: "#94a3b8",
          background: "#f8fafc",
          
          // Dark Mode Overrides (Custom naming for internal use in components if needed, 
          // but standard Tailwind 'dark:' prefix is preferred)
          dark: {
            surface: "#0f172a",
            "on-surface": "#f8fafc",
            "surface-variant": "#1e293b",
            "on-surface-variant": "#94a3b8",
            outline: "#475569",
            background: "#020617",
            primary: "#60a5fa",
            "primary-container": "#1e3a8a",
            "on-primary-container": "#dbeafe",
          }
        },
      },
      borderRadius: {
        'md-xs': '4px',
        'md-sm': '8px',
        'md-md': '12px',
        'md-lg': '16px',
        'md-xl': '28px',
        'md-full': '9999px',
      },
      boxShadow: {
        'elevation-1': '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        'elevation-2': '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        'elevation-3': '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.30)',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
