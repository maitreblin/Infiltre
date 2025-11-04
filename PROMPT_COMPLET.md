# Prompt Complet - Le Suspect

## 🎯 Vue d'ensemble

Créer une **application web PWA (Progressive Web App)** nommée **"Le Suspect"**, une version personnalisée d'Undercover/Agent Double, entièrement jouable en **local sur un seul appareil** avec des rounds d'élimination successifs.

## 🛠️ Stack Technique

- **Frontend** : React avec TypeScript
- **Styling** : Tailwind CSS (approche Mobile-First)
- **État global** : Context API (`useContext`) pour gérer l'état du jeu
- **Build** : Vite
- **Déploiement** : GitHub Pages (via GitHub Actions)

## 🎮 Rôles du Jeu

1. **Citoyen** : Connaît le mot secret des citoyens
2. **Undercover** : Connaît un mot différent (proche mais différent)
3. **Mr. White** (optionnel) : Ne connaît **aucun mot secret**

**Important** : Les Undercover et Mr. White sont dans la **même équipe** (ils gagnent ensemble).

## 📋 Règles de Distribution des Rôles

### Contraintes générales
- **Au moins 1 Civil** est obligatoire
- **Au moins 1 Undercover OU 1 Mr. White** est obligatoire (pas de partie avec seulement des Civils)
- Le nombre de Civils se calcule automatiquement : `Civil = Total - Undercover - Mr White`

### Règles selon la parité

#### Nombre de joueurs **PAIR**
- **Si Undercover > 0 ET Mr White = 0** : `Civil > Undercover`
- **Si Undercover > 0 ET Mr White > 0** : `Civil = Undercover + Mr White`
- **Si Undercover = 0 ET Mr White > 0** : `Civil > Mr White`
- **Si Undercover = 0 ET Mr White = 0** : Configuration invalide (au moins 1 adversaire requis)

#### Nombre de joueurs **IMPAIR**
- `Civil > Undercover + Mr White` (toujours)

### Ajustements dynamiques
- Quand le curseur du nombre total de joueurs change, les valeurs de `Undercover` et `Mr White` doivent s'ajuster automatiquement pour respecter les règles
- Les valeurs ne peuvent **jamais être négatives**
- Le nombre de Civils se met à jour automatiquement en temps réel

## 🎨 Interface de Configuration

### Contrôles
1. **Curseur (slider)** pour sélectionner le nombre total de joueurs (3 à 15)
2. **Affichage dynamique** du nombre de Civils, Undercover et Mr White sous le curseur
3. **Boutons +/-** pour ajuster le nombre d'Undercover (avec limites min/max dynamiques)
4. **Boutons +/-** pour ajuster le nombre de Mr White (avec limites min/max dynamiques)
5. **Case à cocher** "Inclure Mr. White ?" pour activer/désactiver Mr. White
6. **Feedback visuel** :
   - "✓ Configuration valide" en vert si la configuration est valide
   - Message d'erreur en rouge si la configuration est invalide

### Validation
- Empêcher le démarrage d'une partie avec une configuration invalide
- Afficher une alerte si l'utilisateur essaie de commencer avec seulement des Civils

## 🔄 Phases du Jeu

### 1. Configuration
- Paramétrage du nombre de joueurs et des rôles
- Validation avant de commencer

### 2. AffichageRole
**Comportement** :
- Affichage d'une grille de cartes (autant que de joueurs) : "🃏 Carte 1", "🃏 Carte 2", etc.
- Chaque joueur clique sur une carte, entre son nom, et voit :
  - **Citoyen/Undercover** : Leur mot secret (seulement le mot, **PAS le rôle**)
  - **Mr. White** : "Vous êtes Mr. White" (pas de mot secret)
- Le bouton "Carte prise" marque la carte comme révélée et enregistre le nom du joueur
- **Transition automatique** vers `TourDeParole` quand toutes les cartes sont prises

**Règle importante** : Les joueurs **ne voient que leur mot secret, pas leur rôle**. Les rôles ne sont révélés qu'à l'élimination.

### 3. TourDeParole
**Comportement simplifié** :
- Affichage d'un **seul écran** avec :
  - Le titre "Tour de Parole"
  - L'instruction : "Chaque joueur doit décrire son mot sans le nommer"
  - La liste ordonnée de tous les joueurs actifs (avec numérotation)
  - Un bouton "Passer aux votes"

