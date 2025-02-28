/**
 * Utilitaires pour le formatage des données dans l'application
 */

/**
 * Formate un nombre pour l'affichage avec séparateurs de milliers et décimales
 * @param {number} number - Le nombre à formater
 * @param {boolean} isCrypto - Indique s'il s'agit d'une cryptomonnaie (pour les petites valeurs)
 * @param {number} decimals - Nombre de décimales à afficher
 * @param {string} locale - La locale à utiliser pour le formatage
 * @returns {string} Le nombre formaté
 */
export const formatNumber = (number, isCrypto = false, decimals = 2, locale = 'fr-FR') => {
  // Gestion des valeurs nulles ou undefined
  if (number === null || number === undefined) {
    return '0,00';
  }
  
  // Pour les petites valeurs de crypto (< 1)
  if (isCrypto && number > 0 && number < 1) {
    return number.toFixed(Math.max(decimals, 3));
  }
  
  // Pour les grandes valeurs (millions, milliards)
  if (number >= 1000000000) {
    return (number / 1000000000).toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' Mrd';
  } else if (number >= 1000000) {
    return (number / 1000000).toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' M';
  }
  
  // Formatage standard
  return number.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Formate une date
 * @param {number|string|Date} timestamp - Timestamp UNIX, string ISO ou objet Date
 * @param {string} format - Format souhaité ('time', 'date', 'datetime', 'relative')
 * @returns {string} La date formatée
 */
export const formatDate = (timestamp, format = 'datetime') => {
  if (!timestamp) return '';
  
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  
  // Format time only (HH:MM)
  if (format === 'time') {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  
  // Format date only (DD/MM/YYYY)
  if (format === 'date') {
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }
  
  // Format full datetime
  if (format === 'datetime') {
    return date.toLocaleString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  
  // Format relative time (il y a X minutes/heures...)
  if (format === 'relative') {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // différence en secondes
    
    if (diff < 60) return `Il y a ${diff} secondes`;
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} minutes`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} heures`;
    if (diff < 2592000) return `Il y a ${Math.floor(diff / 86400)} jours`;
    
    return date.toLocaleDateString('fr-FR');
  }
  
  return date.toLocaleString('fr-FR');
};

/**
 * Calcule le pourcentage de variation entre deux valeurs
 * @param {number} currentValue - Valeur actuelle
 * @param {number} previousValue - Valeur précédente
 * @returns {number} Le pourcentage de variation
 */
export const calculatePercentChange = (currentValue, previousValue) => {
  if (!previousValue || previousValue === 0) return 0;
  return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
};

/**
 * Transforme les données de bougies (candles) en format pour les graphiques
 * @param {Object} candleData - Données de bougies de Finnhub
 * @returns {Array} Données formatées pour les graphiques
 */
export const transformCandleData = (candleData) => {
  if (!candleData || !candleData.c || candleData.s !== 'ok') {
    return [];
  }
  
  return candleData.t.map((timestamp, index) => {
    return {
      time: new Date(timestamp * 1000),
      open: candleData.o[index],
      high: candleData.h[index],
      low: candleData.l[index],
      close: candleData.c[index],
      value: candleData.c[index], // pour la compatibilité avec LineChart
      volume: candleData.v ? candleData.v[index] : 0
    };
  });
};

/**
 * Génère des données historiques simulées pour les démos et tests
 * @param {number} baseValue - Valeur de départ
 * @param {number} volatility - Volatilité (0.01 = 1%)
 * @param {number} dataPoints - Nombre de points de données
 * @param {number} trend - Tendance générale en % (0.1 = +10%)
 * @returns {Array} Données générées
 */
export const generateHistoricalData = (baseValue, volatility, dataPoints, trend = 0) => {
  const data = [];
  let currentValue = baseValue;
  const now = new Date();
  
  for (let i = dataPoints; i >= 0; i--) {
    const date = new Date(now);
    
    // Ajuster la date en fonction du nombre de points
    if (dataPoints <= 30) { // 1M - jours
      date.setDate(date.getDate() - i);
    } else if (dataPoints <= 180) { // 6M - jours
      date.setDate(date.getDate() - i);
    } else if (dataPoints <= 365) { // 1A - jours
      date.setDate(date.getDate() - i);
    } else { // All - semaines
      date.setDate(date.getDate() - (i * 7));
    }
    
    // Générer une valeur avec tendance et volatilité
    const randomFactor = (Math.random() - 0.5) * volatility;
    const trendFactor = (trend / dataPoints) * i;
    currentValue = currentValue * (1 + randomFactor + trendFactor);
    
    data.push({
      time: date,
      value: currentValue
    });
  }
  
  return data;
};
