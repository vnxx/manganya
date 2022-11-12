/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{svelte,js,ts}'],
  theme: {
    extend: {
      colors: {
        'primary': '#070725',
        'secondary': '#30304B',
        'secondary-hover': '#26263C',
        'main-white': '#8B8CA3',
        'main-red': '#E4182B',
        'main-red-hover': '#A81220'
      },
      minHeight: {
        'main-screen': 'calc(100vh - 127px)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
}
