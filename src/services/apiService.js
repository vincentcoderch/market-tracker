/**
 * Service pour interagir avec l'API Finnhub de manière sécurisée
 * La clé API est chargée depuis les variables d'environnement
 * et n'est jamais exposée dans le code source
 */

import { 
  sanitizeStockSymbol, 
  isValidResolution, 
  isValidTimestamp,
  isRequestAllowed
} from '../utils/security';

// Récupération de la clé API depuis les variables d'environnement
const API_KEY = process.env.REACT_APP_FINNHUB_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

// Message d'erreur standard pour les erreurs de validation
const VALIDATION_ERROR = 'Erreur de validation des paramètres';

/**
 * Service pour accéder aux données boursières via Finnhub
 */
const apiService = {
  /**
   * Récupère les données d'un indice boursier
   * @param {string} symbol - Le symbole de l'indice (ex: ^GSPC pour S&P 500)
   */
  getStockQuote: async (symbol) => {
    try {
      // Valide et nettoie le symbole
      const cleanSymbol = sanitizeStockSymbol(symbol);
      if (!cleanSymbol) {
        throw new Error(VALIDATION_ERROR);
      }
      
      // Vérifie le rate limiting
      if (!isRequestAllowed('quotes')) {
        throw new Error('Trop de requêtes, veuillez réessayer plus tard');
      }
      
      // Utilise encodeURIComponent pour éviter les injections dans l'URL
      const encodedSymbol = encodeURIComponent(cleanSymbol);
      
      const response = await fetch(`${BASE_URL}/quote?symbol=${encodedSymbol}&token=${API_KEY}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      throw error;
    }
  },

  /**
   * Récupère les données historiques d'un indice
   * @param {string} symbol - Le symbole de l'indice
   * @param {string} resolution - Résolution (1, 5, 15, 30, 60, D, W, M)
   * @param {number} from - Timestamp UNIX de début
   * @param {number} to - Timestamp UNIX de fin
   */
  getStockCandles: async (symbol, resolution, from, to) => {
    try {
      // Validation des paramètres
      const cleanSymbol = sanitizeStockSymbol(symbol);
      if (!cleanSymbol || !isValidResolution(resolution) || 
          !isValidTimestamp(from) || !isValidTimestamp(to)) {
        throw new Error(VALIDATION_ERROR);
      }
      
      // Vérifie le rate limiting
      if (!isRequestAllowed('candles')) {
        throw new Error('Trop de requêtes, veuillez réessayer plus tard');
      }
      
      // Utilise encodeURIComponent pour éviter les injections dans l'URL
      const encodedSymbol = encodeURIComponent(cleanSymbol);
      const encodedResolution = encodeURIComponent(resolution);
      
      const response = await fetch(
        `${BASE_URL}/stock/candle?symbol=${encodedSymbol}&resolution=${encodedResolution}&from=${from}&to=${to}&token=${API_KEY}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des données historiques:', error);
      throw error;
    }
  },

  /**
   * Récupère les actualités financières
   * @param {string} category - Catégorie d'actualités (general, forex, crypto, merger)
   */
  getMarketNews: async (category = 'general') => {
    try {
      // Validation de la catégorie
      const validCategories = ['general', 'forex', 'crypto', 'merger'];
      const cleanCategory = category.trim().toLowerCase();
      
      if (!validCategories.includes(cleanCategory)) {
        throw new Error(VALIDATION_ERROR);
      }
      
      const encodedCategory = encodeURIComponent(cleanCategory);
      
      const response = await fetch(
        `${BASE_URL}/news?category=${encodedCategory}&token=${API_KEY}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des actualités:', error);
      throw error;
    }
  },

  /**
   * Récupère les symboles des principales composantes d'un indice
   * @param {string} index - Le symbole de l'indice
   */
  getIndexComponents: async (index) => {
    try {
      // Validation du symbole de l'indice
      const cleanIndex = sanitizeStockSymbol(index);
      if (!cleanIndex) {
        throw new Error(VALIDATION_ERROR);
      }
      
      const encodedIndex = encodeURIComponent(cleanIndex);
      
      const response = await fetch(
        `${BASE_URL}/index/constituents?symbol=${encodedIndex}&token=${API_KEY}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des composantes:', error);
      throw error;
    }
  }
};

// Symboles des principaux indices mondiaux pour Finnhub
export const MARKET_INDICES = {
  'CAC 40': '^FCHI',
  'S&P 500': '^GSPC',
  'NASDAQ': '^IXIC',
  'FTSE 100': '^FTSE',
  'DAX': '^GDAXI',
  'Nikkei 225': '^N225'
};

// Symboles des principales cryptomonnaies pour Finnhub
export const CRYPTO_SYMBOLS = {
  'Bitcoin': 'BINANCE:BTCUSDT',
  'Ethereum': 'BINANCE:ETHUSDT',
  'Binance Coin': 'BINANCE:BNBUSDT',
  'Solana': 'BINANCE:SOLUSDT',
  'Cardano': 'BINANCE:ADAUSDT',
  'XRP': 'BINANCE:XRPUSDT'
};

export default apiService;
