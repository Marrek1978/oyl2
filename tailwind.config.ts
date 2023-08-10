/** @type {import('tailwindcss').Config} */
// import colors from "tailwindcss/colors";


module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  daisyui: {
    themes: [
      "night",
      "winter",
    ],
  },
  theme: {
    extend: {
      colors: {
        // 'navy-dark': '#19203A',
        "base-400": "#D6E2F0",
        // "base-content": "#AEC7E4",
        "base-700": "#1D4574",
        "base-super-sat-text": "#004CA3",
      },
      fontFamily: {
        nanum: ["Nanum Myeongjo", "serif"],
        mont: ["Montserrat", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  // darkMode: "class",
  plugins: [require("daisyui")],
};
