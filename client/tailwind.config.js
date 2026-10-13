/** @type {import('tailwindcss').Config} */
const percent = Object.fromEntries(Array.from({ length: 101 }, (_, i) => [`pct-${i}`, `${i}%`]));

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  safelist: [{ pattern: /^w-pct-/ }],
  theme: {
    extend: {
      width: percent,
      colors: {
        canvas: "#f4f7f5",
        surface: "#ffffff",
        line: "#e1e8e3",
        ink: { DEFAULT: "#13201a", soft: "#34443b", muted: "#66756c" },
        brand: { 50: "#ebf6f0", 100: "#d3ecdf", 200: "#a9d8bf", 400: "#4fb487", 500: "#2f9a6b", 600: "#22805a", 700: "#1b6648", 800: "#164f39", 900: "#0f3727" },
        success: { 50: "#ecfdf3", 600: "#16794a" },
        danger: { 50: "#fef2f2", 600: "#c2412d", 700: "#a3361f" },
        warn: { 50: "#fff8eb", 600: "#a15c07" },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      keyframes: {
        shimmer: { "100%": { transform: "translateX(100%)" } },
        menu: { from: { opacity: "0", transform: "translateY(-4px) scale(0.97)" } },
      },
      animation: {
        shimmer: "shimmer 1.4s infinite",
        menu: "menu 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
