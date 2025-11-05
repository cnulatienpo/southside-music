import { fontFamily } from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0c0c0f',
        neon: '#61f0ff',
        rust: '#ff5c8d'
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', ...fontFamily.mono]
      },
      boxShadow: {
        glow: '0 0 35px rgba(97, 240, 255, 0.35)'
      }
    }
  },
  plugins: []
} satisfies Config;
