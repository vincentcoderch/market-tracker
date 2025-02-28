/**
 * Données de démonstration pour l'application MarketTracker
 * Ces données sont utilisées quand aucune clé API Finnhub n'est disponible
 */

// Données de démonstration pour les indices boursiers
export const demoIndicesData = {
  'CAC 40': { c: 8120.75, d: 32.45, dp: 0.42, h: 8145.12, l: 8088.54, o: 8095.20, pc: 8088.30 },
  'S&P 500': { c: 5225.18, d: 12.65, dp: 0.24, h: 5230.15, l: 5210.25, o: 5215.33, pc: 5212.53 },
  'NASDAQ': { c: 16350.45, d: -42.12, dp: -0.26, h: 16450.30, l: 16320.10, o: 16415.60, pc: 16392.57 },
  'FTSE 100': { c: 7935.11, d: 15.32, dp: 0.19, h: 7940.75, l: 7920.44, o: 7925.20, pc: 7919.79 },
  'DAX': { c: 17680.28, d: 54.80, dp: 0.31, h: 17698.52, l: 17625.48, o: 17630.25, pc: 17625.48 },
  'Nikkei 225': { c: 38914.25, d: -102.35, dp: -0.26, h: 39118.45, l: 38850.32, o: 39025.76, pc: 39016.60 }
};

// Données de démonstration pour les cryptomonnaies
export const demoCryptoData = {
  'Bitcoin': { c: 62135.45, d: 952.30, dp: 1.56, h: 62500.00, l: 61050.25, o: 61183.15, pc: 61183.15 },
  'Ethereum': { c: 3450.72, d: 45.18, dp: 1.32, h: 3470.50, l: 3410.25, o: 3415.20, pc: 3405.54 },
  'Binance Coin': { c: 570.45, d: -5.80, dp: -1.01, h: 580.15, l: 565.20, o: 576.25, pc: 576.25 },
  'Solana': { c: 142.85, d: 3.25, dp: 2.32, h: 145.00, l: 139.50, o: 140.10, pc: 139.60 },
  'Cardano': { c: 0.62, d: 0.015, dp: 2.48, h: 0.63, l: 0.61, o: 0.61, pc: 0.605 },
  'XRP': { c: 0.56, d: -0.02, dp: -3.45, h: 0.58, l: 0.55, o: 0.58, pc: 0.58 }
};

// Génère des données historiques fictives pour la démo
export const generateDemoHistoricalData = (baseValue, isPositive = true, points = 30) => {
  const data = [];
  let currentValue = baseValue;
  const volatility = isPositive ? 0.005 : 0.006;
  const trend = isPositive ? 0.001 : -0.001;
  const now = new Date();
  
  for (let i = points; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Ajoute une variation aléatoire + tendance générale
    const randomFactor = (Math.random() - 0.5) * volatility;
    const trendFactor = trend * (points - i) / points;
    currentValue = currentValue * (1 + randomFactor + trendFactor);
    
    data.push({
      time: date,
      value: currentValue
    });
  }
  
  return data;
};

// Utilise ces données pour simuler un appel API
export const getStockQuoteDemo = (symbol, isIndices = true) => {
  if (isIndices) {
    const indexName = Object.entries(MARKET_INDICES).find(([_, s]) => s === symbol)?.[0];
    if (indexName && demoIndicesData[indexName]) {
      return Promise.resolve(demoIndicesData[indexName]);
    }
  } else {
    const cryptoName = Object.entries(CRYPTO_SYMBOLS).find(([_, s]) => s === symbol)?.[0];
    if (cryptoName && demoCryptoData[cryptoName]) {
      return Promise.resolve(demoCryptoData[cryptoName]);
    }
  }
  
  // Données par défaut si non trouvées
  return Promise.resolve({
    c: 100 + Math.random() * 100,
    d: (Math.random() - 0.3) * 10,
    dp: (Math.random() - 0.3) * 5,
    h: 100 + Math.random() * 120,
    l: 100 + Math.random() * 80,
    o: 100 + Math.random() * 100,
    pc: 100 + Math.random() * 100
  });
};

// Référence des symboles pour la démo
export const MARKET_INDICES = {
  'CAC 40': '^FCHI',
  'S&P 500': '^GSPC',
  'NASDAQ': '^IXIC',
  'FTSE 100': '^FTSE',
  'DAX': '^GDAXI',
  'Nikkei 225': '^N225'
};

export const CRYPTO_SYMBOLS = {
  'Bitcoin': 'BINANCE:BTCUSDT',
  'Ethereum': 'BINANCE:ETHUSDT',
  'Binance Coin': 'BINANCE:BNBUSDT',
  'Solana': 'BINANCE:SOLUSDT',
  'Cardano': 'BINANCE:ADAUSDT',
  'XRP': 'BINANCE:XRPUSDT'
};
