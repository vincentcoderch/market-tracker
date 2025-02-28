/**
 * Utilitaires pour la sécurité de l'application
 * Contient des fonctions pour valider et nettoyer les entrées utilisateur
 */

/**
 * Vérifie si un symbole boursier est dans un format valide
 * @param {string} symbol - Le symbole boursier à valider
 * @returns {boolean} True si le symbole est valide, false sinon
 */
export const isValidStockSymbol = (symbol) => {
  if (!symbol || typeof symbol !== 'string') {
    return false;
  }
  
  // Regex pour vérifier les symboles boursiers standards
  // Autorise les lettres, chiffres, points, traits d'union et carets (^) pour les indices
  const stockSymbolRegex = /^[A-Z0-9\.\^-]{1,20}$/i;
  
  // Regex spécifique pour les crypto sur Binance (format BINANCE:BTCUSDT)
  const cryptoSymbolRegex = /^BINANCE:[A-Z]{2,10}USDT$/;
  
  return stockSymbolRegex.test(symbol) || cryptoSymbolRegex.test(symbol);
};

/**
 * Vérifie si une résolution d'intervalle est valide
 * @param {string} resolution - La résolution à valider (1, 5, 15, 30, 60, D, W, M)
 * @returns {boolean} True si la résolution est valide, false sinon
 */
export const isValidResolution = (resolution) => {
  const validResolutions = ['1', '5', '15', '30', '60', 'D', 'W', 'M'];
  return validResolutions.includes(resolution);
};

/**
 * Vérifie si un timestamp UNIX est valide (entre 1970 et maintenant + 1 jour)
 * @param {number} timestamp - Le timestamp à valider
 * @returns {boolean} True si le timestamp est valide, false sinon
 */
export const isValidTimestamp = (timestamp) => {
  const now = Math.floor(Date.now() / 1000);
  return (
    Number.isInteger(timestamp) && 
    timestamp > 0 && 
    timestamp <= now + 86400 // Autorise jusqu'à demain (pour les différences de timezone)
  );
};

/**
 * Nettoie et valide un symbole boursier
 * @param {string} symbol - Le symbole brut
 * @returns {string|null} Le symbole nettoyé ou null si invalide
 */
export const sanitizeStockSymbol = (symbol) => {
  if (!symbol || typeof symbol !== 'string') {
    return null;
  }
  
  // Supprime les espaces et convertit en majuscules
  const cleanSymbol = symbol.trim().toUpperCase();
  
  return isValidStockSymbol(cleanSymbol) ? cleanSymbol : null;
};

/**
 * Limite le nombre de requêtes API par utilisateur
 * Simple implémentation côté client (pour une vraie protection, implémenter côté serveur)
 */
const rateLimits = {
  quotesPerMinute: 60,
  candlesPerMinute: 30,
};

const requestCounts = {
  quotes: { count: 0, resetTime: Date.now() + 60000 },
  candles: { count: 0, resetTime: Date.now() + 60000 },
};

/**
 * Vérifie si une requête est autorisée par le rate limiting
 * @param {string} requestType - Le type de requête ('quotes' ou 'candles')
 * @returns {boolean} True si la requête est autorisée, false sinon
 */
export const isRequestAllowed = (requestType) => {
  const now = Date.now();
  const requestInfo = requestCounts[requestType];
  
  // Réinitialise le compteur si le temps est écoulé
  if (now > requestInfo.resetTime) {
    requestInfo.count = 0;
    requestInfo.resetTime = now + 60000;
  }
  
  // Vérifie si le nombre max de requêtes est atteint
  const maxRequests = rateLimits[`${requestType}PerMinute`];
  if (requestInfo.count >= maxRequests) {
    return false;
  }
  
  // Incrémente le compteur et autorise la requête
  requestInfo.count++;
  return true;
};
