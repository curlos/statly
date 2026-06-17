/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  safelist: [
    /^bg-/, /^text-/,
    'bg-[var(--theme-color)]',
    'bg-[var(--theme-color-half)]',
    'text-[var(--theme-color)]',
    'border-[var(--theme-color)]',
    'outline-[var(--theme-color)]',
    'hover:bg-[var(--theme-color)]',
    'hover:bg-[var(--theme-color-half)]',
    'hover:text-[var(--theme-color)]',
    'hover:border-[var(--theme-color)]',
    'hover:outline-[var(--theme-color)]',
    'focus:outline-[var(--theme-color)]',
    'focus:border-[var(--theme-color)]',
  ],
  theme: {
    extend: {
      colors: {
        'color-primary': 'rgb(49, 54, 67)',
        'color-gray': 'var(--color-gray)',
        'color-gray-25': 'var(--color-gray-25)',
        'color-gray-50': 'var(--color-gray-50)',
        'color-gray-100': 'var(--color-gray-100)',
        'color-gray-150': 'var(--color-gray-150)',
        'color-gray-200': 'var(--color-gray-200)',
        'color-gray-300': 'var(--color-gray-300)',
        'color-gray-600': 'var(--color-gray-600)',
        'color-gray-650': 'var(--color-gray-650)',
        'color-gray-700': 'var(--color-gray-700)',
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
