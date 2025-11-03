/**
 * Types TypeScript pour le jeu Le Suspect
 */

export type RoleType = 'Citoyen' | 'Undercover';

export interface Player {
  name: string;
  role: RoleType;
  secretWord: string;
  isActive: boolean;
}

export type GamePhase =
  | 'Configuration'
  | 'AffichageRole'
  | 'TourDeParole'
  | 'VoteElimination'
  | 'FinDePartie';

export interface GameState {
  // Configuration
  players: Player[];
  secretWords: {
    citoyen: string;
    undercover: string;
  };
  
  // Jeu en cours
  currentPhase: GamePhase;
  activePlayers: string[]; // Liste des noms des joueurs actifs
  tourActuel: number; // Numéro du tour actuel (1 à N)
  indexJoueurActuel: number; // Index dans activePlayers pour savoir qui parle/voit son rôle
  
  // Configuration des tours
  currentPlayerIndexForRole: number; // Index pour la phase AffichageRole
  currentPlayerIndexForSpeech: number; // Index pour la phase TourDeParole
}

