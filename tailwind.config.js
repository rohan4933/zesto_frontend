/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        swiggy: {
          DEFAULT: '#FC8019',
          hover: '#e26d11',
          light: '#fff5ed',
          dark: '#171a29',
          gray: '#686b78',
          bg: '#f4f5f7',
          card: '#282c3f'
        }
      }
    },
  },
  plugins: [],
}
