/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  // important: '#root',
  theme: {
    extend: {
      colors: {
        'salamanca-blue-600': '#108AC9',
      },
      backgroundImage: {
        research: 'url("/pollen.png") ',
        register: 'url("/bg-research.png") ',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
