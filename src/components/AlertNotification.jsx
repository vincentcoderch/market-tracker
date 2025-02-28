import React, { useState, useEffect } from 'react';
import { formatNumber } from '../utils/formatters';

/**
 * Composant pour afficher une notification d'alerte déclenchée
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.alert - Les informations de l'alerte
 * @param {number} props.currentPrice - Le prix actuel
 * @param {Function} props.onClose - Fonction appelée pour fermer la notification
 * @param {Function} props.onReset - Fonction appelée pour réinitialiser l'alerte
 * @param {boolean} props.isCrypto - Indique si la notification concerne une crypto
 */
const AlertNotification = ({ alert, currentPrice, onClose, onReset, isCrypto }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Ferme automatiquement la notification après 10 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Gère la fermeture de la notification avec animation
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Attend la fin de l'animation
  };
  
  // Réinitialise l'alerte pour qu'elle puisse être déclenchée à nouveau
  const handleReset = () => {
    onReset(alert.id);
    handleClose();
  };
  
  return (
    <div 
      className={`fixed bottom-4 right-4 max-w-sm bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 text-white transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex justify-between mb-2">
        <h3 className="font-bold text-lg">Alerte de prix</h3>
        <button 
          onClick={handleClose}
          className="text-gray-400 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="mb-3">
        <div className="text-xl font-bold mb-1">{alert.name}</div>
        <div className="text-gray-300">
          Prix {alert.type === 'above' ? 'supérieur à' : 'inférieur à'} {formatNumber(alert.price, isCrypto)}
        </div>
        <div className="mt-1">
          Prix actuel: <span className="font-bold">{formatNumber(currentPrice, isCrypto)}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={handleReset}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
        >
          Réinitialiser
        </button>
        <button
          onClick={handleClose}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default AlertNotification;
