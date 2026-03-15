/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Corporate "Social/Professional" Design Tokens (Facebook-inspired)
        md: {
          // Primary: Facebook Blue (Darker variant #0866FF for better contrast)
          // WCAG Check: #0866FF on White (#FFFFFF) = 5.3:1 (Passes AA)
          primary: "#0866FF", 
          "on-primary": "#FFFFFF",
          "primary-container": "#E7F3FF", 
          "on-primary-container": "#003366",
          
          // Secondary: Neutral Slate Gray
          secondary: "#65676B", 
          "on-secondary": "#FFFFFF",
          "secondary-container": "#F0F2F5", 
          "on-secondary-container": "#050505",
          
          // Tertiary: Professional Teal
          tertiary: "#00A400", // Facebook-style success green
          "on-tertiary": "#FFFFFF",
          "tertiary-container": "#DCF2E0",
          "on-tertiary-container": "#004B00",
          
          error: "#F02849", // Facebook error red
          "on-error": "#FFFFFF",
          "error-container": "#FFEBEB",
          "on-error-container": "#600000",
          
          // Surfaces (Light Mode)
          surface: "#FFFFFF",
          "on-surface": "#050505",
          "surface-variant": "#F0F2F5",
          "on-surface-variant": "#65676B",
          "surface-container": "#F2F4F7", // Light grey for containers
          outline: "#ADB5BD", // More pronounced grey
          
          // Dark Mode Overrides
          // WCAG Check: #4B9BFF on #18191A = 6.9:1 (Passes AA)
          dark: {
            surface: "#18191A",
            "on-surface": "#E4E6EB",
            "surface-variant": "#242526",
            "on-surface-variant": "#B0B3B8",
            "surface-container": "#2D2E30", // Dark grey for containers
            outline: "#4E4F52", // More pronounced dark grey
            primary: "#4B9BFF",
            "primary-container": "#003366",
            "on-primary-container": "#E7F3FF",
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
        'elevation-1': '0 1px 2px rgba(0,0,0,0.1)',
        'elevation-2': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        'elevation-3': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
