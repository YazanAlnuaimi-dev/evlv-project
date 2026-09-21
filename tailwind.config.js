/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // EVLV Brand Guidelines (Color Palette + Palette Color Tones).
      // The UI leans on Tailwind's "zinc" scale for neutrals, so remapping that
      // scale to the brand's charcoal tints applies the real palette everywhere.
      colors: {
        cream: {
          DEFAULT: '#F2EEE3', // Cream White
          off: '#F9F7F1', // Off White (Cream White @ 50% opacity)
        },
        zinc: {
          50: '#F4F4F4', // Charcoal @ 5%
          100: '#E8E8E8', // Charcoal @ 10%
          200: '#D1D1D1', // Charcoal @ 20%
          300: '#A3A3A3', // Charcoal @ 40%
          400: '#8F8F8F',
          500: '#767676', // Charcoal @ 60%
          600: '#5E5E5E',
          700: '#484848', // Charcoal @ 80%
          800: '#2E2E2E',
          900: '#1A1A1A', // Charcoal (main text / dark bg)
          950: '#121212',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // primary brand typeface
        secondary: ['Inter', 'sans-serif'], // complementary typeface
      },
    },
  },
  plugins: [],
};
