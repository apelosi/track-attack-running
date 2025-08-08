/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#D7322A",
        primaryDark: "#A91B20",
        accent: "#CC422E",
        accentLight: "#EE565B"
      }
    }
  },
  plugins: []
};
