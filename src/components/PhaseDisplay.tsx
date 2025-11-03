import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GamePhase } from '../types/game';

/**
 * Composant PhaseDisplay
 * Gère l'affichage conditionnel de la Phase B (AffichageRole) et de la Phase C (TourDeParole)
 */
const PhaseDisplay: React.FC = () => {
  const { gameState, setGameState, moveToNextPhase } = useGame();
  const [roleRevealed, setRoleRevealed] = useState(false);

  // Phase B : Affichage du Mot Secret (sans révéler le rôle)
  if (gameState.currentPhase === 'AffichageRole') {
    const currentPlayerName = gameState.activePlayers[gameState.currentPlayerIndexForRole];
    const currentPlayer = gameState.players.find((p) => p.name === currentPlayerName);

    if (!currentPlayer) {
      return null;
    }

    const handleWordViewComplete = () => {
      // Passer au joueur suivant
      const nextIndex = gameState.currentPlayerIndexForRole + 1;
      
      if (nextIndex >= gameState.activePlayers.length) {
        // Tous les joueurs ont vu leur mot, passer à la phase TourDeParole
        moveToNextPhase('TourDeParole');
        setGameState((prev) => ({
          ...prev,
          currentPlayerIndexForSpeech: 0,
        }));
      } else {
        // Passer au joueur suivant dans l'affichage du mot
        setGameState((prev) => ({
          ...prev,
          currentPlayerIndexForRole: nextIndex,
        }));
        // Réinitialiser l'état d'affichage du mot pour le joueur suivant
        setRoleRevealed(false);
      }
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {roleRevealed ? 'Votre Mot Secret' : 'Prêt à voir votre mot ?'}
          </h2>
          
          <div className="mb-6">
            <p className="text-lg text-center mb-4">
              <span className="font-semibold">{currentPlayer.name}</span>
            </p>
            
            {!roleRevealed ? (
              <button
                onClick={() => setRoleRevealed(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Voir mon Mot Secret
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm text-gray-300 mb-2">Votre Mot Secret</p>
                  <p className="text-3xl font-bold text-center">
                    {currentPlayer.secretWord}
                  </p>
                </div>
                
                <p className="text-sm text-center text-gray-300 italic">
                  Décrivez ce mot sans le nommer pendant la discussion.
                </p>
                
                <button
                  onClick={handleWordViewComplete}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg mt-6"
                >
                  Terminé / Je suis prêt
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Phase C : Tour de Parole
  if (gameState.currentPhase === 'TourDeParole') {
    const currentPlayerName = gameState.activePlayers[gameState.currentPlayerIndexForSpeech];
    const currentPlayer = gameState.players.find((p) => p.name === currentPlayerName);

    if (!currentPlayer) {
      return null;
    }

    const handleNextPlayer = () => {
      const nextIndex = gameState.currentPlayerIndexForSpeech + 1;
      
      if (nextIndex >= gameState.activePlayers.length) {
        // Tous les joueurs ont parlé, passer à la phase de vote
        moveToNextPhase('VoteElimination');
      } else {
        // Passer au joueur suivant
        setGameState((prev) => ({
          ...prev,
          currentPlayerIndexForSpeech: nextIndex,
        }));
      }
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-orange-900 to-red-900 text-white">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-300 mb-2">Tour {gameState.tourActuel}</p>
            <h2 className="text-3xl font-bold mb-2">{currentPlayer.name}</h2>
            <p className="text-lg text-gray-300">C'est à votre tour de parler</p>
          </div>
          
          <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm mb-6">
            <p className="text-lg text-center leading-relaxed">
              Décrivez votre mot sans le nommer.
            </p>
            <p className="text-sm text-gray-300 text-center mt-4">
              Les autres joueurs doivent deviner qui est l'Undercover.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleNextPlayer}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Passer au suivant
            </button>
            
            <div className="text-center text-sm text-gray-300">
              Joueur {gameState.currentPlayerIndexForSpeech + 1} / {gameState.activePlayers.length}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si aucune des phases gérées, retourner null
  return null;
};

export default PhaseDisplay;

