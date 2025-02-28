# MarketTracker

Application de suivi en temps réel des indices boursiers et cryptomonnaies avec des graphiques interactifs et des alertes de prix personnalisables.

![MarketTracker Preview](https://via.placeholder.com/800x400?text=MarketTracker+Preview)

## Fonctionnalités

- **Visualisation en temps réel** des principaux indices boursiers mondiaux et cryptomonnaies
- **Graphiques interactifs** sur différentes périodes (1 mois, 6 mois, 1 an, depuis la création)
- **Système d'alertes** pour être notifié lorsqu'un actif atteint un certain seuil de prix
- **Interface moderne** avec thème sombre et expérience utilisateur optimisée
- **Responsive design** pour une utilisation sur ordinateur, tablette ou mobile

## Installation

1. **Clonez ce dépôt**
   ```bash
   git clone https://github.com/vincentcoderch/market-tracker.git
   cd market-tracker
   ```

2. **Installez les dépendances**
   ```bash
   npm install
   ```

3. **Configurez les variables d'environnement**
   - Créez un fichier `.env` à la racine du projet en vous basant sur `.env.example`
   - Obtenez une clé API gratuite sur [Finnhub](https://finnhub.io/register) et ajoutez-la au fichier `.env`
   ```
   REACT_APP_FINNHUB_API_KEY=votre_clé_api_ici
   ```

4. **Lancez l'application en mode développement**
   ```bash
   npm start
   ```
   L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000)

## Technologies utilisées

- **React.js** - Framework JavaScript pour l'interface utilisateur
- **Recharts** - Bibliothèque de graphiques pour React
- **Tailwind CSS** - Framework CSS pour le design
- **Finnhub API** - Source de données boursières en temps réel

## Structure du projet

```
market-tracker/
├── public/               # Fichiers statiques
├── src/                  # Code source
│   ├── components/       # Composants React
│   ├── services/         # Services pour les API
│   ├── utils/            # Utilitaires et helpers
│   ├── App.jsx           # Composant principal
│   └── index.js          # Point d'entrée
├── .env.example          # Exemple de variables d'environnement
└── README.md             # Documentation
```

## Sécurité

- Le fichier `.env` contenant votre clé API est exclus du contrôle de version (via `.gitignore`)
- Toutes les requêtes API utilisent HTTPS
- Les données d'entrée utilisateur sont validées avant d'être utilisées dans les requêtes

## Déploiement

Pour construire l'application pour la production :

```bash
npm run build
```

Cela génère un dossier `build` avec les fichiers optimisés que vous pouvez déployer sur n'importe quel hébergeur statique (Netlify, Vercel, GitHub Pages, etc.).

## Contributions

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

MIT
