import type { Config } from 'tailwindcss';

/**
 * Organic theme: warm sands, sea-foam greens, coral accents and soft
 * rounded shapes. The palette leans earthy and natural to match the
 * "from the tide, to your table" feel of the shop.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#faf6ef',
          100: '#f3ebdd',
          200: '#e6d7bd',
          300: '#d6bd93',
        },
        moss: {
          400: '#7f9b6f',
          500: '#5f7d52',
          600: '#4a6340',
          700: '#3a4e33',
        },
        coral: {
          300: '#f6a07a',
          400: '#ef7d54',
          500: '#e2603a',
          600: '#c44b2c',
        },
        tide: {
          100: '#dcebe8',
          300: '#9cc4bd',
          500: '#5f948b',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        body: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        blob: '42% 58% 63% 37% / 41% 44% 56% 59%',
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(74, 99, 64, 0.35)',
      },
      keyframes: {
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        rise: {
          '0%': { transform: 'translateY(24px) scale(0.7)', opacity: '0' },
          '25%': { opacity: '0.55' },
          '100%': { transform: 'translateY(-170px) scale(1)', opacity: '0' },
        },
      },
      animation: {
        bob: 'bob 5s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        sway: 'sway 6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.7s ease-out both',
        'pop-in': 'popIn 0.5s ease-out both',
        rise: 'rise 7s ease-in infinite',
      },
    },
  },
  plugins: [],
};

export default config;
