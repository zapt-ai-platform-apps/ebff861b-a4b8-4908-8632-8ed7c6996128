export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    './src/**/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-color': 'var(--bg-color)',
        'text-color': 'var(--text-color)',
        'button-bg-color': 'var(--button-bg-color)',
        'button-text-color': 'var(--button-text-color)',
      },
    },
  },
  plugins: [],
};