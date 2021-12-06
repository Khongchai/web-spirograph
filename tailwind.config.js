const colors = {
  purple: {
    dark: "rgba(43, 30, 57, 22)",
    light: "rgba(231, 210, 253, 99)",
    vivid: "rgba(191, 134, 252, 99)",
    grey: "rgba(114, 104, 125, 49)",
    dull: "rgba(153, 107, 201, 79)",
  },
  white: "#fff",
  black: "#000",
};

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors,
    "w-fit": "fit-content",
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
    },
  },
  plugins: [],
};
