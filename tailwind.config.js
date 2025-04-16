/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./*.html",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors with CSS variable references
        ...Object.fromEntries([
          'primary', 'secondary', 'neutral', 'success', 'dangers'
        ].flatMap(group =>
          Array.from({ length: 9 }, (_, i) => [`${group}-${(i + 1).toString().padStart(2, '0')}`, `var(--color-${group}-${(i + 1).toString().padStart(2, '0')})`])
        ).filter(([k, _]) => !k.includes('success-07') && !k.includes('dangers-07'))), // trim ke 6 warna untuk success/dangers
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
      },
      fontFamily: {
        sfProDisplay: ['SF Pro Display', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
      },
      rotate: {
        180: '180deg',
      },
    },
  },
  plugins: [],
};
