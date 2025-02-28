import React, { useState } from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatNumber } from '../utils/formatters';

/**
 * Composant affichant une liste d'indices boursiers ou de cryptomonnaies
 * 
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.assets - Liste des actifs à afficher
 * @param {boolean} props.isCrypto - Indique s'il s'agit de cryptomonnaies
 * @param {Function} props.onAssetClick - Fonction appelée lors du clic sur un actif
 */
const MarketList = ({ assets, isCrypto, onAssetClick }) => {
  // État pour la période des graphiques
  const [activePeriod, setActivePeriod] = useState('1M');

  // Les périodes disponibles
  const periods = [
    { id: '1M', label: '1 mois' },
    { id: '6M', label: '6 mois' },
    { id: '1A', label: '1 an' },
    { id: 'All', label: 'Tout' }
  ];

  // Calculer la variation sur la période sélectionnée
  const calculatePeriodChange = (asset) => {
    if (!asset || !asset.chartData || !asset.chartData[activePeriod]) return 0;
    
    const data = asset.chartData[activePeriod];
    if (data.length === 0) return 0;
    
    const startValue = data[0].value;
    const endValue = asset.value;
    return ((endValue - startValue) / startValue) * 100;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {isCrypto ? 'Crypto-monnaies populaires' : 'Indices boursiers'}
        </h2>
        <div className="flex items-center">
          <span className="mr-2 text-gray-400">Période:</span>
          <div className="flex bg-gray-800 rounded-lg p-1">
            {periods.map(period => (
              <button 
                key={period.id}
                onClick={() => setActivePeriod(period.id)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  activePeriod === period.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
                aria-label={`Afficher les données sur ${period.label}`}
              >
                {period.id}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map(asset => {
          // Calculer la variation sur la période sélectionnée
          const periodChange = calculatePeriodChange(asset);
          
          return (
            <div 
              key={asset.id} 
              className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => onAssetClick(asset)}
            >
              <div className="flex justify-between">
                <h3 className="font-bold">
                  {asset.name}
                  {isCrypto && <span className="ml-2 text-gray-400 text-sm">{asset.ticker}</span>}
                </h3>
                <div>
                  <span className={asset.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {asset.change >= 0 ? '+' : ''}{asset.change}%
                  </span>
                  <div className="text-xs text-gray-400">
                    {activePeriod}: {periodChange >= 0 ? '+' : ''}{periodChange.toFixed(2)}%
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold">
                  {isCrypto && '$'}{formatNumber(asset.value, isCrypto)}
                </span>
              </div>
              
              {/* Mini graphique */}
              <div className="h-24 mt-2">
                {asset.chartData && asset.chartData[activePeriod] && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={asset.chartData[activePeriod]}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={periodChange >= 0 ? "#22c55e" : "#ef4444"} 
                        dot={false}
                        strokeWidth={1.5}
                      />
                      {activePeriod === '1M' && (
                        <XAxis 
                          dataKey="time" 
                          tick={{ fill: '#9ca3af', fontSize: 10 }}
                          tickLine={false}
                          axisLine={false}
                          interval="preserveStartEnd"
                        />
                      )}
                      <Tooltip 
                        formatter={(value) => [isCrypto ? `$${formatNumber(value, isCrypto)}` : formatNumber(value), asset.name]}
                        contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '4px' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <button 
                  className="py-1 px-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAssetClick(asset);
                  }}
                  aria-label={`Voir les détails de ${asset.name}`}
                >
                  Voir détails
                </button>
                <div className="text-xs text-gray-400">
                  {activePeriod === 'All' ? 'Depuis la création' : activePeriod}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketList;
