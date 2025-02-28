import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { formatNumber, formatDate } from '../utils/formatters';
import { sanitizeStockSymbol } from '../utils/security';

/**
 * Composant de vue détaillée d'un actif financier
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.data - Les données de l'actif
 * @param {string} props.symbol - Le symbole de l'actif
 * @param {string} props.name - Le nom de l'actif
 * @param {boolean} props.isCrypto - Indique si c'est une crypto
 * @param {Function} props.fetchHistoricalData - Fonction pour récupérer les données historiques
 * @param {Function} props.onClose - Fonction appelée à la fermeture de la vue
 * @param {string} props.theme - Le thème actuel ('dark' ou 'light')
 */
const DetailView = ({ 
  data, 
  symbol, 
  name, 
  isCrypto, 
  fetchHistoricalData, 
  onClose,
  theme
}) => {
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('1M');
  const [alertType, setAlertType] = useState('above');
  const [alertPrice, setAlertPrice] = useState('');
  const [alerts, setAlerts] = useState(() => {
    // Récupère les alertes depuis le stockage local
    const savedAlerts = localStorage.getItem('marketAlerts');
    if (savedAlerts) {
      try {
        const parsedAlerts = JSON.parse(savedAlerts);
        return parsedAlerts;
      } catch (e) {
        console.error('Erreur lors du chargement des alertes:', e);
        return [];
      }
    }
    return [];
  });
  
  // Charge les données historiques
  useEffect(() => {
    const loadHistoricalData = async () => {
      try {
        setIsLoading(true);
        const cleanSymbol = sanitizeStockSymbol(symbol);
        if (!cleanSymbol) {
          throw new Error('Symbole invalide');
        }
        
        const data = await fetchHistoricalData(cleanSymbol, period);
        setHistoricalData(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données historiques:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHistoricalData();
  }, [symbol, period, fetchHistoricalData]);
  
  // Gère la création d'une alerte
  const handleCreateAlert = () => {
    // Validation de base
    if (!alertPrice || isNaN(Number(alertPrice)) || Number(alertPrice) <= 0) {
      alert('Veuillez entrer un prix valide');
      return;
    }
    
    const newAlert = {
      id: Date.now(),
      symbol,
      name,
      type: alertType,
      price: Number(alertPrice),
      createdAt: new Date().toISOString(),
      triggered: false
    };
    
    const updatedAlerts = [...alerts, newAlert];
    setAlerts(updatedAlerts);
    
    // Sauvegarde dans le localStorage
    localStorage.setItem('marketAlerts', JSON.stringify(updatedAlerts));
    
    // Réinitialise le formulaire
    setAlertPrice('');
    alert(`Alerte créée : ${name} ${alertType === 'above' ? 'au-dessus de' : 'en dessous de'} ${formatNumber(Number(alertPrice), isCrypto)}`);
  };
  
  // Gère la suppression d'une alerte
  const handleDeleteAlert = (alertId) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
    setAlerts(updatedAlerts);
    localStorage.setItem('marketAlerts', JSON.stringify(updatedAlerts));
  };
  
  // Applique les styles en fonction du thème
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
  const btnPrimary = `bg-blue-600 hover:bg-blue-700 text-white`;
  const btnSecondary = theme === 'dark' 
    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
    : 'bg-gray-200 hover:bg-gray-300 text-gray-800';
  
  // Filtrer les alertes pour ce symbole
  const symbolAlerts = alerts.filter(alert => alert.symbol === symbol);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className={`${cardBg} rounded-lg shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto ${borderColor} border`}>
        {/* Header avec bouton de fermeture */}
        <div className="flex justify-between items-center p-4 border-b ${borderColor}">
          <h2 className="text-2xl font-bold">{name}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700"
            aria-label="Fermer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Informations principales */}
        <div className="p-6">
          <div className="flex flex-wrap justify-between mb-6">
            <div>
              <div className="text-4xl font-bold">
                {formatNumber(data.c, isCrypto)}
              </div>
              <div className={`text-xl ${data.dp >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {data.d >= 0 ? '+' : ''}{formatNumber(data.d, isCrypto)} ({data.dp >= 0 ? '+' : ''}{data.dp.toFixed(2)}%)
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div>
                <span className="text-gray-500">Ouverture</span>
                <div>{formatNumber(data.o, isCrypto)}</div>
              </div>
              <div>
                <span className="text-gray-500">Clôture précédente</span>
                <div>{formatNumber(data.pc, isCrypto)}</div>
              </div>
              <div>
                <span className="text-gray-500">Plus haut</span>
                <div>{formatNumber(data.h, isCrypto)}</div>
              </div>
              <div>
                <span className="text-gray-500">Plus bas</span>
                <div>{formatNumber(data.l, isCrypto)}</div>
              </div>
            </div>
          </div>
          
          {/* Sélecteur de période */}
          <div className="flex space-x-2 mb-4">
            {['1M', '6M', '1Y', 'ALL'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded ${period === p ? btnPrimary : btnSecondary}`}
              >
                {p}
              </button>
            ))}
          </div>
          
          {/* Graphique */}
          <div className="h-64 mb-6">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : historicalData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={historicalData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={data.dp >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={data.dp >= 0 ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(tick) => formatDate(tick, 'date')}
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(tick) => formatNumber(tick, isCrypto, 0)}
                  />
                  <Tooltip 
                    formatter={(value) => [formatNumber(value, isCrypto), 'Prix']}
                    labelFormatter={(label) => formatDate(label, 'datetime')}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={data.dp >= 0 ? "#10b981" : "#ef4444"} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Aucune donnée disponible
              </div>
            )}
          </div>
          
          {/* Section d'alertes */}
          <div className="mt-6 border-t pt-4 ${borderColor}">
            <h3 className="text-xl font-bold mb-4">Alertes de prix</h3>
            
            {/* Formulaire d'alerte */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-1">Type d'alerte</label>
                <select
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value)}
                  className={`w-full px-3 py-2 rounded ${inputBg} ${borderColor} border`}
                >
                  <option value="above">Prix au-dessus de</option>
                  <option value="below">Prix en dessous de</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Prix</label>
                <input
                  type="number"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  placeholder={`Ex: ${Math.round(data.c)}`}
                  className={`w-full px-3 py-2 rounded ${inputBg} ${borderColor} border`}
                />
              </div>
              
              <div>
                <button
                  onClick={handleCreateAlert}
                  className={`w-full py-2 px-4 rounded ${btnPrimary}`}
                >
                  Créer une alerte
                </button>
              </div>
            </div>
            
            {/* Liste des alertes existantes */}
            {symbolAlerts.length > 0 ? (
              <div className={`${borderColor} border rounded-lg overflow-hidden`}>
                <table className="min-w-full divide-y ${borderColor} divide-solid">
                  <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}>
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Prix</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Date de création</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y ${borderColor} divide-solid">
                    {symbolAlerts.map(alert => (
                      <tr key={alert.id}>
                        <td className="px-4 py-3">
                          {alert.type === 'above' ? 'Au-dessus de' : 'En dessous de'}
                        </td>
                        <td className="px-4 py-3">
                          {formatNumber(alert.price, isCrypto)}
                        </td>
                        <td className="px-4 py-3">
                          {formatDate(alert.createdAt, 'datetime')}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteAlert(alert.id)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Supprimer l'alerte"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic">Aucune alerte configurée pour {name}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
