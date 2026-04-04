import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark surface — #0D1B2A replaces navy
        navy: {
          DEFAULT: '#0D1B2A',
          50: '#F1F4F7',
          100: '#DCE3EB',
          200: '#B8C6D4',
          300: '#8DA3B6',
          400: '#5C7A94',
          500: '#3E5E78',
          600: '#2A4259',
          700: '#1A2E40',
          800: '#0D1B2A',
          900: '#060D15',
        },
        // Brand accent — burnt orange #E8440A
        brand: {
          DEFAULT: '#E8440A',
          hover: '#CC3A08',
          50: '#FFF1EC',
          100: '#FDDDD0',
          200: '#FABDA0',
          300: '#F59D72',
          400: '#EE7040',
          500: '#E8440A',
          600: '#CC3A08',
          700: '#A82F06',
        },
        // Sage is now orange tint (used for selected/hover states)
        sage: '#FFF1EC',
        // Cream is now pure white
        cream: '#FFFFFF',
        // Card surface
        card: '#FAFAF9',
        // Body text
        body: '#374151',
        // Muted text
        muted: '#9CA3AF',
        // Dividers
        divider: '#F0EDE8',
        success: {
          DEFAULT: '#E8440A',
          tint: '#FFF1EC',
        },
        // Warning (possible)
        warning: {
          DEFAULT: '#B8780A',
          tint: '#FFF8E8',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.07)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.10)',
        'card-lg': '0 8px 32px rgba(0,0,0,0.10)',
        'orange': '0 4px 14px rgba(232,68,10,0.35)',
      },
      borderRadius: {
        card: '14px',
        input: '8px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'fade-up': 'fadeUp 0.55s ease forwards',
        'marquee': 'marquee 32s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