**Règles d'ordre** :
- **Mr. White ne peut JAMAIS être en première position** (il doit être au moins deuxième)
- Après le premier joueur, les autres joueurs (incluant Mr. White) sont **mélangés aléatoirement**
- **Aucun badge ou indication de rôle** dans cette liste (les rôles restent secrets)

### 4. VoteElimination
**Comportement** :
- Sélection d'un joueur à éliminer
- **Si le joueur éliminé est Mr. White** :
  - Afficher un écran spécial avec un champ de texte
  - Le Mr. White peut entrer le mot qu'il pense être celui des Civils
  - Si correct : **Victoire immédiate pour Mr. White et Undercover**, passage à `FinDePartie`
  - Si incorrect : Élimination normale, la partie continue
- **Si le joueur éliminé n'est pas Mr. White** :
  - Afficher le nom et le rôle du joueur éliminé
  - Éliminer le joueur et passer au tour suivant ou à `FinDePartie`

### 5. FinDePartie
- Déterminer les gagnants :
  - **Citoyens** : Si tous les Undercover et Mr. White sont éliminés
  - **Undercover + Mr. White** : Si le nombre de Civils ≤ nombre d'adversaires restants
  - **Mr. White + Undercover** : Si Mr. White a correctement deviné le mot (victoire instantanée)
- Afficher un résumé de tous les joueurs avec leurs rôles révélés

## 🔀 Gestion du Mélange

### Distribution initiale
- Les noms des joueurs sont générés automatiquement : "Joueur 1", "Joueur 2", etc.
- Les rôles sont **mélangés aléatoirement** avant d'être assignés aux joueurs

### Sélection des mots
- Les paires de mots sont stockées dans une liste prédéfinie
- Une paire est **sélectionnée aléatoirement** au début de chaque partie
- Format : `{ citoyen: 'Coca', undercover: 'Pepsi' }`

## 📱 Contraintes UX/UI

- **Mobile-First** : Interface optimisée pour mobile
- **PWA** : Application installable sur mobile
- **Design moderne** : Utiliser Tailwind CSS avec palette de couleurs cohérente
- **Feedback visuel** : Messages clairs pour chaque action
- **Transitions fluides** : Passage automatique entre les phases quand approprié

## 🚀 Déploiement

- Configuration GitHub Pages avec `base: '/Infiltre/'` dans `vite.config.ts`
- GitHub Actions workflow pour déploiement automatique sur push sur `main`
- Assets doivent se charger correctement depuis le sous-dossier

## 📝 Structure des Données

### GameState
```typescript
{
  players: Player[]; // Liste de tous les joueurs
  secretWords: { citoyen: string; undercover: string }; // Mots secrets de la partie
  currentPhase: GamePhase; // Phase actuelle
  activePlayers: string[]; // Noms des joueurs encore actifs
  tourActuel: number; // Numéro du tour
  // ... autres champs de suivi
}
```

### Player
```typescript
{
  name: string; // "Joueur 1", "Joueur 2", etc.
  role: 'Citoyen' | 'Undercover' | 'Mr. White';
  secretWord: string | null; // null pour Mr. White
  isActive: boolean; // false si éliminé
}
```

## ⚠️ Points d'Attention

1. **Secret des rôles** : Les rôles ne doivent jamais être révélés avant l'élimination (sauf l'affichage du mot secret pour Citoyen/Undercover)
2. **Mr. White en premier** : Impossible, toujours au moins deuxième
3. **Validation stricte** : Impossible de commencer sans au moins 1 Undercover OU 1 Mr. White
4. **Ajustements dynamiques** : Les valeurs doivent toujours respecter les règles de parité
5. **Pas de valeurs négatives** : Jamais de nombres négatifs pour les rôles
6. **Transition automatique** : Après toutes les cartes prises, passage automatique à TourDeParole
7. **Mr. White guess** : Mécanisme de devinette avec victoire instantanée si correct

## 🎯 Objectif Final

Une application complète, fonctionnelle, jouable localement sur mobile, avec toutes les règles de distribution des rôles, le mécanisme spécial de Mr. White, et une interface intuitive et moderne.

