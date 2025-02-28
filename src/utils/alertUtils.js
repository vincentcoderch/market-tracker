/**
 * Utilitaires pour gérer les alertes de prix
 */

/**
 * Vérifie si un prix atteint un seuil d'alerte
 * 
 * @param {Object} alert - L'alerte à vérifier
 * @param {number} currentPrice - Le prix actuel
 * @returns {boolean} True si l'alerte doit être déclenchée
 */
export const shouldTriggerAlert = (alert, currentPrice) => {
  if (!alert || typeof currentPrice !== 'number') return false;
  
  if (alert.type === 'above' && currentPrice >= alert.price) {
    return true;
  }
  
  if (alert.type === 'below' && currentPrice <= alert.price) {
    return true;
  }
  
  return false;
};

/**
 * Charge les alertes depuis le localStorage
 * 
 * @returns {Array} Liste des alertes
 */
export const loadAlerts = () => {
  try {
    const savedAlerts = localStorage.getItem('marketAlerts');
    return savedAlerts ? JSON.parse(savedAlerts) : [];
  } catch (error) {
    console.error('Erreur lors du chargement des alertes:', error);
    return [];
  }
};

/**
 * Sauvegarde les alertes dans le localStorage
 * 
 * @param {Array} alerts - Liste des alertes à sauvegarder
 */
export const saveAlerts = (alerts) => {
  try {
    localStorage.setItem('marketAlerts', JSON.stringify(alerts));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des alertes:', error);
  }
};

/**
 * Filtre les alertes pour un actif spécifique
 * 
 * @param {Array} alerts - Liste des alertes
 * @param {string} symbol - Symbole de l'actif à filtrer
 * @returns {Array} Liste des alertes filtrées
 */
export const filterAlertsBySymbol = (alerts, symbol) => {
  return alerts.filter(alert => alert.symbol === symbol);
};
