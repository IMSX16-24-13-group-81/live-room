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
        primary: "#00C3D0",
        dark: "#003F54",
      },
      fontSize: {
        smallContent: "0.8rem",
        content: "0.95rem",
        smallHeader: "1.2rem",
        mediumHeader: "1.8rem",
        header: "2.5rem"
      }
    },
  },
  plugins: [],
}

