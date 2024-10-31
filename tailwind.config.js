const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        grayblue: '#0D1017',
        hoversidebar: '#31343a',
        loginbg: '#EFF8FE',
        primary: '#3B81F4',
        timer: '#F1F2F4',
        dash: '#F0F1F2'
      }, 
      fontFamily: {
        sans: [
          '"Inter var", sans-serif',
        ],
      }
    },
  },
  plugins: [],
});