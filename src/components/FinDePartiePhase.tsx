import React from 'react';
import { useGame } from '../context/GameContext';

const FinDePartiePhase: React.FC = () => {
  const { gameState, restartGame, moveToNextPhase } = useGame();

  // Déterminer le gagnant
  const activePlayers = gameState.players.filter((p) => p.isActive);
  const hasUndercover = activePlayers.some((p) => p.role === 'Undercover');
  const hasMrWhite = activePlayers.some((p) => p.role === 'Mr. White');

  // Si Mr. White a gagné en devinant le mot, victoire pour Mr. White et Undercover
  let winnerMessage = '';
  let winnerSubtitle = '';
  if (gameState.mrWhiteWonByGuessing) {
    winnerMessage = '🎉 Victoire de Mr. White & Undercover !';
    winnerSubtitle = 'Mr. White a réussi à deviner le mot des civils.';
  } else if (activePlayers.length === 1) {
    const winner = activePlayers[0];
    if (winner.role === 'Undercover') {
      winnerMessage = "🎉 L'Undercover l'emporte !";
      winnerSubtitle = 'Tous les civils ont été éliminés.';
    } else if (winner.role === 'Mr. White') {
      winnerMessage = '🎉 Mr. White & Undercover gagnent !';
      winnerSubtitle = 'Mr. White est le dernier survivant.';
    } else {
      winnerMessage = '🎉 Les Citoyens l\'emportent !';
      winnerSubtitle = 'Tous les infiltrés ont été démasqués.';
    }
  } else if (hasUndercover || hasMrWhite) {
    winnerMessage = '🎉 Mr. White & Undercover gagnent !';
    winnerSubtitle = 'Les infiltrés ont réussi à survivre.';
  } else {
    winnerMessage = '🎉 Les Citoyens l\'emportent !';
    winnerSubtitle = 'Tous les infiltrés ont été éliminés.';
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-8 bg-gradient-to-br from-green-950 via-teal-900 to-emerald-950 text-white">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold mb-2 text-center tracking-tight">Fin de Partie</h2>
        
        {/* Message de victoire */}
        <div className="bg-white/20 border border-white/25 rounded-2xl p-5 backdrop-blur-sm mb-6 text-center shadow-lg">
          <p className="text-xl sm:text-2xl font-black mb-1">{winnerMessage}</p>
          <p className="text-xs sm:text-sm text-gray-200 font-light">{winnerSubtitle}</p>
        </div>

        {/* Rappel des Mots Secrets en jeu */}
        <div className="bg-white/15 border border-white/20 rounded-2xl p-4 mb-6 backdrop-blur-sm space-y-2.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300 text-center mb-1">
            Les Mots Secrets de la partie
          </h3>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-blue-600/30 border border-blue-400/30 rounded-xl p-2.5">
              <p className="text-[11px] text-blue-200 uppercase font-medium">Mot Civils</p>
              <p className="text-base font-extrabold text-white">{gameState.secretWords.citoyen}</p>
            </div>
            <div className="bg-purple-600/30 border border-purple-400/30 rounded-xl p-2.5">
              <p className="text-[11px] text-purple-200 uppercase font-medium">Mot Undercover</p>
              <p className="text-base font-extrabold text-white">{gameState.secretWords.undercover}</p>
            </div>
          </div>
        </div>

        {/* Détail Joueur par Joueur */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
            Rôles & Mots des joueurs :
          </h3>
          <div className="space-y-2 max-h-[38vh] overflow-y-auto custom-scrollbar pr-1">
            {gameState.players.map((player) => {
              const isUndercover = player.role === 'Undercover';
              const isMrWhite = player.role === 'Mr. White';

              return (
                <div
                  key={player.name}
                  className={`p-3 rounded-xl border transition-all ${
                    isUndercover
                      ? 'bg-purple-900/40 border-purple-500/30'
                      : isMrWhite
                      ? 'bg-yellow-900/40 border-yellow-500/30'
                      : 'bg-blue-900/40 border-blue-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white">{player.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isUndercover
                          ? 'bg-purple-500/30 text-purple-200 border border-purple-400/30'
                          : isMrWhite
                          ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-400/30'
                          : 'bg-blue-500/30 text-blue-200 border border-blue-400/30'
                      }`}>
                        {player.role}
                      </span>
                      {!player.isActive && (
                        <span className="text-[10px] font-bold text-red-400 bg-red-950/60 border border-red-500/40 px-1.5 py-0.5 rounded">
                          Éliminé
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-300">
                    {isMrWhite ? (
                      <span className="italic text-yellow-300/80">Aucun mot (infiltré sans mot)</span>
                    ) : (
                      <span>
                        Mot attribué : <b className="text-white tracking-wide">{player.secretWord}</b>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="space-y-2.5">
          <button
            onClick={restartGame}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg text-base"
          >
            Rejouer (Mêmes joueurs)
          </button>
          
          <button
            onClick={() => moveToNextPhase('Configuration')}
            className="w-full bg-white/15 hover:bg-white/25 border border-white/20 text-white font-semibold py-3 px-6 rounded-2xl transition-all shadow text-sm"
          >
            Retour à la configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinDePartiePhase;
