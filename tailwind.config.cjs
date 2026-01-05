/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./**/*.{html,js}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        lg: "2rem",
        xl: "2.5rem",
        "2xl": "3rem"
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1200px",
        "2xl": "1320px"
      }
    },
    extend: {
      colors: {
        ink: "#1f2937",
        slate: "#4b5563",
        cream: "#f7f4ef",
        moss: "#5b8b6f",
        paper: "#ffffff"
      },
      fontFamily: {
        display: ['"JT Douro Serif Black"', '"JT Douro Serif Regular"', "Georgia", "serif"],
        sans: ['"Source Sans 3"', "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 12px 30px -16px rgba(31, 41, 55, 0.35)"
      },
      borderRadius: {
        xl: "0.9rem"
      },
      letterSpacing: {
        wideish: "0.04em"
      },
      lineHeight: {
        relaxed: "1.75"
      }
    }
  },
  plugins: []
};
