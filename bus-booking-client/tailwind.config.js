/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0D8A4F',
        secondary: '#8FD3B5',
        tertiary: '#f2802f',
      },
      fontFamily: {
        'body': [
        'Inter', 
        'ui-sans-serif', 
        'system-ui', 
        '-apple-system', 
        'system-ui', 
        'Segoe UI', 
        'Roboto', 
        'Helvetica Neue', 
        'Arial', 
        'Noto Sans', 
        'sans-serif', 
        'Apple Color Emoji', 
        'Segoe UI Emoji', 
        'Segoe UI Symbol', 
        'Noto Color Emoji'
      ],
          'sans': [
        'Inter', 
        'ui-sans-serif', 
        'system-ui', 
        '-apple-system', 
        'system-ui', 
        'Segoe UI', 
        'Roboto', 
        'Helvetica Neue', 
        'Arial', 
        'Noto Sans', 
        'sans-serif', 
        'Apple Color Emoji', 
        'Segoe UI Emoji', 
        'Segoe UI Symbol', 
        'Noto Color Emoji'
      ]
    }
    },
    backgroundImage: {
      'gradient-blue': 'radial-gradient(100% 100% at 50% 50%, rgba(30,167,253,0) 0%, #1ea7fd 100%)',
      'gradient-purple': 'radial-gradient(100% 100% at 50% 50%, rgba(111,44,172,0) 0%, #6f2cac 100%)',
    },
    transform: {

    },
    animation: {
      '3d-scale': 'scale3d 3s ease-in-out infinite',
      expandCircle: "circleExpand 0.3s ease-in-out forwards",
    },
    keyframes: {
      scale3d: {
        '0%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(0.8)' },
        '100%': { transform: 'scale(1)' },
      },
    },
    clipPath: {
      triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      circleExpand: {
        "0%": { transform: "translate(-150%, -50%) scale(1)", borderRadius: "50%" },
        "100%": { transform: "translate(100%, -50%) scale(1.5)", borderRadius: "0%" },
      },
    },
  },
  plugins: [
    require('tailwind-clip-path'),
  ],
}


