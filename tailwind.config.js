/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#020308',
        deep: '#060e1a',
        gold: '#d4a853',
        'gold-bright': '#f0d878',
        'neon-blue': '#4a9eff',
        'neon-cyan': '#00e5ff',
        starlight: '#e8e0c8',
        hud: '#1a2040',
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        mono: ['Consolas', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(212,168,83,0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(212,168,83,0.8)' },
        },
        scan: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
