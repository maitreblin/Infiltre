import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const VoteEliminationPhase: React.FC = () => {
  const { gameState, eliminatePlayer } = useGame();
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [eliminationResult, setEliminationResult] = useState<{
    eliminated: string;
    role: string;
  } | null>(null);

  const handleEliminate = () => {
    if (!selectedPlayer) {
      alert('Veuillez sélectionner un joueur à éliminer.');
      return;
    }

    const eliminatedPlayer = gameState.players.find((p) => p.name === selectedPlayer);
    if (eliminatedPlayer) {
      setEliminationResult({
        eliminated: eliminatedPlayer.name,
        role: eliminatedPlayer.role,
      });
      
      // Attendre un peu avant d'éliminer effectivement le joueur
      setTimeout(() => {
        eliminatePlayer(selectedPlayer);
      }, 3000);
    }
  };

  if (eliminationResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-900 to-orange-900 text-white">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">Résultat de l'Élimination</h2>
          <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm mb-6">
            <p className="text-lg mb-2">
              <span className="font-bold">{eliminationResult.eliminated}</span>
            </p>
            <p className="text-2xl font-bold">
              était un <span className="text-yellow-400">{eliminationResult.role}</span>
            </p>
          </div>
          <p className="text-sm text-gray-300">Passage automatique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-900 to-pink-900 text-white">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Vote d'Élimination</h2>
        <p className="text-center text-gray-300 mb-6">
          Sélectionnez le joueur à éliminer
        </p>

        <div className="space-y-3 mb-6">
          {gameState.activePlayers.map((playerName) => (
            <button
              key={playerName}
              onClick={() => setSelectedPlayer(playerName)}
              className={`w-full px-4 py-3 rounded-xl transition-all ${
                selectedPlayer === playerName
                  ? 'bg-red-600 ring-4 ring-red-400'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {playerName}
            </button>
          ))}
        </div>

        <button
          onClick={handleEliminate}
          disabled={!selectedPlayer}
          className={`w-full font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
            selectedPlayer
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          Éliminer
        </button>
      </div>
    </div>
  );
};

export default VoteEliminationPhase;

