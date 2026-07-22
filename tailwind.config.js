/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./script.js"
  ],
  theme: {
    extend: {
      // O HTML usa "xs:inline" (barra de acessibilidade), mas o Tailwind
      // não tem esse breakpoint por padrão - sem isso, a regra era ignorada.
      screens: {
        xs: '480px',
      },
      // O HTML usa a classe "font-serif-premium" em vários títulos, mas ela
      // nunca foi definida - por isso, esses textos sempre caíram na fonte
      // padrão (sans-serif), mesmo com a intenção de usar uma serifada.
      // Troque "Playfair Display" pela fonte que você realmente quer usar.
      fontFamily: {
        'serif-premium': ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
