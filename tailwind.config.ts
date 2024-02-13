/** @type {import('tailwindcss').Config} */
// import colors from "tailwindcss/colors";

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  daisyui: {
    themes: ["night", "winter", "nord", "coffee"],
  },

  theme: {
    extend: {
      fontFamily: {
        nanum: ["Nanum Myeongjo", "serif"],
        mont: ["Montserrat", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
};
