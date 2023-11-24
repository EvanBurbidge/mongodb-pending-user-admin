/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@thewebuiguy/components/**/*.js'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#212936',
        secondary: '#525C6B',
        success: '#329441',
        successHover: '#287935',
        warning: '#847D47',
        error: '#6B1E1A',
        highlight: '#0083aa',
        highlightHover: '#E8F7FC',
        draggableBg: '#FCFDFF',
        draggableBorder: '#CCD6E2',
        draggableFont: '#525C6B'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    })
  ]
}
