/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7F5EE",
        forest: "#263B2E",
        leaf: "#66835F",
        earth: "#B88A63",
        cherimoya: "#A8B88A",
        achachairu: "#E2B64F",
        passionfruit: "#D99A45",
        cupuacu: "#805A46",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
