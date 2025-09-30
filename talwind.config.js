// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        // Respecte la nomenclature Tailwind: font-<family> et font-<weight>
        britney: [
          'Britney-Regular',
          'Arial Rounded MT Bold',
          'Arial',
          'sans-serif'
        ],
        'britney-light': ['Britney-Light', 'sans-serif'],
        'britney-bold': ['Britney-Bold', 'sans-serif'],
        'britney-ultra': ['Britney-Ultra', 'sans-serif'],
        'britney-variable': ['Britney-Variable', 'sans-serif'],

        clash: [
          'ClashDisplay-Regular',
          'Arial Rounded MT Bold',
          'Arial',
          'sans-serif'
        ],
        'clash-extralight': ['ClashDisplay-Extralight', 'sans-serif'],
        'clash-light': ['ClashDisplay-Light', 'sans-serif'],
        'clash-medium': ['ClashDisplay-Medium', 'sans-serif'],
        'clash-semibold': ['ClashDisplay-Semibold', 'sans-serif'],
        'clash-bold': ['ClashDisplay-Bold', 'sans-serif'],
        'clash-variable': ['ClashDisplay-Variable', 'sans-serif'],

        // Default sans
        sans: [
          'ClashDisplay-Regular',
          'Britney-Regular',
          'Arial Rounded MT Bold',
          'Arial',
          'sans-serif'
        ],
      },
      colors: {
        primary: {
          DEFAULT: '#228B22', // Vert forêt moyen
          50: '#E8F5E8',
          100: '#C1E3C1',
          200: '#9AD19A',
          300: '#72BE72',
          400: '#4BAC4B',
          500: '#228B22', // Vert forêt moyen (Base)
          600: '#1C7A1C',
          700: '#176817',
          800: '#125612',
          900: '#0D450D',
        },
      },
    },
  },
  // reste de la configuration...
}