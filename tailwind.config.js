const colors = {
  purple: {
    dark: "#2b1e39",
    light: "rgba(232,121,249,1)",
  },
  white: "#fff",
  black: "#000",
};

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors,
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
