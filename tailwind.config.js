/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── KariDoot Craft-Tech Studio Palette ──
        obsidian: {
          DEFAULT: '#0B0F17',
          light: '#111827',
          mid: '#1E293B',
          soft: '#243045',
        },
        saffron: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dark: '#D97706',
          glow: '#F59E0B33',
        },
        emerald: {
          craft: '#10B981',
          light: '#34D399',
          dark: '#059669',
          glow: '#10B98122',
        },
        rose: {
          craft: '#F43F5E',
        },
        // Legacy heritage tokens (retained for mock data etc.)
        cotton: '#FAF7F2',
        terracotta: {
          DEFAULT: '#C85A32',
          light: '#E07050',
          dark: '#A04420',
        },
        'indigo-craft': '#1B2430',
        brass: {
          DEFAULT: '#D49B35',
          light: '#E8B54A',
          dark: '#B07C20',
        },
        khadi: {
          DEFAULT: '#2C523C',
          light: '#3D7054',
          dark: '#1E3828',
        },
        sand: '#EFE9DF',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'obsidian-radial': 'radial-gradient(ellipse at 50% 0%, #1E293B 0%, #0B0F17 65%)',
        'saffron-gradient': 'linear-gradient(135deg, #F59E0B, #D97706)',
        'emerald-gradient': 'linear-gradient(135deg, #10B981, #059669)',
        'gold-shimmer': 'linear-gradient(90deg, transparent, #F59E0B44, transparent)',
        'glass-surface': 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
        'card-glow': 'radial-gradient(ellipse at top, #1E293B88, transparent)',
      },
      boxShadow: {
        'glow-saffron': '0 0 20px #F59E0B33, 0 0 60px #F59E0B11',
        'glow-emerald': '0 0 20px #10B98133, 0 0 60px #10B98111',
        'glow-soft': '0 0 30px rgba(255,255,255,0.04)',
        'card-dark': '0 1px 0 rgba(255,255,255,0.05) inset, 0 20px 60px rgba(0,0,0,0.4)',
        'card-lift': '0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.07) inset',
        'tactile': '0 4px 0 0 #1B2430',
        'tactile-sm': '0 2px 0 0 #1B2430',
      },
      animation: {
        'scan-beam': 'scan-beam 1.6s cubic-bezier(0.4,0,0.2,1) forwards',
        'bracket-lock': 'bracket-lock 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'pulse-ring': 'pulse-ring 2s ease-in-out infinite',
        'stamp': 'stamp 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'ticker': 'ticker 22s linear infinite',
        'count-up': 'count-up 0.3s ease-out',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'soundwave': 'soundwave 1.1s ease-in-out infinite',
        'waveform': 'waveform 0.8s ease-in-out infinite alternate',
        'island-expand': 'island-expand 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'particle-burst': 'particle-burst 0.6s ease-out forwards',
        'spin-slow': 'spin 6s linear infinite',
        'tilt-card': 'tilt-card 0.15s ease-out',
        'fade-slide-up': 'fade-slide-up 0.4s ease-out both',
        'typewriter': 'typewriter 0.05s steps(1) forwards',
        'screen-shake': 'screen-shake 0.4s ease-in-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'scan-beam': {
          '0%': { top: '0%', opacity: '0' },
          '5%': { opacity: '1' },
          '95%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
        'bracket-lock': {
          '0%': { transform: 'scale(1.3)', opacity: '0' },
          '60%': { transform: 'scale(0.95)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '70%': { transform: 'scale(1.5)', opacity: '0' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        stamp: {
          '0%': { transform: 'scale(3.5) rotate(-20deg)', opacity: '0' },
          '55%': { transform: 'scale(0.88) rotate(4deg)', opacity: '1' },
          '75%': { transform: 'scale(1.08) rotate(-2deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        ticker: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        soundwave: {
          '0%, 100%': { transform: 'scaleY(0.35)' },
          '50%': { transform: 'scaleY(1.2)' },
        },
        waveform: {
          '0%': { height: '4px' },
          '100%': { height: '28px' },
        },
        'island-expand': {
          '0%': { width: '120px', borderRadius: '999px' },
          '100%': { width: '340px', borderRadius: '24px' },
        },
        'particle-burst': {
          '0%': { transform: 'scale(0) translateY(0)', opacity: '1' },
          '100%': { transform: 'scale(1) translateY(-40px)', opacity: '0' },
        },
        'fade-slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'screen-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-4px)' },
          '30%': { transform: 'translateX(4px)' },
          '45%': { transform: 'translateX(-3px)' },
          '60%': { transform: 'translateX(3px)' },
          '75%': { transform: 'translateX(-2px)' },
          '90%': { transform: 'translateX(2px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'count-up': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
      },
    },
  },
  plugins: [],
}
