/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts,css}'],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['SF Mono Regular', 'monospace']
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      },
    }
  },
  plugins: []
};