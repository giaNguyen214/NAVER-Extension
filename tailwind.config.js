/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      mixBlendMode: {
        difference: "difference",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Extension bắt buộc phải tắt cái này
  },
};
