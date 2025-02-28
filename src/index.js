import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Crée une racine React pour le montage de l'application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Désactive strictMode en production pour éviter les rendus doubles
if (process.env.NODE_ENV === 'production') {
  root.render(<App />);
} else {
  // En développement, utilise strictMode pour détecter les problèmes potentiels
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
