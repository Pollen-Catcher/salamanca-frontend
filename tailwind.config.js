/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  important: '#root',
  theme: {
    extend: {
      colors: {
        'salamanca-blue-600': '#108AC9',
      },
      backgroundImage: {
        research: 'url("/pollen.png") ',
      },
    },
  },
  plugins: [],
}
