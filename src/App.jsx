import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MarketList from './components/MarketList';
import AlertNotification from './components/AlertNotification';
import apiService, { MARKET_INDICES, CRYPTO_SYMBOLS } from './services/apiService';
import alertService from './services/alertService';
import { transformCandleData } from './utils/formatters';

/**
 * Composant principal de l'application
 */
const App = () => {
  const [marketData, setMarketData] = useState({
    indices: {},
    crypto: {},
    loading: true,
    error: null
  });
  
  const [activeTab, setActiveTab] = useState('indices');
  const [theme, setTheme] = useState(() => {
    // Récupère le thème depuis localStorage ou utilise 'dark' par défaut
    return localStorage.getItem('theme') || 'dark';
  });
  const [triggeredAlerts, setTriggeredAlerts] = useState([]);
  
  // Demande l'autorisation pour les notifications
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);
  
  // Enregistre le thème dans localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  /**
   * Récupère les données de marché au chargement et les met à jour périodiquement
   */
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setMarketData(prevData => ({ ...prevData, loading: true, error: null }));
        
        // Indices boursiers
        const indicesData = {};
        for (const [name, symbol] of Object.entries(MARKET_INDICES)) {
          try {
            const data = await apiService.getStockQuote(symbol);
            indicesData[name] = data;
          } catch (error) {
            console.error(`Erreur lors du chargement de ${name}:`, error);
          }
        }
        
        // Crypto-monnaies
        const cryptoData = {};
        for (const [name, symbol] of Object.entries(CRYPTO_SYMBOLS)) {
          try {
            const data = await apiService.getStockQuote(symbol);
            cryptoData[name] = data;
          } catch (error) {
            console.error(`Erreur lors du chargement de ${name}:`, error);
          }
        }
        
        const newMarketData = {
          indices: indicesData,
          crypto: cryptoData,
          loading: false,
          error: null
        };
        
        setMarketData(newMarketData);
        
        // Vérifie les alertes
        checkAlerts(newMarketData);
      } catch (error) {
        setMarketData(prevData => ({
          ...prevData,
          loading: false,
          error: 'Erreur lors du chargement des données de marché'
        }));
        console.error('Erreur lors du chargement des données:', error);
      }
    };
    
    // Charger les données immédiatement
    fetchMarketData();
    
    // Mettre à jour les données toutes les 60 secondes
    const intervalId = setInterval(fetchMarketData, 60000);
    
    // Nettoyer l'intervalle lorsque le composant est démonté
    return () => clearInterval(intervalId);
  }, []);
  
  /**
   * Vérifie les alertes de prix en fonction des données de marché
   */
  const checkAlerts = (marketData) => {
    // Vérifie les alertes pour les indices
    const indicesAlerts = alertService.checkAlerts(marketData.indices, MARKET_INDICES);
    
    // Vérifie les alertes pour les cryptos
    const cryptoAlerts = alertService.checkAlerts(marketData.crypto, CRYPTO_SYMBOLS);
    
    // Combine les alertes déclenchées
    const newTriggeredAlerts = [...indicesAlerts, ...cryptoAlerts];
    
    // Ajoute les nouvelles alertes déclenchées
    if (newTriggeredAlerts.length > 0) {
      setTriggeredAlerts(prevAlerts => [...prevAlerts, ...newTriggeredAlerts]);
      
      // Déclenche des notifications pour chaque alerte
      newTriggeredAlerts.forEach(alert => {
        const currentPrice = alert.name in marketData.indices 
          ? marketData.indices[alert.name].c 
          : marketData.crypto[alert.name].c;
        
        alertService.sendNotification(alert, currentPrice);
      });
    }
  };
  
  /**
   * Récupère les données historiques pour un symbole
   * @param {string} symbol - Le symbole à récupérer
   * @param {string} period - La période (1M, 6M, 1Y, ALL)
   */
  const fetchHistoricalData = async (symbol, period = '1M') => {
    try {
      // Déterminer les timestamps en fonction de la période
      const now = Math.floor(Date.now() / 1000);
      let from;
      let resolution;
      
      switch (period) {
        case '1M':
          from = now - 30 * 24 * 60 * 60;
          resolution = 'D';
          break;
        case '6M':
          from = now - 180 * 24 * 60 * 60;
          resolution = 'W';
          break;
        case '1Y':
          from = now - 365 * 24 * 60 * 60;
          resolution = 'W';
          break;
        case 'ALL':
          from = now - 5 * 365 * 24 * 60 * 60;
          resolution = 'M';
          break;
        default:
          from = now - 30 * 24 * 60 * 60;
          resolution = 'D';
      }
      
      const candleData = await apiService.getStockCandles(symbol, resolution, from, now);
      return transformCandleData(candleData);
    } catch (error) {
      console.error('Erreur lors de la récupération des données historiques:', error);
      throw error;
    }
  };
  
  /**
   * Change le thème de l'application
   */
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };
  
  /**
   * Supprime une alerte déclenchée de la liste
   */
  const handleCloseAlert = (alertId) => {
    setTriggeredAlerts(prevAlerts => 
      prevAlerts.filter(alert => alert.id !== alertId)
    );
  };
  
  /**
   * Réinitialise une alerte pour qu'elle puisse être déclenchée à nouveau
   */
  const handleResetAlert = (alertId) => {
    alertService.resetAlert(alertId);
    handleCloseAlert(alertId);
  };
  
  return (
    <div className={`app ${theme}`}>
      <div className={`app-container ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          theme={theme}
          toggleTheme={toggleTheme}
        />
        
        <main className="container mx-auto px-4 py-6">
          {marketData.error && (
            <div className="bg-red-500 text-white p-4 rounded mb-6">
              {marketData.error}
            </div>
          )}
          
          {activeTab === 'indices' ? (
            <MarketList 
              title="Indices Boursiers" 
              data={marketData.indices} 
              loading={marketData.loading} 
              fetchHistoricalData={fetchHistoricalData}
              symbols={MARKET_INDICES}
              theme={theme}
            />
          ) : (
            <MarketList 
              title="Crypto-monnaies" 
              data={marketData.crypto} 
              loading={marketData.loading} 
              fetchHistoricalData={fetchHistoricalData}
              symbols={CRYPTO_SYMBOLS}
              theme={theme}
              isCrypto
            />
          )}
        </main>
        
        <footer className={`py-4 text-center ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
          <p>© 2025 MarketTracker - Données fournies par Finnhub</p>
        </footer>
        
        {/* Notifications d'alertes */}
        {triggeredAlerts.map((alert, index) => {
          const isCrypto = Object.keys(CRYPTO_SYMBOLS).includes(alert.name);
          const currentPrice = alert.name in marketData.indices 
            ? marketData.indices[alert.name].c 
            : marketData.crypto[alert.name].c;
          
          return (
            <AlertNotification
              key={alert.id}
              alert={alert}
              currentPrice={currentPrice}
              onClose={() => handleCloseAlert(alert.id)}
              onReset={handleResetAlert}
              isCrypto={isCrypto}
            />
          );
        })}
      </div>
    </div>
  );
};

export default App;
