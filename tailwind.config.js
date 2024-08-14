/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // enable dark mode via class strategy
  theme: {
    extend: {
      colors: {
        black: "#09090c",
        darkGray: "#121212",
        customYellow: "#e6d064",
        customYellowDark: "#d4b254",

        ff_background_light: "#f0f2f5",
        ff_background_dark: "#1F2933",

        ff_bg_continer_light: "#ffffff",
        ff_bg_continer_dark: "#3E4C59",

        ff_bg_sidebar_light: "#ffffff",
        ff_bg_sidebar_dark: "#3E4C59",

        ff_text_light: "#FFF",
        ff_text_dark: "#000",

        ff_darkInputHover: "rgba(66, 153, 225, 0.5)",
        ff_icon_square_bg_dark: "#738da5",
        ff_icon_square_bg_light: "#e6e6e6",

        boxShadow: {
          "dark-sm": "0 1px 2px 0 rgba(255, 255, 255, 0.05)",
          dark: "0 4px 6px 0 rgba(255, 255, 255, 0.1)",
          "dark-md": "0 6px 12px 0 rgba(255, 255, 255, 0.1)",
          "dark-lg": "0 10px 15px 0 rgba(255, 255, 255, 0.1)",
        },

        brightRed: "hsl(12, 88%, 59%)",
        brightRedLight: "hsl(12, 88%, 69%)",
        brightRedSupLight: "hsl(12, 88%, 95%)",

        darkBlue: "#000",
        darkGrayishBlue: "hsl(227, 12%, 61%)",
        veryDarkBlue: "hsl(233, 12%, 13%)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    // Add other plugins here as needed
  ],
};
