import React from 'react';

/**
 * Composant d'en-tête de l'application
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.activeTab - Onglet actif ('indices' ou 'crypto')
 * @param {Function} props.setActiveTab - Fonction pour changer d'onglet
 * @param {string} props.theme - Thème actuel ('dark' ou 'light')
 * @param {Function} props.toggleTheme - Fonction pour basculer le thème
 */
const Header = ({ activeTab, setActiveTab, theme, toggleTheme }) => {
  // Styles en fonction du thème
  const headerBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const activeTabStyle = 'bg-blue-600 text-white';
  const inactiveTabStyle = theme === 'dark' 
    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
    : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
  
  return (
    <header className={`${headerBg} shadow-lg py-4 sticky top-0 z-10`}>
      <div className="container mx-auto px-4 flex flex-wrap justify-between items-center">
        {/* Logo et titre */}
        <h1 className="text-2xl font-bold flex items-center">
          <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20V10M18 20V4M6 20v-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          MarketTracker
        </h1>
        
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          {/* Onglets */}
          <div className="flex rounded-md overflow-hidden">
            <button 
              className={`px-4 py-2 ${activeTab === 'indices' ? activeTabStyle : inactiveTabStyle}`}
              onClick={() => setActiveTab('indices')}
            >
              Indices
            </button>
            <button 
              className={`px-4 py-2 ${activeTab === 'crypto' ? activeTabStyle : inactiveTabStyle}`}
              onClick={() => setActiveTab('crypto')}
            >
              Crypto
            </button>
          </div>
          
          {/* Bouton de thème */}
          <button 
            className="p-2 rounded-full hover:bg-gray-700 hover:bg-opacity-30"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre'}
          >
            {theme === 'dark' ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Bannière temps réel */}
      <div className={`mt-4 py-2 ${theme === 'dark' ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-100'}`}>
        <div className="container mx-auto px-4 flex items-center text-sm">
          <div className={`mr-2 w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-green-400' : 'bg-green-500'} animate-pulse`}></div>
          <span>Données en temps réel · Mises à jour automatiques toutes les 60 secondes</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
