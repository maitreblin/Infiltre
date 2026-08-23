import React, { useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { shuffle } from '../utils/shuffle';

/**
 * SpeechOrderPhase - Phase où l'ordre de parole est affiché
 */
const SpeechOrderPhase: React.FC = () => {
  const { gameState, moveToNextPhase } = useGame();

  const handleGoToVote = () => {
    moveToNextPhase('VoteElimination');
  };

  /**
   * Réorganiser l'ordre pour que Mr. White ne soit jamais en premier
   * useMemo pour éviter le re-calcul à chaque rendu
   */
  const orderedPlayers = useMemo(() => {
    const activePlayers = [...gameState.activePlayers];

    // Vérifier si le premier joueur est Mr. White
    const firstPlayer = gameState.players.find((p) => p.name === activePlayers[0]);

    if (firstPlayer?.role === 'Mr. White' && activePlayers.length > 1) {
      // Si le premier est Mr. White, on doit le déplacer
      const mrWhiteName = activePlayers[0];

      // Prendre tous les autres joueurs (non-Mr.White)
      const otherPlayers = activePlayers.slice(1);

      // Mélanger aléatoirement les autres joueurs
      const shuffled = shuffle(otherPlayers);

      // Retourner : [joueurs mélangés, Mr. White à la fin]
      return [...shuffled, mrWhiteName];
    }

    // Si le premier n'est pas Mr. White, on garde le premier en place et on mélange les autres
    const first = activePlayers[0];
    const rest = activePlayers.slice(1);
    const shuffledRest = shuffle(rest);

    return [first, ...shuffledRest];
  }, [gameState.activePlayers, gameState.players]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-orange-900 to-red-900 text-white">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-300 mb-2">Tour {gameState.tourActuel}</p>
          <h2 className="text-2xl font-bold mb-4">Tour de Parole</h2>
          <p className="text-lg text-gray-300 mb-6">
            Chaque joueur doit décrire son mot sans le nommer
          </p>
        </div>

        <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm mb-6">
          <h3 className="text-lg font-semibold mb-3 text-center">Ordre de parole :</h3>
          <div className="space-y-2">
            {orderedPlayers.map((playerName, index) => {
              return (
                <div
                  key={playerName}
                  className="flex items-center justify-between bg-white/10 rounded-lg px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-orange-400 w-6">
                      {index + 1}
                    </span>
                    <span className="font-semibold">{playerName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleGoToVote}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          Passer aux votes
        </button>
      </div>
    </div>
  );
};

export default SpeechOrderPhase;
