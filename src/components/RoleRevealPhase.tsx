import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

/**
 * RoleRevealPhase - Phase de distribution des cartes avec un design clair, uni et épuré.
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

  // Vue: Carte sélectionnée et mot révélé
  if (selectedCardIndex !== null && cardRevealed === selectedCardIndex) {
    const selectedPlayer = gameState.players[selectedCardIndex];
    const displayName = currentPlayerHasDefaultName ? playerName.trim() : currentPlayerName;
    const isMrWhite = selectedPlayer.role === 'Mr. White';

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20 text-center">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider mb-2">
              Carte {selectedCardIndex + 1}
            </span>
            <h2 className="text-2xl font-bold">{displayName}</h2>
          </div>

          {isMrWhite ? (
            <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-6 backdrop-blur-sm mb-6">
              <p className="text-sm text-yellow-200 mb-2 font-medium">Votre Rôle</p>
              <p className="text-3xl font-extrabold text-yellow-300 mb-3">
                Mr. White
              </p>
              <p className="text-sm text-gray-200 leading-relaxed">
                Vous n'avez aucun mot secret. Écoutez attentivement les autres joueurs et essayez de deviner leur mot !
              </p>
            </div>
          ) : (
            <div className="bg-white/20 border border-white/30 rounded-xl p-6 backdrop-blur-sm mb-6 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-300 uppercase font-medium">Mot Secret</span>
                <button
                  type="button"
                  onClick={() => setIsWordVisible(!isWordVisible)}
                  className="text-xs bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg transition-colors"
                >
                  {isWordVisible ? '👁️ Masquer' : '🔒 Afficher'}
                </button>
              </div>

              {isWordVisible ? (
                <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide py-2">
                  {selectedPlayer.secretWord}
                </p>
              ) : (
                <p className="text-3xl font-mono text-gray-400 tracking-widest py-2">
                  ••••••••
                </p>
              )}

              <p className="text-xs text-gray-300 mt-2 italic">
                Décrivez ce mot sans le prononcer pendant le tour de parole.
              </p>
            </div>
          )}

          <button
            onClick={handleCardComplete}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Carte prise
          </button>
        </div>
      </div>
    );
  }

  // Vue: Saisie du nom (nouvelle partie uniquement)
  if (selectedCardIndex !== null && cardRevealed !== selectedCardIndex && isNewGame) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20 text-center">
          <h2 className="text-2xl font-bold mb-2">Entrez votre nom</h2>
          <p className="text-sm text-gray-300 mb-6">
            Carte N° {selectedCardIndex + 1}
          </p>

          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Votre nom"
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6 text-center text-xl font-semibold"
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
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
              playerName.trim() === '' ? 'opacity-50 cursor-not-allowed transform-none' : ''
            }`}
          >
            Voir mon mot
          </button>
        </div>
      </div>
    );
  }

  // Vue: Sélection de carte (Épurée, claire et moderne)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white">
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          {isNewGame ? 'Choisissez une carte' : `${currentPlayerName}, piochez une carte`}
        </h2>
        
        <p className="text-center text-gray-300 text-sm mb-6">
          {revealedCards.size} / {gameState.players.length} cartes distribuées
        </p>

        {/* Dynamic Responsive Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-1 mb-6">
          {gameState.players.map((_, index) => {
            const isRevealed = revealedCards.has(index);

            if (isRevealed) {
              return (
                <div
                  key={index}
                  className="aspect-[3/4] rounded-2xl border border-dashed border-white/20 bg-white/5 flex items-center justify-center opacity-30 pointer-events-none"
                >
                  <span className="text-xs font-semibold text-gray-400">Prise</span>
                </div>
              );
            }

            return (
              <button
                key={index}
                onClick={() => handleCardClick(index)}
                className="aspect-[3/4] bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm rounded-2xl shadow-md transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 active:scale-95 flex flex-col items-center justify-center p-3 text-center cursor-pointer"
              >
                <div className="text-2xl sm:text-3xl font-bold mb-1 text-white opacity-90">
                  {index + 1}
                </div>
                <div className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider">
                  Carte
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-300 italic">
          Sélectionnez n'importe quelle carte restante pour la prendre
        </p>
      </div>
    </div>
  );
};

export default RoleRevealPhase;
