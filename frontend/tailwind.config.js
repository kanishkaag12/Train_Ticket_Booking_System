/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f7f8fb",
          100: "#eceff6",
          200: "#d5dceb",
          300: "#b1bfdc",
          400: "#879cc9",
          500: "#6078b2",
          600: "#4d6297",
          700: "#41507a",
          800: "#384365",
          900: "#20283d",
          950: "#0d1321"
        },
        accent: {
          300: "#f6bf78",
          400: "#f39c47",
          500: "#ec7f1a"
        },
        success: "#1bbf83",
        warning: "#f2b035",
        danger: "#eb5757"
      },
      boxShadow: {
        glow: "0 18px 60px rgba(12, 19, 33, 0.45)"
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top left, rgba(243,156,71,0.16), transparent 30%), radial-gradient(circle at top right, rgba(96,120,178,0.18), transparent 28%), linear-gradient(135deg, #0d1321, #111b32 55%, #18254b)"
      }
    }
  },
  plugins: []
};
