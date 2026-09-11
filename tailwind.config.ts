import type { Config } from 'tailwindcss';

/** Палитра «Эклиптики» для админки и калькулятора сметы: тёмно-синий и золото.
 *  Публичные страницы оформлены в app/site.css и эти токены почти не используют. */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0F1E',
        coal: '#0D1426',
        graphite: {
          DEFAULT: '#1B2336',
          800: '#232C42',
          700: '#2D3750',
          600: '#3A4560',
          500: '#5B6478',
          400: '#727B90',
        },
        gold: {
          DEFAULT: '#C9A45C',
          light: '#DDBF7E',
          soft: '#EAD9B0',
          dark: '#8F6F2E',
        },
        paper: '#FFFFFF',
        cream: '#F3F4F7',
        sand: '#E6E9EF',
        line: '#DDE1E8',
        lineDark: '#222B40',
      },
      fontFamily: {
        sans: ['var(--f-jost)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        mega: ['clamp(2rem, 8.5vw, 9rem)', { lineHeight: '0.98', letterSpacing: '-0.03em' }],
        display: ['clamp(1.9rem, 6vw, 6rem)', { lineHeight: '1.02', letterSpacing: '-0.025em' }],
        h1: ['clamp(1.8rem, 4.4vw, 4rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        h2: ['clamp(1.5rem, 3.2vw, 2.8rem)', { lineHeight: '1.12', letterSpacing: '-0.015em' }],
        h3: ['clamp(1.25rem, 2vw, 1.75rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      letterSpacing: { label: '0.24em' },
      maxWidth: { content: '1360px' },
      spacing: { section: 'clamp(3.5rem, 7vw, 6.5rem)' },
      boxShadow: {
        gold: '0 20px 60px -20px rgba(201,164,92,0.45)',
        lift: '0 30px 80px -30px rgba(10,15,30,0.5)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
        power: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
