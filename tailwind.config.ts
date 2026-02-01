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
        primary: {
          DEFAULT: '#2563eb',
          light: '#dbeafe',
        },
        secondary: {
          DEFAULT: '#059669',
          light: '#d1fae5',
        },
        accent: '#7c3aed',
        warning: '#f59e0b',
        danger: '#ef4444',
        dark: '#1e293b',
        light: '#f8fafc',
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
    },
  },
  plugins: [],
}
export default config
