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
        'snare': 'rgb(75,85,99)', //default snare
        'kick': 'rgb(234, 179, 8)', //default kick
        'hihat': '#8B4513', //default hh
        'ride': '#FFD700', // default ride
        'rack-tom': '#32CD32', // default rack tom
        'floor-tom': '#8A2BE2' // default floor
      },
      boxShadow: {
        'outline': 'inset 1px 1px black, inset -1px -1px black;'
      },
      height: {
        'test': '24rem'
      }
    },
  },
  plugins: [],
}

