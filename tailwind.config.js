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
        research:
          'url("/background-research.png"),radial-gradient(circle, rgba(255,255,255,1) 7%, rgba(229,232,234,1) 98%)',
      },
    },
  },
  plugins: [],
}
