/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#082032",
        mist: "#E8F6F3",
        coral: "#F26B5B",
        gold: "#F4B860",
        tide: "#0F4C75",
        mint: "#5BD1B4",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Manrope'", "sans-serif"],
      },
      boxShadow: {
        panel: "0 18px 60px rgba(8, 32, 50, 0.12)",
      },
      backgroundImage: {
        ambient:
          "radial-gradient(circle at top left, rgba(91, 209, 180, 0.22), transparent 34%), radial-gradient(circle at top right, rgba(244, 184, 96, 0.16), transparent 28%), linear-gradient(180deg, #f7fbff 0%, #eef8f5 100%)",
      },
    },
  },
  plugins: [],
};
