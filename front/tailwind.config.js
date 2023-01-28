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
    screens: {
      sm: "640px",

      md: "768px",

      lg: "1024px",

      xl: "1280px",

      "2xl": "1536px",
    },
  },
  plugins: [],
};
