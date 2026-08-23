import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

/**
 * RoleRevealPhase - Phase moderne où les joueurs prennent leurs cartes et découvrent leurs rôles
 */
const RoleRevealPhase: React.FC = () => {
  const { gameState, setGameState, moveToNextPhase } = useGame();
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState<string>('');
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [cardRevealed, setCardRevealed] = useState<number | null>(null);
  const [isWordVisible, setIsWordVisible] = useState<boolean>(true);

  // Réinitialiser l'état quand on entre dans cette phase
  useEffect(() => {
    setRevealedCards(new Set());
    setSelectedCardIndex(null);
    setCardRevealed(null);
    setIsWordVisible(true);
  }, []);

  // Passer automatiquement à la phase suivante quand toutes les cartes sont prises
  useEffect(() => {
    if (
      revealedCards.size === gameState.players.length &&
      gameState.players.length > 0
    ) {
      setGameState((prev) => ({
        ...prev,
        currentPlayerIndexForSpeech: 0,
      }));
      moveToNextPhase('TourDeParole');
    }
  }, [revealedCards.size, gameState.players.length, setGameState, moveToNextPhase]);

  const currentPlayerIndex = gameState.currentPlayerIndexForRole;
  const currentPlayer = gameState.players[currentPlayerIndex];
  const currentPlayerName = currentPlayer?.name || `Joueur ${currentPlayerIndex + 1}`;

  // Vérifier si c'est une nouvelle partie ou un redémarrage
  const allPlayersHaveDefaultNames = gameState.players.every((p) => /^Joueur \d+$/.test(p.name));
  const currentPlayerHasDefaultName = /^Joueur \d+$/.test(currentPlayerName);
  const isNewGame = allPlayersHaveDefaultNames || currentPlayerHasDefaultName;

  const handleCardClick = (cardIndex: number) => {
    setSelectedCardIndex(cardIndex);
    setPlayerName('');
    setIsWordVisible(true);
    if (!isNewGame) {
      setCardRevealed(cardIndex);
    } else {
      setCardRevealed(null);
    }
  };

  const handleNameSubmit = () => {
    if (playerName.trim() === '') return;
    setCardRevealed(selectedCardIndex);
  };

  const handleCardComplete = () => {
    if (selectedCardIndex === null) return;

    const needsNameUpdate = currentPlayerHasDefaultName;
    const finalPlayerName = needsNameUpdate ? playerName.trim() : currentPlayerName;

    const newRevealedCards = new Set(revealedCards);
    newRevealedCards.add(selectedCardIndex);
    setRevealedCards(newRevealedCards);

    if (needsNameUpdate) {
      setGameState((prev) => {
        const updatedPlayers = prev.players.map((p, index) =>
          index === currentPlayerIndex ? { ...p, name: finalPlayerName } : p
        );
        const updatedActivePlayers = updatedPlayers.map((p) => p.name);

        const nextIndex = prev.currentPlayerIndexForRole + 1;
        return {
          ...prev,
          players: updatedPlayers,
          activePlayers: updatedActivePlayers,
          currentPlayerIndexForRole: nextIndex,
        };
      });
    } else {
      setGameState((prev) => {
        const nextIndex = prev.currentPlayerIndexForRole + 1;
        return {
          ...prev,
          currentPlayerIndexForRole: nextIndex,
        };
      });
    }

    setSelectedCardIndex(null);
    setPlayerName('');
    setCardRevealed(null);
    setIsWordVisible(true);
  };

  const progressPercent = gameState.players.length > 0 
    ? Math.round((revealedCards.size / gameState.players.length) * 100) 
    : 0;

  // Vue: Carte sélectionnée et mot révélé
  if (selectedCardIndex !== null && cardRevealed === selectedCardIndex) {
    const selectedPlayer = gameState.players[selectedCardIndex];
    const displayName = currentPlayerHasDefaultName ? playerName.trim() : currentPlayerName;
    const isMrWhite = selectedPlayer.role === 'Mr. White';

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white relative overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-fadeIn">
          {/* Badge Joueur */}
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-2">
              Carte N° {selectedCardIndex + 1}
            </span>
            <h2 className="text-2xl font-bold tracking-tight">{displayName}</h2>
          </div>

          {/* Identity Card Display */}
          <div className={`rounded-2xl p-6 mb-6 backdrop-blur-md border relative overflow-hidden transition-all shadow-xl ${
            isMrWhite 
              ? 'bg-gradient-to-br from-amber-950/80 via-yellow-900/50 to-slate-900/90 border-amber-500/40 shadow-amber-500/10'
              : selectedPlayer.role === 'Undercover'
              ? 'bg-gradient-to-br from-purple-950/80 via-fuchsia-950/50 to-slate-900/90 border-purple-500/40 shadow-purple-500/10'
              : 'bg-gradient-to-br from-emerald-950/80 via-teal-950/50 to-slate-900/90 border-emerald-500/40 shadow-emerald-500/10'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                {isMrWhite ? 'Rôle Secret' : 'Mot Secret'}
              </span>
              <button
                type="button"
                onClick={() => setIsWordVisible(!isWordVisible)}
                className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 border border-white/10"
              >
                {isWordVisible ? '👁️ Masquer' : '🔒 Afficher'}
              </button>
            </div>

            {isMrWhite ? (
              <div className="text-center py-4">
                <div className="text-5xl mb-3 animate-bounce">🎭</div>
                <div className="text-2xl font-black text-amber-400 tracking-wide uppercase mb-2">
                  Mr. White
                </div>
                <p className="text-sm text-amber-200/80 leading-relaxed font-light">
                  Vous ne connaissez aucun mot. Infiltrez-vous et devinez le mot des civils pendant les échanges !
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">
                  {selectedPlayer.role === 'Undercover' ? '🕵️‍♂️' : '🛡️'}
                </div>
                {isWordVisible ? (
                  <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 tracking-wider py-2 select-none">
                    {selectedPlayer.secretWord}
                  </div>
                ) : (
                  <div className="text-3xl font-mono tracking-widest text-gray-500 py-2 select-none">
                    ••••••••
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2 font-light italic">
                  Décrivez ce mot sans le prononcer pendant le tour de parole.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleCardComplete}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 text-base"
          >
            <span>J'ai retenu ma carte</span>
            <span className="text-xl">🔒</span>
          </button>
        </div>
      </div>
    );
  }

  // Vue: Saisie du nom (nouvelle partie uniquement)
  if (selectedCardIndex !== null && cardRevealed !== selectedCardIndex && isNewGame) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-fadeIn text-center">
          <div className="w-16 h-16 bg-indigo-600/30 border border-indigo-400/30 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            👤
          </div>
          <h2 className="text-2xl font-bold mb-2">Qui s'empare de cette carte ?</h2>
          <p className="text-sm text-gray-400 mb-6">
            Carte N° {selectedCardIndex + 1} • Entrez votre prénom
          </p>

          <div className="space-y-4">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Ex: Alexandre, Sarah..."
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-xl font-semibold transition-all shadow-inner"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && playerName.trim() !== '') {
                  handleNameSubmit();
                }
              }}
              autoFocus
            />

            <button
              onClick={handleNameSubmit}
              disabled={playerName.trim() === ''}
              className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-2 ${
                playerName.trim() === '' ? 'opacity-50 cursor-not-allowed transform-none' : ''
              }`}
            >
              <span>Découvrir mon rôle</span>
              <span className="text-lg">👁️</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vue: Sélection de carte moderne
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative">
      {/* Background glow ambiance */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Container */}
      <div className="w-full max-w-4xl pt-4 pb-2 text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <span>🎴 Phase de Distribution</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          {isNewGame ? 'Choisissez une carte' : `${currentPlayerName}, piochez une carte`}
        </h2>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          Chaque joueur clique sur une carte mystère pour découvrir son mot secret.
        </p>

        {/* Progress bar & badge */}
        <div className="mt-4 max-w-xs mx-auto">
          <div className="flex justify-between items-center text-xs text-gray-400 mb-1.5 font-medium">
            <span>Progression</span>
            <span className="text-indigo-400 font-bold">{revealedCards.size} / {gameState.players.length} cartes</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Grid Container */}
      <div className="w-full max-w-4xl my-auto py-4 z-10">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 max-h-[65vh] overflow-y-auto custom-scrollbar p-2">
          {gameState.players.map((_, index) => {
            const isRevealed = revealedCards.has(index);

            if (isRevealed) {
              return (
                <div
                  key={index}
                  className="aspect-[2/3] rounded-2xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center opacity-30 pointer-events-none transition-all"
                >
                  <span className="text-xs font-mono text-gray-500">✓</span>
                </div>
              );
            }

            return (
              <button
                key={index}
                onClick={() => handleCardClick(index)}
                className="group relative aspect-[2/3] rounded-2xl bg-gradient-to-b from-indigo-950/80 via-slate-900/90 to-purple-950/90 border border-indigo-500/30 hover:border-cyan-400/80 backdrop-blur-md shadow-lg shadow-black/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 active:scale-95 flex flex-col justify-between p-3 overflow-hidden"
              >
                {/* Corner Number Badge */}
                <div className="flex justify-between items-center w-full">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 border border-white/10">
                    #{String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-gray-500 font-serif opacity-40">♦</span>
                </div>

                {/* Center Spy Mystery Emblem */}
                <div className="my-auto flex flex-col items-center justify-center gap-1 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center text-xl sm:text-2xl text-cyan-300 shadow-inner group-hover:bg-cyan-500/20 group-hover:border-cyan-400/40 transition-colors">
                    🕵️‍♂️
                  </div>
                  <span className="text-[11px] font-semibold text-gray-300 group-hover:text-cyan-300 transition-colors tracking-wide">
                    Pioche
                  </span>
                </div>

                {/* Bottom Card Footer */}
                <div className="flex justify-between items-center w-full">
                  <span className="text-[10px] text-gray-500 font-serif opacity-40">♦</span>
                  <span className="text-[9px] text-indigo-400/70 font-mono tracking-tighter uppercase">
                    Le Suspect
                  </span>
                </div>

                {/* Shimmer / Glow overlay effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-4xl text-center py-2 z-10">
        <p className="text-xs text-gray-500">
          Chaque carte est confidentielle • Passez le téléphone au joueur désigné
        </p>
      </div>
    </div>
  );
};

export default RoleRevealPhase;
