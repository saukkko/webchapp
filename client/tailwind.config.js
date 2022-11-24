/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1f2937',
        'primary-light': '#334155',
        'primary-highlight': '#475569',
        'secondary': '#fdba74',
        'secondary-light': '#fed7aa',
      },
      
    },
    
  },
  plugins: [require('@tailwindcss/forms'),
  require('tailwind-scrollbar')],
}
