/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  safelist: [/^bg-/, /^text-/],
  theme: {
    extend: {
      colors: {
        'color-primary': 'rgb(49, 54, 67)',
        'color-gray': '#191919',
        'color-gray-25': '#BBBBBB',
        'color-gray-50': '#A8A8A8',
        'color-gray-100': '#919191',
        'color-gray-150': '#4A4A4A',
        'color-gray-200': '#474747',
        'color-gray-300': '#353535',
        'color-gray-600': '#2f2f2f',
        'color-gray-650': '#262626',
        'color-gray-700': '#1E1E1E',
      },
      screens: {
        'xs': '400px',
        // => @media (min-width: 400px) { ... }

        'sm': '576px',
        // => @media (min-width: 640px) { ... }
  
        'md': '768px',
        // => @media (min-width: 768px) { ... }
  
        'lg': '992px',
        // => @media (min-width: 1024px) { ... }
  
        'xl': '1200px',
        // => @media (min-width: 1280px) { ... }
  
        '2xl': '1400px',
        // => @media (min-width: 1536px) { ... }
      }
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        "xs": "0.5rem",
      }
    }
  },
  plugins: [],
};
