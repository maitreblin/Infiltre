import React from 'react';
import { useGame } from '../context/GameContext';

const FinDePartiePhase: React.FC = () => {
  const { gameState } = useGame();

  // Déterminer le gagnant
  const activePlayers = gameState.players.filter((p) => p.isActive);
  const hasUndercover = activePlayers.some((p) => p.role === 'Undercover');
  
  let winnerMessage = '';
  if (activePlayers.length === 1 && activePlayers[0].role === 'Undercover') {
    winnerMessage = "L'Undercover gagne !";
  } else if (!hasUndercover) {
    winnerMessage = 'Les Citoyens gagnent !';
  } else {
    winnerMessage = "L'Undercover gagne !";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-900 to-emerald-900 text-white">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Fin de Partie</h2>
        
        <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm mb-6 text-center">
          <p className="text-2xl font-bold mb-4">{winnerMessage}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Résumé des Rôles :</h3>
          <div className="space-y-2">
            {gameState.players.map((player) => (
              <div
                key={player.name}
                className={`p-3 rounded-lg ${
                  player.role === 'Undercover'
                    ? 'bg-red-500/30'
                    : 'bg-blue-500/30'
                }`}
              >
                <p className="font-semibold">{player.name}</p>
                <p className="text-sm text-gray-300">{player.role}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          Nouvelle Partie
        </button>
      </div>
    </div>
  );
};

export default FinDePartiePhase;

