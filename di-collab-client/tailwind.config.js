/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        logoBackdrop: "#122634",
        primary: "#0f1f2b",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            blockquote: {
              fontStyle: "italic",
              borderLeftWidth: "4px",
              borderLeftColor: theme("colors.gray.300"),
              backgroundColor: theme("colors.gray.100"),
              padding: theme("spacing.4"),
              margin: theme("spacing.2"),
              // Add other styles as needed
            },
            a: {
              color: theme("colors.blue.600"),
              "&:hover": {
                color: theme("colors.blue.700"),
              },
            },
          },
        },
      }),
    },
    screens: {
      mobile: "320px",
      tablet: "640px",
      laptop: "768px",
      desktop: "1024px",
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".custom-scrollbar": {
          // WebKit-based scrollbar styling
          "&::-webkit-scrollbar": {
            width: "12px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#0f1f2b",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#122634",
            borderRadius: "6px",
            border: "3px solid #334155",
          },
        },
      });
    },
    require("@tailwindcss/typography"),
  ],
};
