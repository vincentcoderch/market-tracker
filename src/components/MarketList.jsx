import React, { useState } from 'react';
import { formatNumber } from '../utils/formatters';
import DetailView from './DetailView';

/**
 * Composant qui affiche une liste d'actifs financiers (indices ou cryptos)
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.title - Titre de la liste
 * @param {Object} props.data - Données des actifs
 * @param {boolean} props.loading - État de chargement
 * @param {Object} props.symbols - Mapping entre noms et symboles
 * @param {Function} props.fetchHistoricalData - Fonction pour récupérer les données historiques
 * @param {string} props.theme - Thème actuel ('dark' ou 'light')
 * @param {boolean} props.isCrypto - Indique si les actifs sont des cryptomonnaies
 */
const MarketList = ({ 
  title, 
  data, 
  loading, 
  symbols, 
  fetchHistoricalData, 
  theme,
  isCrypto = false 
}) => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  
  // Ouvre la vue détaillée pour un actif
  const handleAssetClick = (name) => {
    setSelectedAsset({
      name,
      symbol: symbols[name],
      data: data[name]
    });
  };
  
  // Ferme la vue détaillée
  const handleCloseDetail = () => {
    setSelectedAsset(null);
  };
  
  // Styles en fonction du thème
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      
      {loading ? (
        // État de chargement
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div 
              key={index} 
              className={`${cardBg} rounded-lg shadow-md h-64 animate-pulse ${borderColor} border`}
            ></div>
          ))}
        </div>
      ) : Object.keys(data).length === 0 ? (
        // Aucune donnée
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12.5a.5.5 0 11-1 0 .5.5 0 011 0zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl">Aucune donnée disponible</p>
          <p className="text-gray-500 mt-2">Veuillez réessayer plus tard</p>
        </div>
      ) : (
        // Liste des actifs
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(data).map(([name, stats]) => {
            if (!stats) return null;
            
            return (
              <div 
                key={name} 
                className={`${cardBg} rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:shadow-lg ${borderColor} border market-card`}
                onClick={() => handleAssetClick(name)}
                role="button"
                aria-label={`Voir les détails de ${name}`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg">{name}</h3>
                    <span className={stats.dp >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {stats.dp >= 0 ? '+' : ''}{stats.dp.toFixed(2)}%
                    </span>
                  </div>
                  
                  <div className="text-3xl font-bold mb-4">
                    {formatNumber(stats.c, isCrypto)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Ouv.</span>
                      <div>{formatNumber(stats.o, isCrypto)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Préc.</span>
                      <div>{formatNumber(stats.pc, isCrypto)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Haut</span>
                      <div>{formatNumber(stats.h, isCrypto)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Bas</span>
                      <div>{formatNumber(stats.l, isCrypto)}</div>
                    </div>
                  </div>
                </div>
                
                {/* Indicateur visuel simple pour montrer que l'élément est cliquable */}
                <div className={`h-1 ${stats.dp >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Vue détaillée */}
      {selectedAsset && (
        <DetailView
          data={selectedAsset.data}
          symbol={selectedAsset.symbol}
          name={selectedAsset.name}
          isCrypto={isCrypto}
          fetchHistoricalData={fetchHistoricalData}
          onClose={handleCloseDetail}
          theme={theme}
        />
      )}
    </div>
  );
};

export default MarketList;
