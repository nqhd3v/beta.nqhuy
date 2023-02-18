/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      maxWidth: {
        cmd: '600px'
      },
      colors: {
        'dark-800': '#00111C',
        'dark-700': '#001523',
        'dark-600': '#001A2C',
        'dark-500': '#002137',
        'dark-400': '#00253E',
        'dark-300': '#002945',
        'dark-200': '#002E4E',
        'dark-100': '#003356',
        'dark-50': '#003A61',
        dark: '#00406C',
        'light-800': '#2196F3',
        'light-700': '#1565C0',
        'light-600': '#1976D2',
        'light-500': '#1E88E5',
        'light-400': '#42A5F5',
        'light-300': '#42A5F5',
        'light-200': '#64B5F6',
        'light-100': '#90CAF9',
        'light-50': '#BBDEFB',
        light: '#E3F2FD'
      },
      keyframes: {
        flicker: {
          '0%, 60%': {opacity: 1},
          '100%': {opacity: 0}
        }
      },
      animation: {
        flicker: 'flicker 1s ease-out infinite',
      }
    }
  },
  plugins: [],
  darkMode: 'class'
}
