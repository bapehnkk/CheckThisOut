/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.tsx',
  ],
  darkMode: 'class', // or 'media' or 'class'
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
  ],
};