/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
      }
    },
  },
  plugins: [
    require('tailwindcss-animated')
  ],
};
