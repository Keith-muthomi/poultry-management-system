/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
  primary: {
    50: "#eef5ff",
    100: "#d9e8ff",
    200: "#bcd8ff",
    300: "#8ec0ff",
    400: "#599dff",
    500: "#256eff", // Standard Brand Blue
    600: "#1b55f5",
    700: "#1441e1",
    800: "#1735b6",
    900: "#19328f",
    950: "#142057",
  },

  secondary: {
    50: "#fef8ee",
    100: "#fdf1d7",
    200: "#fbdead",
    300: "#f8c679",
    400: "#f4a443",
    500: "#f0891f",
    600: "#ea7317",
    700: "#bb5413",
    800: "#954317",
    900: "#783816",
    950: "#411a09",
  },

  tertiary: {
    50: "#f2f9fd",
    100: "#e4f0fa",
    200: "#c3e2f4",
    300: "#8fcbea",
    400: "#3da5d9",
    500: "#2d95ca",
    600: "#1d77ac",
    700: "#19608b",
    800: "#195273",
    900: "#1a4460",
    950: "#112c40",
  },

  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e6e6e6",
    300: "#d6d6d6",
    400: "#a5a5a5",
    500: "#767676",
    600: "#575757",
    700: "#434343",
    800: "#292929",
    900: "#191919",
    950: "#0a0a0a",
  },

  success: {
    50: "#ecfdf4",
    100: "#d2f9e3",
    200: "#a9f1cc",
    300: "#71e4af",
    400: "#35ce8d",
    500: "#14b575",
    600: "#099260",
    700: "#07754f",
    800: "#085d40",
    900: "#084c36",
    950: "#032b1f",
  },

  error: {
    50: "#fff0f2",
    100: "#ffe2e7",
    200: "#ffcad5",
    300: "#ff9fb3",
    400: "#ff698b",
    500: "#ff3366",
    600: "#ed1152",
    700: "#c80846",
    800: "#a80942",
    900: "#8f0c3e",
    950: "#50011d",
  },

  dark: {
    primary: {
      50: "#001a41",
      100: "#003062",
      200: "#00468b",
      300: "#256eff",
      400: "#599dff",
      500: "#7cacff", // Refactored: Softer blue for dark mode buttons
      600: "#a8c7ff",
      700: "#d8e2ff",
      800: "#eef5ff",
      900: "#f8f9ff",
      950: "#ffffff",
    },

    secondary: {
      50: "#281000",
      100: "#411a09",
      200: "#783816",
      300: "#bb5413",
      400: "#f0891f",
      500: "#f8c679", // Desaturated gold for dark mode
      600: "#fbdead",
      700: "#fdf1d7",
      800: "#fef8ee",
      900: "#ffffff",
      950: "#ffffff",
    },

    tertiary: {
      50: "#001e2f",
      100: "#112c40",
      200: "#1a4460",
      300: "#1d77ac",
      400: "#2d95ca",
      500: "#8fcbea", // Softer cyan for dark mode
      600: "#c3e2f4",
      700: "#e4f0fa",
      800: "#f2f9fd",
      900: "#ffffff",
      950: "#ffffff",
    },

    neutral: {
      50: "#0a0a0a",
      100: "#191919",
      200: "#292929",
      300: "#434343",
      400: "#575757",
      500: "#767676",
      600: "#a5a5a5",
      700: "#d6d6d6",
      800: "#e6e6e6",
      900: "#f5f5f5",
      950: "#fafafa",
    },

    success: {
      50: "#032b1f",
      100: "#084c36",
      200: "#07754f",
      300: "#099260",
      400: "#14b575",
      500: "#86da8d", // Desaturated success green
      600: "#a9f1cc",
      700: "#d2f9e3",
      800: "#ecfdf4",
      900: "#ffffff",
      950: "#ffffff",
    },

    error: {
      50: "#50011d",
      100: "#8f0c3e",
      200: "#a80942",
      300: "#c80846",
      400: "#ed1152",
      500: "#ffb4ab", // Standard M3 Dark Error
      600: "#ffcad5",
      700: "#ffe2e7",
      800: "#fff0f2",
      900: "#ffffff",
      950: "#ffffff",
    },
  }
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
