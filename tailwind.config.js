/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#12A5B8',
          light: '#48C4D3',
          dark: '#0A7E8D',
        },
        secondary: {
          DEFAULT: '#E5A900',
          light: '#FFC83B',
          dark: '#B28300',
        },
        accent: {
          DEFAULT: '#2A9D5C',
          bg: '#EBF7F0',
        },
        bgMain: '#F4F6F9',
      },
      borderRadius: {
        'apple-sm': '10px',
        'apple-md': '14px',
        'apple-lg': '18px',
        'apple-xl': '24px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(18, 165, 184, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(18, 165, 184, 0.16)',
        'glow': '0 0 24px rgba(18, 165, 184, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
