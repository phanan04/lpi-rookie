import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // No dark class mode — we use CSS variables for theming (Monkeytype style)
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lexend Deca', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // Monkeytype Serika Dark palette
        mt: {
          bg:      '#323437',
          sub:     '#2c2e31',
          text:    '#d1d0c5',
          'text-sub': '#646669',
          accent:  '#e2b714',
          error:   '#ca4754',
          success: '#4caf74',
        },
      },
    },
  },
  plugins: [],
}

export default config
