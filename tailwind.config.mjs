const {heroui} = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
       'gymie-secondary': 'rgba(207, 205, 205, 0.3)', 
       'gymie-primary': '#F5F5F5',
       'gymie-tertiary': 'rgba(217, 217, 217, 0.4)',
       'primary-black': 'rgba(0, 0, 0, 0.80)',
      },
      fontFamily:{
        poppins: ['Poppins']
      },
      transitionProperty: {
        'all': 'all',
      },
      keyframes: {
        slideDownAndFade: {
          from: { opacity: 0, transform: 'translateY(-2px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        slideDownAndFade: 'slideDownAndFade 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        }
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        'complete': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'overlay-fade': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'check-bounce': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'content-fade': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0.5' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'bounce-in': 'bounce-in 0.5s ease-out',
        'complete': 'complete 0.5s ease-out',
        'overlay-fade': 'overlay-fade 0.3s ease-out forwards',
        'check-bounce': 'check-bounce 0.5s ease-out forwards',
        'content-fade': 'content-fade 0.3s ease-out forwards',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
      }
    },
  },
  darkMode: "class",
  plugins: [
    require('tailwindcss-animated'),
    heroui()
  ],
};
