# Le Suspect

Application web PWA (Progressive Web App) pour jouer à une version personnalisée d'Undercover/Agent Double, entièrement jouable en local sur un seul appareil.

## Technologies

- **React** avec **TypeScript**
- **Tailwind CSS** (Mobile-First)
- **Context API** (`useContext`) pour la gestion de l'état global

## Installation

```bash
npm install
```

## Lancement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## Build

```bash
npm run build
```

## Déploiement sur GitHub Pages

Le projet est configuré pour être déployé automatiquement sur GitHub Pages via GitHub Actions.

### Configuration

1. Dans votre repository GitHub, allez dans **Settings** → **Pages**
2. Sélectionnez **GitHub Actions** comme source de déploiement
3. Le workflow `.github/workflows/deploy.yml` se déclenchera automatiquement à chaque push sur `main`

### Base Path

Si votre repository a un nom différent de "Infiltre", vous devez mettre à jour le `base` dans `vite.config.ts` :

```typescript
base: '/VOTRE-NOM-DE-REPOSITORY/',
```

### URL du site

Votre site sera accessible à : `https://VOTRE-USERNAME.github.io/Infiltre/`

## Phases du Jeu

1. **Configuration** : Saisie des noms des joueurs et des mots secrets
2. **Affichage du Rôle** : Chaque joueur voit son rôle et son mot secret
3. **Tour de Parole** : Discussion où chaque joueur décrit son mot
4. **Vote et Élimination** : Vote pour éliminer un joueur suspect
5. **Fin de Partie** : Affichage des résultats

## Structure du Projet

- `src/types/game.ts` : Types TypeScript pour le jeu
- `src/context/GameContext.tsx` : Contexte global pour l'état du jeu
- `src/components/PhaseDisplay.tsx` : Composant pour les phases B et C
- `src/components/ConfigurationPhase.tsx` : Phase de configuration
- `src/components/VoteEliminationPhase.tsx` : Phase de vote
- `src/components/FinDePartiePhase.tsx` : Phase de fin de partie

