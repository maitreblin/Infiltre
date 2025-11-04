import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameState, GamePhase, Player, RoleType } from '../types/game';
import { getRandomWordPair } from '../data/wordPairs';

interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  initializeGame: (totalPlayers: number, numUndercovers: number, numMrWhite: number) => void;
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
  const initializeGame = (totalPlayers: number, numUndercovers: number, numMrWhite: number) => {
    // Sélectionner une paire de mots aléatoirement
    const wordPair = getRandomWordPair();
    
    // Calculer le nombre de Civils
    const numCivils = totalPlayers - numUndercovers - numMrWhite;
    
    // Générer les noms des joueurs
    const playerNames = Array.from({ length: totalPlayers }, (_, i) => `Joueur ${i + 1}`);
    
    // Créer une copie de la liste des noms pour mélanger
    const shuffledNames = [...playerNames].sort(() => Math.random() - 0.5);
    
    // Créer la liste des rôles à assigner
    const rolesToAssign: RoleType[] = [];
    
    // Ajouter Mr. White
    for (let i = 0; i < numMrWhite; i++) {
      rolesToAssign.push('Mr. White');
    }
    
    // Ajouter les Undercovers
    for (let i = 0; i < numUndercovers; i++) {
      rolesToAssign.push('Undercover');
    }
    
    // Ajouter les Citoyens
    for (let i = 0; i < numCivils; i++) {
      rolesToAssign.push('Citoyen');
    }
    
    // Mélanger les rôles
    const shuffledRoles = [...rolesToAssign].sort(() => Math.random() - 0.5);
    
    // Assigner les rôles aux joueurs mélangés
    const players: Player[] = shuffledNames.map((name, index) => {
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

    const newGameState: GameState = {
      players,
      secretWords: {
        citoyen: wordPair.citoyen,
        undercover: wordPair.undercover,
      },
      currentPhase: 'AffichageRole',
      activePlayers: playerNames,
      tourActuel: 1,
      indexJoueurActuel: 0,
      currentPlayerIndexForRole: 0,
      currentPlayerIndexForSpeech: 0,
    };

    setGameState(newGameState);
  };

  // Fonction pour recommencer une partie avec les mêmes joueurs
  const restartGame = () => {
    setGameState((prev) => {
      // Compter les rôles actuels
      const numMrWhite = prev.players.filter((p) => p.role === 'Mr. White').length;
      const numUndercovers = prev.players.filter((p) => p.role === 'Undercover').length;
      const totalPlayers = prev.players.length;
      
      // Sélectionner une nouvelle paire de mots aléatoirement
      const wordPair = getRandomWordPair();
      
      // Créer la liste des rôles à assigner (même distribution)
      const rolesToAssign: RoleType[] = [];
      for (let i = 0; i < numMrWhite; i++) {
        rolesToAssign.push('Mr. White');
      }
      for (let i = 0; i < numUndercovers; i++) {
        rolesToAssign.push('Undercover');
      }
      for (let i = 0; i < totalPlayers - numMrWhite - numUndercovers; i++) {
        rolesToAssign.push('Citoyen');
      }
      
      // Mélanger les rôles
      const shuffledRoles = [...rolesToAssign].sort(() => Math.random() - 0.5);
      
      // Garder les mêmes noms de joueurs mais réassigner les rôles
      const playerNames = prev.players.map((p) => p.name);
      const shuffledNames = [...playerNames].sort(() => Math.random() - 0.5);
      
      // Assigner les nouveaux rôles et mots secrets
      const players: Player[] = shuffledNames.map((name, index) => {
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
      
      return {
        ...prev,
        players,
        secretWords: {
          citoyen: wordPair.citoyen,
          undercover: wordPair.undercover,
        },
        currentPhase: 'AffichageRole',
        activePlayers: playerNames,
        tourActuel: 1,
        indexJoueurActuel: 0,
        currentPlayerIndexForRole: 0,
        currentPlayerIndexForSpeech: 0,
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
        
        return {
          ...prev,
          players: updatedPlayers,
          currentPhase: 'FinDePartie',
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

