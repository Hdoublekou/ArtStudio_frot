/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Poppins"', '"Noto Sans SC"', 'sans-serif'],
      },
      colors: {
        limegreen: '#8FBC8F', 
      },
    },
  },
  plugins: [],
}
