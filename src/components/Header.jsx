import React from 'react';

/**
 * Composant Header pour la navigation principale de l'application
 * 
 * @param {Object} props - Propriétés du composant
 * @param {string} props.currentTab - Onglet actuellement sélectionné ('stocks' ou 'crypto')
 * @param {Function} props.onTabChange - Fonction appelée lors du changement d'onglet
 */
const Header = ({ currentTab, onTabChange }) => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            <span className="text-blue-400">Market</span>Tracker
          </h1>
          <button 
            className="md:hidden p-2 rounded-md bg-gray-700 hover:bg-gray-600"
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <nav className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-8 mt-4 md:mt-0">
          <button
            onClick={() => onTabChange('stocks')}
            className={`font-medium transition-colors ${currentTab === 'stocks' ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
          >
            Indices boursiers
          </button>
          <button
            onClick={() => onTabChange('crypto')}
            className={`font-medium transition-colors ${currentTab === 'crypto' ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
          >
            Crypto-monnaies
          </button>
          <button className="text-gray-300 hover:text-white font-medium">
            Alertes
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm transition-colors">
            Connexion
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
