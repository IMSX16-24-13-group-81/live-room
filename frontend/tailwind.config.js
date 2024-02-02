/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      screens: {
        tablet: '640px',
        laptop: '1024px',
        desktop: '1400px',
        bigScreen: '2000px',
      },
      colors: {
        background: "#FFFFFF",
        dark: "#003F54",
      },
      fontSize: {
        smallContent: "0.85rem",
        content: "0.9rem",
        smallHeader: "1.2rem",
        mediumHeader: "1.8rem",
        header: "2.5rem"
      }
    },
  },
  plugins: [],
}

