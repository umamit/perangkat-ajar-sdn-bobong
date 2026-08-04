/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./templates/**/*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./static/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#12A5B8',
          dark: '#0A7E8D',
        },
        secondary: '#E5A900',
        accent: '#2A9D5C',
        bgMain: '#F5F5F7',
      },
      borderRadius: {
        'apple-sm': '10px',
        'apple-md': '14px',
        'apple-lg': '18px',
        'apple-xl': '24px',
      }
    },
  },
  plugins: [],
}
