import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameState, GamePhase, Player, RoleType } from '../types/game';
import { getRandomWordPair } from '../data/wordPairs';
import { shuffle } from '../utils/shuffle';

interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  initializeGame: (
    totalPlayers: number,
    numUndercovers: number,
    numMrWhite: number,
    themeId?: string
  ) => void;
  restartGame: () => void;
  moveToNextPhase: (phase: GamePhase) => void;
  eliminatePlayer: (playerName: string) => void;
  checkMrWhiteGuess: (guessedWord: string, eliminatedPlayerName: string) => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialGameState: GameState = {
  players: [],
  secretWords: {
    citoyen: '',
    undercover: '',
  },
  selectedTheme: 'ALL',
  currentPhase: 'Configuration',
  activePlayers: [],
  tourActuel: 1,
  indexJoueurActuel: 0,
  currentPlayerIndexForRole: 0,
  currentPlayerIndexForSpeech: 0,
  mrWhiteWonByGuessing: false,
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  /**
   * Helper function to create role assignments and players
   */
  const createPlayers = (
    playerNames: string[],
    numUndercovers: number,
    numMrWhite: number,
    wordPair: { citoyen: string; undercover: string }
  ): Player[] => {
    const numCivils = playerNames.length - numUndercovers - numMrWhite;

    // Créer la liste des rôles à assigner
    const rolesToAssign: RoleType[] = [
      ...Array(numMrWhite).fill('Mr. White'),
      ...Array(numUndercovers).fill('Undercover'),
      ...Array(numCivils).fill('Citoyen'),
    ];

    // Mélanger les noms et les rôles avec Fisher-Yates
    const shuffledNames = shuffle(playerNames);
    const shuffledRoles = shuffle(rolesToAssign);

    // Assigner les rôles aux joueurs
    return shuffledNames.map((name, index) => {
      const role = shuffledRoles[index];
      let secretWord: string | null = null;

      if (role === 'Mr. White') {
        secretWord = null;
      } else if (role === 'Undercover') {
        secretWord = wordPair.undercover;
      } else {
        secretWord = wordPair.citoyen;
      }

      return {
        name,
        role,
        secretWord,
        isActive: true,
      };
    });
  };

  // Fonction pour initialiser le jeu avec assignation aléatoire des rôles
  const initializeGame = (
    totalPlayers: number,
    numUndercovers: number,
    numMrWhite: number,
    themeId: string = 'ALL'
  ) => {
    const wordPair = getRandomWordPair(themeId);
    const playerNames = Array.from({ length: totalPlayers }, (_, i) => `Joueur ${i + 1}`);
    const players = createPlayers(playerNames, numUndercovers, numMrWhite, wordPair);

    const newGameState: GameState = {
      players,
      secretWords: {
        citoyen: wordPair.citoyen,
        undercover: wordPair.undercover,
      },
      selectedTheme: themeId,
      currentPhase: 'AffichageRole',
      activePlayers: playerNames,
      tourActuel: 1,
      indexJoueurActuel: 0,
      currentPlayerIndexForRole: 0,
      currentPlayerIndexForSpeech: 0,
      mrWhiteWonByGuessing: false,
    };

    setGameState(newGameState);
  };

  // Fonction pour recommencer une partie avec les mêmes joueurs
  const restartGame = () => {
    setGameState((prev) => {
      const themeId = prev.selectedTheme || 'ALL';
      const numMrWhite = prev.players.filter((p) => p.role === 'Mr. White').length;
      const numUndercovers = prev.players.filter((p) => p.role === 'Undercover').length;

      // Sélectionner une nouvelle paire de mots selon le thème configuré
      const wordPair = getRandomWordPair(themeId);

      // Garder les mêmes noms de joueurs mais réassigner les rôles
      const playerNames = prev.players.map((p) => p.name);
      const players = createPlayers(playerNames, numUndercovers, numMrWhite, wordPair);

      return {
        ...prev,
        players,
        secretWords: {
          citoyen: wordPair.citoyen,
          undercover: wordPair.undercover,
        },
        selectedTheme: themeId,
        currentPhase: 'AffichageRole',
        activePlayers: playerNames,
        tourActuel: 1,
        indexJoueurActuel: 0,
        currentPlayerIndexForRole: 0,
        currentPlayerIndexForSpeech: 0,
        mrWhiteWonByGuessing: false,
      };
    });
  };

  // Fonction pour passer à la phase suivante
  const moveToNextPhase = (phase: GamePhase) => {
    setGameState((prev) => ({
      ...prev,
      currentPhase: phase,
    }));
  };

  // Fonction pour vérifier la devinette de Mr. White
  const checkMrWhiteGuess = (guessedWord: string, eliminatedPlayerName: string): boolean => {
    const normalizedGuess = guessedWord.trim().toLowerCase();
    const correctWord = gameState.secretWords.citoyen.toLowerCase();

    if (normalizedGuess === correctWord) {
      // Mr. White a trouvé le mot ! Victoire pour Mr. White et Undercover
      setGameState((prev) => {
        const updatedPlayers = prev.players.map((p) =>
          p.name === eliminatedPlayerName ? { ...p, isActive: false } : p
        );

        const updatedActivePlayers = prev.activePlayers.filter((name) => name !== eliminatedPlayerName);

        return {
          ...prev,
          players: updatedPlayers,
          activePlayers: updatedActivePlayers,
          currentPhase: 'FinDePartie',
          mrWhiteWonByGuessing: true,
        };
      });
      return true;
    }

    // Mauvaise réponse, élimination normale
    eliminatePlayer(eliminatedPlayerName);
    return false;
  };

  // Fonction pour éliminer un joueur
  const eliminatePlayer = (playerName: string) => {
    setGameState((prev) => {
      const updatedPlayers = prev.players.map((p) =>
        p.name === playerName ? { ...p, isActive: false } : p
      );
      
      const updatedActivePlayers = prev.activePlayers.filter((name) => name !== playerName);

      // Déterminer la phase suivante
      let nextPhase: GamePhase = prev.currentPhase;
      if (updatedActivePlayers.length > 2) {
        nextPhase = 'TourDeParole';
        return {
          ...prev,
          players: updatedPlayers,
          activePlayers: updatedActivePlayers,
          currentPhase: nextPhase,
          tourActuel: prev.tourActuel + 1,
          currentPlayerIndexForSpeech: 0,
        };
      } else {
        nextPhase = 'FinDePartie';
        return {
          ...prev,
          players: updatedPlayers,
          activePlayers: updatedActivePlayers,
          currentPhase: nextPhase,
        };
      }
    });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        initializeGame,
        restartGame,
        moveToNextPhase,
        eliminatePlayer,
        checkMrWhiteGuess,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
