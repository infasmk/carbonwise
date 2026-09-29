/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        industrial: {
          950: '#0c0e11',
          900: '#121417',
          850: '#171a1f',
          800: '#1f232a',
          750: '#272c35',
          700: '#323843',
          600: '#48505e',
          500: '#647083',
          400: '#8b96a5',
          300: '#b8c0cc',
          200: '#e1e5eb',
          100: '#f0f2f5',
          50: '#f8f9fa',
        },
        ivory: {
          50: '#faf9f5',
          100: '#f5f3ec',
          200: '#eeeae0',
          300: '#dfd9ca',
          400: '#ccc2ad',
          500: '#b8ab90',
        },
        orange: {
          brand: '#e8590c',
          bright: '#f76707',
          dark: '#c94a00',
          subtle: '#fff4e6',
          border: '#ffd8a8',
        },
        status: {
          success: '#2f9e44',
          'success-bg': 'rgba(47, 158, 68, 0.12)',
          'success-border': 'rgba(47, 158, 68, 0.3)',
          danger: '#e03131',
          'danger-bg': 'rgba(224, 49, 49, 0.12)',
          'danger-border': 'rgba(224, 49, 49, 0.3)',
          warning: '#f59e0b',
          'warning-bg': 'rgba(245, 158, 11, 0.12)',
          'warning-border': 'rgba(245, 158, 11, 0.3)',
          info: '#228be6',
          'info-bg': 'rgba(34, 139, 230, 0.12)',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"DM Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
        'panel': '0 4px 12px -2px rgba(0, 0, 0, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.08)',
        'elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.18), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
