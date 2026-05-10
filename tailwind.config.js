/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/renderer/**/*.{js,ts,jsx,tsx}',
    './src/renderer/index.html',
  ],
  theme: {
    extend: {
      colors: {
        island: {
          bg: 'rgba(0, 0, 0, 0.85)',
          border: 'rgba(255, 255, 255, 0.1)',
          hover: 'rgba(255, 255, 255, 0.15)',
        },
      },
      animation: {
        'expand': 'expand 0.3s ease-out',
        'collapse': 'collapse 0.3s ease-out',
        'music-bar': 'music-bar 0.8s ease-in-out infinite',
      },
      keyframes: {
        expand: {
          '0%': { width: '200px', height: '40px' },
          '100%': { width: '400px', height: '300px' },
        },
        collapse: {
          '0%': { width: '400px', height: '300px' },
          '100%': { width: '200px', height: '40px' },
        },
        'music-bar': {
          '0%, 100%': { height: '20%' },
          '50%': { height: '100%' },
        },
      },
    },
  },
  plugins: [],
};
