module.exports = {
  purge: {
    enabled: true,
    content: ["./src/**/*.html", "./src/**/*.hbs"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
