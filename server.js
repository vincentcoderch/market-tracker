/**
 * Serveur Express pour servir l'application en production
 * avec les en-têtes de sécurité appropriés
 */

const express = require('express');
const path = require('path');
const setupSecurityHeaders = require('./public/security-headers');

const app = express();
const PORT = process.env.PORT || 5000;

// Applique les en-têtes de sécurité
setupSecurityHeaders(app);

// Sert les fichiers statiques depuis le dossier build
app.use(express.static(path.join(__dirname, 'build')));

// Middleware pour les erreurs 404
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    return res.status(405).send('Méthode non autorisée');
  }
  next();
});

// Toutes les autres requêtes GET non reconnues renvoient vers l'app React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Middleware de gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).send('Erreur interne du serveur');
});

// Démarre le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
