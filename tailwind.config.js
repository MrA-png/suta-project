/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        'suta-black': '#09090B',
        'suta-dark-gray': '#111113',
        'suta-border': '#27272A',
        'suta-cyan': '#00F0FF',
        'suta-emerald': '#10B981',
        'suta-muted': '#A1A1AA',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 0 15px rgba(0, 240, 255, 0.3)',
        'cyan-glow-intense': '0 0 25px rgba(0, 240, 255, 0.5)',
      }
    },
  },
  plugins: [],
}
