const flowbite = require("flowbite-react");
const tailwind = require("tailwindcss");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    extend: {
      keyframes: {
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        rotate: 'rotate 2s linear infinite',
      },
    },
    colors: {
      'refaa-red': '#5f0b0c',
      'refaa-blue': '#1d2856',
      'primary' : '#11b2ac',
      'secondary' : '#345c63',
      'black': '#192c2c',
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require('tailwind-scrollbar'),
]
}