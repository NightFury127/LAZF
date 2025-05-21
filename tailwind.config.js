/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
      colors: {
        dark: '#050505',
        'dark-accent': '#0f0f13',
        
        // Neon accent colors
        neon: {
          blue: {
            100: '#E6F7FF',
            200: '#BAE7FF',
            300: '#91D5FF',
            400: '#69C0FF',
            500: '#40A9FF',
            600: '#1890FF',
            700: '#096DD9',
            800: '#0050B3',
            900: '#003A8C',
          },
          purple: {
            100: '#F9F0FF',
            200: '#EFDBFF',
            300: '#D3ADF7',
            400: '#B37FEB',
            500: '#9254DE',
            600: '#722ED1',
            700: '#531DAB',
            800: '#391085',
            900: '#22075E',
          },
          green: {
            100: '#E6FFFB',
            200: '#B5F5EC',
            300: '#87E8DE',
            400: '#5CDBD3',
            500: '#36CFC9',
            600: '#13C2C2',
            700: '#08979C',
            800: '#006D75',
            900: '#00474F',
          },
        },
        
        // UI semantic colors
        primary: {
          50: '#F0F7FF',
          100: '#E6F1FF',
          200: '#CCE4FF',
          300: '#99C4FF',
          400: '#66A3FF',
          500: '#3382FF',
          600: '#0066FF',
          700: '#0052CC',
          800: '#003D99',
          900: '#002966',
        },
        
        // Shadcn UI colors
        border: 'hsl(240 3.7% 15.9%)',
        input: 'hsl(240 3.7% 15.9%)',
        ring: 'hsl(240 4.9% 83.9%)',
        background: 'hsl(240 10% 3.9%)',
        foreground: 'hsl(0 0% 98%)',
        muted: {
          DEFAULT: 'hsl(240 3.7% 15.9%)',
          foreground: 'hsl(240 5% 64.9%)',
        },
        accent: {
          DEFAULT: 'hsl(240 3.7% 15.9%)',
          foreground: 'hsl(0 0% 98%)',
        },
        popover: {
          DEFAULT: 'hsl(240 10% 3.9%)',
          foreground: 'hsl(0 0% 98%)',
        },
        card: {
          DEFAULT: 'hsl(240 10% 3.9%)',
          foreground: 'hsl(0 0% 98%)',
        },
      },
      
      boxShadow: {
        'neon-blue': '0 0 5px rgba(24, 144, 255, 0.2), 0 0 20px rgba(24, 144, 255, 0.2)',
        'neon-purple': '0 0 5px rgba(114, 46, 209, 0.2), 0 0 20px rgba(114, 46, 209, 0.2)',
        'neon-green': '0 0 5px rgba(19, 194, 194, 0.2), 0 0 20px rgba(19, 194, 194, 0.2)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.25)',
        'card-hover': '0 10px 30px rgba(0, 0, 0, 0.35)',
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(to right, rgba(24, 144, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(24, 144, 255, 0.1) 1px, transparent 1px)',
        'hero-glow': 'radial-gradient(circle at center, rgba(24, 144, 255, 0.15) 0%, transparent 70%)',
      },
      
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: 0.8 },
          '50%': { opacity: 0.4 },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      
      animation: {
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      
      backdropBlur: {
        xs: '2px',
      },
      
      borderWidth: {
        '1': '1px',
      },
      
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '18': '4.5rem',
        '68': '17rem',
        '100': '25rem',
        '104': '26rem',
        '108': '27rem',
        '112': '28rem',
      },
    },
  },
  plugins: [],
};
