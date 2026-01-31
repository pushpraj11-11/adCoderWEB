/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9e9ff",
          500: "#2b6ef3",
          600: "#2459c9"
        }
      },
      boxShadow: {
        card: "0 20px 60px -20px rgba(15, 23, 42, 0.25)"
      }
    }
  },
  plugins: []
};
