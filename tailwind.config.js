/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/templates/*.{html,js}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        danube: {
          50: "#f3f7fb",
          100: "#e3eef6",
          200: "#cee2ef",
          300: "#accee4",
          400: "#85b4d5",
          500: "#75a3ce",
          600: "#5483bc",
          700: "#4a70ab",
          800: "#415c8c",
          900: "#384e70",
          950: "#263145",
        },
        opium: {
          50: "#f8f7f8",
          100: "#f3f0f1",
          200: "#e9e1e3",
          300: "#d8c9cb",
          400: "#bfa7aa",
          500: "#a98b8e",
          600: "#917172",
          700: "#866565",
          800: "#664e4e",
          900: "#574444",
          950: "#322525",
        },
        rangoon_green: {
          50: "#f6f4ef",
          100: "#eae7dd",
          200: "#d8d2be",
          300: "#bfb797",
          400: "#a79d74",
          500: "#8b8357",
          600: "#6d6643",
          700: "#555036",
          800: "#45432f",
          900: "#3c3a2b",
          950: "#232216",
        },
      },
    },
  },
  plugins: [],
};
