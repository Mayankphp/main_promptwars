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
        darkbg: '#0e1217',
        surface: {
          50: '#1e2634',
          100: '#1a222e',
          200: '#151b24',
          300: '#12171f',
          DEFAULT: '#151b24',
        },
        borderdark: {
          light: '#333f52',
          DEFAULT: '#252f3e',
          muted: '#1b232f'
        },
        copper: {
          50: '#fdf8f4',
          100: '#faefe7',
          200: '#f4decb',
          300: '#ebc5a3',
          400: '#dfa275',
          500: '#d97706',
          600: '#c05621',
          700: '#9c4221',
          800: '#7b341e',
          900: '#652b1a',
        },
        amberaccent: {
          light: '#fbbf24',
          DEFAULT: '#d97706',
          dark: '#b45309',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
