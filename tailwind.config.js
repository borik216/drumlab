/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dm-blue': '#535d70',
        'ghost-blue': '#8ea5c6',
        'accent-red': '#ff2600',
      },
      boxShadow: {
        'outline': 'inset 1px 1px black, inset -1px -1px black;'
      }
    },
  },
  plugins: [],
}

