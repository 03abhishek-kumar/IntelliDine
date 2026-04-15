/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-gold': '#f5f5f5',
        'royal-amber': '#a3a3a3',
        'royal-black': '#050505',
        'royal-dark': '#111111',
      },
      fontFamily: {
        'royal': ['Cinzel', 'serif'],
        'elegant': ['Playfair Display', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(255, 255, 255, 0.2)',
        'gold-glow-strong': '0 0 40px rgba(255, 255, 255, 0.3)',
      },
      backgroundImage: {
        'gold-gradient': 'none',
      }
    },
  },
  plugins: [],
}
