import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          bg: 'var(--paper-bg)',
          light: 'var(--paper-light)',
        },
        field: {
          green: 'var(--field-green)',
          forest: 'var(--forest-green)',
          moss: 'var(--moss-green)',
          sprout: 'var(--sprout-green)',
          ink: 'var(--ink-dark)',
          muted: 'var(--muted-text)',
        },
        wheat: 'var(--wheat-gold)',
        soil: 'var(--soil-brown)',
        mist: 'var(--mist-blue)',
      },
      maxWidth: {
        field: '1500px',
        'field-wide': '1600px',
      },
      borderRadius: {
        field: '12px',
      },
      boxShadow: {
        paper: '0 10px 26px rgb(43 45 41 / 0.055)',
        field: '0 20px 52px rgb(43 45 41 / 0.09)',
      },
      transitionTimingFunction: {
        field: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
}

export default config
