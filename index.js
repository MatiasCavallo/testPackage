const quotes = [
  "Mati Funciona!",
  "Funciona!",
  "Funciona! Mati!",
  "Algo nuevo aprendido",
  "Todo por Mati L! 💪",
];

/**
 * Gets a random Piñera Quote
 * @returns {string}
 */
function randomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

module.exports = {
  randomQuote
};