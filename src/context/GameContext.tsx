import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameState, GamePhase, Player, RoleType } from '../types/game';

interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  initializeGame: (playerNames: string[], secretWords: { citoyen: string; undercover: string }) => void;
  moveToNextPhase: (phase: GamePhase) => void;
  eliminatePlayer: (playerName: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialGameState: GameState = {
  players: [],
  secretWords: {
    citoyen: '',
    undercover: '',
  },
  currentPhase: 'Configuration',
  activePlayers: [],
  tourActuel: 1,
  indexJoueurActuel: 0,
  currentPlayerIndexForRole: 0,
  currentPlayerIndexForSpeech: 0,
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  // Fonction pour initialiser le jeu avec assignation aléatoire des rôles
  const initializeGame = (playerNames: string[], secretWords: { citoyen: string; undercover: string }) => {
    // Créer une copie de la liste des noms pour mélanger
    const shuffledNames = [...playerNames].sort(() => Math.random() - 0.5);
    
    // Assigner les rôles : un seul Undercover, le reste sont des Citoyens
    const players: Player[] = shuffledNames.map((name, index) => {
      const role: RoleType = index === 0 ? 'Undercover' : 'Citoyen';
      const secretWord = role === 'Undercover' ? secretWords.undercover : secretWords.citoyen;
      
      return {
        name,
        role,
        secretWord,
        isActive: true,
      };
    });

    const newGameState: GameState = {
      players,
      secretWords,
      currentPhase: 'AffichageRole',
      activePlayers: playerNames,
      tourActuel: 1,
      indexJoueurActuel: 0,
      currentPlayerIndexForRole: 0,
      currentPlayerIndexForSpeech: 0,
    };

    setGameState(newGameState);
  };

  // Fonction pour passer à la phase suivante
  const moveToNextPhase = (phase: GamePhase) => {
    setGameState((prev) => ({
      ...prev,
      currentPhase: phase,
    }));
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
        // Réinitialiser l'index pour le tour de parole
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
        moveToNextPhase,
        eliminatePlayer,
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

