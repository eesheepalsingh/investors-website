/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ia: {
          // Surfaces
          bg: '#ffffff',
          cream: '#f3f3f3',
          'cream-2': '#e8e8e8',
          surface: '#f3f3f3',
          // Text
          ink: '#111111',
          'ink-2': '#1f1f1f',
          muted: '#5b5b5b',
          'muted-2': '#8a8a8a',
          // Lines
          line: '#e6e2da',
          'line-2': '#d9d4c9',
          // Brand accent (red) — named "brand" to avoid Tailwind `red` palette conflict
          brand: '#ef4444',
          'brand-2': '#dc2626',
          yellow: '#f3f3f3',
          'yellow-2': '#e8e8e8',
          highlight: '#f5c518',
          green: '#36a96a',
          blue: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'tightish': '-0.02em',
        'tighter-2': '-0.035em',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,15,15,0.04), 0 8px 24px -8px rgba(15,15,15,0.08)',
        card: '0 1px 0 rgba(15,15,15,0.04), 0 10px 30px -12px rgba(15,15,15,0.10)',
        cta: '0 6px 16px -6px rgba(239,68,68,0.45)',
      },
    },
  },
  plugins: [],
};
