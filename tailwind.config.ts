/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";


module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
    ],
  },
  theme: {
    extend: {
      // colors: {
      //   // 'navy-dark': '#19203A',
      //   "base-400": "#D6E2F0",
      //   "base-500": "#AEC7E4",
      //   "base-700": "#1D4574",
      //   "base-super-sat-text": "#004CA3",
      //   goldText: "#C3B084",
      // },
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
