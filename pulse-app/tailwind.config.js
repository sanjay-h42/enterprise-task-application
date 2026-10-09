/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PULSE Design System Colors
        // Neutral Foundation
        canvas: {
          DEFAULT: '#F7F6F3',
          dark: '#F0EEE9',
        },
        ink: {
          DEFAULT: '#1C1917',
          secondary: '#44403C',
          muted: '#78716C',
          subtle: '#A8A29E',
          faint: '#D6D3D1',
        },
        // Navigation
        nav: {
          bg: '#18181B',
          hover: '#27272A',
          border: '#3F3F46',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          raised: '#FAFAF9',
          overlay: '#F5F4F1',
        },
        border: {
          DEFAULT: '#E7E5E4',
          strong: '#D6D3D1',
        },
        // Accent - Amber/Gold (distinctive, not boring blue)
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          DEFAULT: '#F59E0B',
          muted: '#FEF3C7',
        },
        // Semantic
        positive: {
          DEFAULT: '#16A34A',
          bg: '#F0FDF4',
          border: '#BBF7D0',
          text: '#15803D',
        },
        warning: {
          DEFAULT: '#D97706',
          bg: '#FFFBEB',
          border: '#FDE68A',
          text: '#B45309',
        },
        critical: {
          DEFAULT: '#DC2626',
          bg: '#FEF2F2',
          border: '#FECACA',
          text: '#B91C1C',
        },
        // Performance Rating
        excellent: '#16A34A',
        verygood: '#0EA5E9',
        good: '#8B5CF6',
        needsimprovement: '#F59E0B',
        poor: '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'subheading': ['1.125rem', { lineHeight: '1.4', letterSpacing: '-0.005em', fontWeight: '500' }],
        'label': ['0.6875rem', { lineHeight: '1', letterSpacing: '0.07em', fontWeight: '600', textTransform: 'uppercase' }],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'modal': '0 20px 60px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.08)',
        'nav': '1px 0 0 rgba(255,255,255,0.04)',
      },
      borderRadius: {
        'sm': '4px',
        DEFAULT: '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      spacing: {
        'sidebar': '240px',
        'sidebar-collapsed': '64px',
        'topbar': '56px',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(12px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'skeleton-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'score-fill': {
          from: { strokeDashoffset: '283' },
          to: { strokeDashoffset: 'var(--target-offset)' },
        },
        'progress-fill': {
          from: { width: '0%' },
          to: { width: 'var(--target-width)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(100%) scale(0.96)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'toast-out': {
          from: { opacity: '1', transform: 'translateY(0) scale(1)' },
          to: { opacity: '0', transform: 'translateY(100%) scale(0.96)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.2s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.2s ease-out forwards',
        'skeleton': 'skeleton-pulse 1.6s ease-in-out infinite',
        'toast-in': 'toast-in 0.24s ease-out forwards',
        'toast-out': 'toast-out 0.18s ease-in forwards',
      },
    },
  },
  plugins: [],
}
