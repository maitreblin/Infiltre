/**
 * Types TypeScript pour le jeu Le Suspect
 */

export type RoleType = 'Citoyen' | 'Undercover' | 'Mr. White';

export interface Player {
  name: string;
  role: RoleType;
  secretWord: string | null; // null pour Mr. White
  isActive: boolean;
}

export type GamePhase =
  | 'Configuration'
  | 'AffichageRole'
  | 'TourDeParole'
  | 'VoteElimination'
  | 'FinDePartie';

export interface WordPair {
  citoyen: string;
  undercover: string;
  theme?: string;
}

export interface CustomWordPack {
  id: string;
  theme: string;
  pairs: WordPair[];
  createdAt: number;
}

export interface GameState {
  // Configuration
  players: Player[];
  secretWords: {
    citoyen: string;
    undercover: string;
  };
  selectedTheme?: string;

  // Jeu en cours
  currentPhase: GamePhase;
  activePlayers: string[]; // Liste des noms des joueurs actifs
  tourActuel: number; // Numéro du tour actuel (1 à N)
  indexJoueurActuel: number; // Index dans activePlayers pour savoir qui parle/voit son rôle

  // Configuration des tours
  currentPlayerIndexForRole: number; // Index pour la phase AffichageRole
  currentPlayerIndexForSpeech: number; // Index pour la phase TourDeParole

  // Victoire spéciale
  mrWhiteWonByGuessing: boolean; // Mr. White a gagné en devinant le mot
}
