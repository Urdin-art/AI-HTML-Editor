/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'clay': {
          'light': '#D2B48C', // Tan / Light Clay
          'DEFAULT': '#A1523E', // Terracotta
          'dark': '#8B4513',  // Saddle Brown / Dark Clay
        },
        'rust': {
          'light': '#B7410E', // Rust
          'DEFAULT': '#8B0000', // Dark Red / Deep Rust
        },
        'stone': {
          'light': '#F5F5DC', // Beige / Light Stone
          'DEFAULT': '#696969', // Dim Gray / Stone
          'dark': '#36454F',   // Charcoal / Dark Stone
        },
        'accent': '#E2725B', // Salmon / Terracotta Accent
      }
    },
  },
  plugins: [],
}
