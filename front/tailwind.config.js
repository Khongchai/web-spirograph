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
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false,
  theme: {
    colors,
    "w-fit": "fit-content",
    extend: {},
  },
  plugins: [],
};
