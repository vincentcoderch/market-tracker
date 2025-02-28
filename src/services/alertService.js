/**
 * Service de gestion des alertes de prix
 */

// Clé pour le stockage des alertes dans localStorage
const ALERTS_STORAGE_KEY = 'marketAlerts';

/**
 * Récupère les alertes depuis le localStorage
 * @returns {Array} Liste des alertes
 */
export const getAlerts = () => {
  try {
    const storedAlerts = localStorage.getItem(ALERTS_STORAGE_KEY);
    return storedAlerts ? JSON.parse(storedAlerts) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des alertes:', error);
    return [];
  }
};

/**
 * Enregistre les alertes dans le localStorage
 * @param {Array} alerts - Liste des alertes à sauvegarder
 */
export const saveAlerts = (alerts) => {
  try {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des alertes:', error);
  }
};

/**
 * Ajoute une nouvelle alerte
 * @param {Object} alert - Alerte à ajouter
 * @returns {Array} Liste mise à jour des alertes
 */
export const addAlert = (alert) => {
  const alerts = getAlerts();
  const newAlert = {
    ...alert,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    triggered: false
  };
  
  const updatedAlerts = [...alerts, newAlert];
  saveAlerts(updatedAlerts);
  return updatedAlerts;
};

/**
 * Supprime une alerte
 * @param {number} alertId - ID de l'alerte à supprimer
 * @returns {Array} Liste mise à jour des alertes
 */
export const deleteAlert = (alertId) => {
  const alerts = getAlerts();
  const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
  saveAlerts(updatedAlerts);
  return updatedAlerts;
};

/**
 * Vérifie si des alertes doivent être déclenchées en fonction des prix actuels
 * @param {Object} marketData - Données actuelles du marché
 * @param {Object} symbols - Mapping entre noms et symboles
 * @returns {Array} Liste des alertes déclenchées
 */
export const checkAlerts = (marketData, symbols) => {
  const alerts = getAlerts();
  const triggeredAlerts = [];
  
  alerts.forEach(alert => {
    if (alert.triggered) return; // Ignore les alertes déjà déclenchées
    
    // Trouve les données de marché correspondantes
    let currentPrice = null;
    for (const [name, data] of Object.entries(marketData)) {
      if (name === alert.name) {
        currentPrice = data.c; // Prix actuel
        break;
      }
    }
    
    // Vérifie si l'alerte doit être déclenchée
    if (currentPrice !== null) {
      if (
        (alert.type === 'above' && currentPrice >= alert.price) || 
        (alert.type === 'below' && currentPrice <= alert.price)
      ) {
        alert.triggered = true;
        alert.triggeredAt = new Date().toISOString();
        triggeredAlerts.push(alert);
      }
    }
  });
  
  // Si des alertes ont été déclenchées, sauvegarde la mise à jour
  if (triggeredAlerts.length > 0) {
    saveAlerts(alerts);
  }
  
  return triggeredAlerts;
};

/**
 * Réinitialise une alerte déclenchée pour qu'elle puisse être à nouveau active
 * @param {number} alertId - ID de l'alerte à réinitialiser
 * @returns {Array} Liste mise à jour des alertes
 */
export const resetAlert = (alertId) => {
  const alerts = getAlerts();
  const updatedAlerts = alerts.map(alert => {
    if (alert.id === alertId) {
      return { ...alert, triggered: false, triggeredAt: null };
    }
    return alert;
  });
  
  saveAlerts(updatedAlerts);
  return updatedAlerts;
};

/**
 * Service pour envoyer une notification au navigateur
 * @param {Object} alert - L'alerte déclenchée
 * @param {number} currentPrice - Le prix actuel
 */
export const sendNotification = (alert, currentPrice) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const title = `Alerte de prix : ${alert.name}`;
    const options = {
      body: `Prix ${alert.type === 'above' ? 'au-dessus de' : 'en dessous de'} ${alert.price} (actuel: ${currentPrice})`,
      icon: '/favicon.ico'
    };
    
    new Notification(title, options);
  } 
  else if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        sendNotification(alert, currentPrice);
      }
    });
  }
  
  // Joue un son d'alerte
  const audio = new Audio('/alert-sound.mp3');
  audio.play().catch(e => console.log('Lecture audio non autorisée', e));
};

export default {
  getAlerts,
  saveAlerts,
  addAlert,
  deleteAlert,
  checkAlerts,
  resetAlert,
  sendNotification
};
