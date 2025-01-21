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
    },
  },
  darkMode: "class",
  plugins: [
    require('tailwindcss-animated'),
    heroui()
  ],
};
