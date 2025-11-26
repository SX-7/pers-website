/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/templates/*.{html,js}","./app/templates/data/projects/*.{html,js}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        "noto-sans": "Noto Sans",
      },
      backgroundSize: {
        "size-200": "200% 200%",
      },
      backgroundPosition: {
        "pos-0": "0% 0%",
        "pos-25": "25% 25%",
        "pos-50": "50% 50%",
        "pos-75": "75% 75%",
        "pos-100": "100% 100%",
      },
    },
  },
  plugins: [],
};
