/**
 * Service pour interagir avec l'API Finnhub de manière sécurisée
 * La clé API est chargée depuis les variables d'environnement
 * et n'est jamais exposée dans le code source
 */

// Récupération de la clé API depuis les variables d'environnement
const API_KEY = process.env.REACT_APP_FINNHUB_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

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
      const response = await fetch(`${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`);
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
      const response = await fetch(
        `${BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${API_KEY}`
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
      const response = await fetch(
        `${BASE_URL}/news?category=${category}&token=${API_KEY}`
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
      const response = await fetch(
        `${BASE_URL}/index/constituents?symbol=${index}&token=${API_KEY}`
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
