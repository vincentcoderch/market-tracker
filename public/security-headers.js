/**
 * Configuration des en-têtes de sécurité pour l'application
 * À utiliser avec un middleware Express.js pour servir l'application
 */

const helmet = require('helmet');

// Configuration des headers de sécurité
const setupSecurityHeaders = (app) => {
  // Utilise Helmet pour configurer plusieurs en-têtes de sécurité
  app.use(
    helmet({
      // Content Security Policy (CSP)
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https://finnhub.io"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https://finnhub.io"],
          connectSrc: ["'self'", "https://finnhub.io"],
        },
      },
      
      // Strict Transport Security (HSTS)
      strictTransportSecurity: {
        maxAge: 63072000, // 2 ans en secondes
        includeSubDomains: true,
        preload: true,
      },
      
      // X-Frame-Options pour prévenir le clickjacking
      frameguard: {
        action: 'deny',
      },
      
      // X-Content-Type-Options pour prévenir le MIME sniffing
      noSniff: true,
      
      // X-XSS-Protection pour activer le filtre XSS des navigateurs
      xssFilter: true,
      
      // Referrer-Policy pour contrôler les informations de référence envoyées
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
      
      // Empêche l'application d'être intégrée dans un iframe
      crossOriginEmbedderPolicy: false,
      
      // Feature-Policy (maintenant Permissions-Policy)
      // Contrôle quelles fonctionnalités et API peuvent être utilisées
      permissionsPolicy: {
        features: {
          camera: ["'none'"],
          microphone: ["'none'"],
          geolocation: ["'none'"],
          payment: ["'none'"],
        },
      },
    })
  );

  // Middleware pour gérer les CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
};

module.exports = setupSecurityHeaders;
