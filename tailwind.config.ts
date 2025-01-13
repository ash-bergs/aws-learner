import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // custom set up
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        highlight: 'var(--color-highlight)',
        text: 'var(--color-text)',
        note: 'var(--color-note)', // for the default note bg color
        modal: 'var(--color-modal)',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
