/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Soft girly pastel palette
        'rose-blush': '#FFB3C1',
        'soft-pink': '#FFC2D1',
        'peach': '#FFE5D9',
        'lavender': '#E8D5F2',
        'mint': '#D4F1F4',
        'cream': '#FFF8F0',
        'coral': '#FF9AA2',
        'lilac': '#C7CEEA',
        'birthday-gold': '#FFD700',
      },
      fontFamily: {
        'handwritten': ['"Brush Script MT"', 'cursive'],
        'elegant': ['"Playfair Display"', 'serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.8s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
