/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#07211d",
        brand: {
          50: "#eefbf6",
          100: "#d5f5ea",
          200: "#aeead7",
          300: "#79d9bd",
          400: "#43c09e",
          500: "#1fa685",
          600: "#11866c",
          700: "#0e6b58",
          800: "#0f5548",
          900: "#0d463c",
          950: "#042823",
        },
        gold: {
          300: "#fbd38a",
          400: "#f5b544",
          500: "#e79a17",
          600: "#c97a0b",
        },
        sand: "#f7f5f0",
      },
      boxShadow: {
        soft: "0 18px 50px -24px rgba(7,33,29,.35)",
        lift: "0 30px 70px -30px rgba(7,33,29,.45)",
        glow: "0 0 0 6px rgba(31,166,133,.12)",
      },
      maxWidth: {
        content: "76rem",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        floatySlow: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-26px)" },
        },
        bob: {
          "0%,100%": { transform: "translate(-50%,0)", opacity: ".6" },
          "50%": { transform: "translate(-50%,10px)", opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        kenburns: {
          "0%": { transform: "scale(1.06)" },
          "100%": { transform: "scale(1.16)" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        floatySlow: "floatySlow 11s ease-in-out infinite",
        bob: "bob 2.2s ease-in-out infinite",
        marquee: "marquee 34s linear infinite",
        kenburns: "kenburns 26s ease-out alternate infinite",
      },
    },
  },
  plugins: [],
};
