/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      colors: {
        ink: {
          950: '#06080B',
          900: '#0B0E13',
          850: '#0F131A',
          800: '#151A22',
          700: '#1E242E',
          600: '#2A3140',
          500: '#3A4252'
        },
        accent: {
          50: '#ECFEFF',
          300: '#7CF8EB',
          400: '#3DE6D2',
          500: '#14C8B2',
          600: '#0FA896'
        },
        signal: {
          get: '#3DE6D2',
          post: '#FFB547',
          put: '#8B9DFF',
          patch: '#D78BFF',
          delete: '#FF7A7A'
        }
      },
      boxShadow: {
        'glow-accent': '0 0 0 1px rgba(61,230,210,0.25), 0 8px 40px -12px rgba(61,230,210,0.35)'
      }
    }
  },
  plugins: []
};
