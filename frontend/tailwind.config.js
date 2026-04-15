/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-gold': '#cfa756',
        'royal-amber': '#8b6e2f',
        'royal-black': '#0c0c0c',
        'royal-dark': '#1a1a1a',
      },
      fontFamily: {
        'royal': ['Cinzel', 'serif'],
        'elegant': ['Playfair Display', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(207, 167, 86, 0.3)',
        'gold-glow-strong': '0 0 40px rgba(207, 167, 86, 0.5)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(to right, #cfa756, #8b6e2f)',
      }
    },
  },
  plugins: [],
}
