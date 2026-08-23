import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

/**
 * RoleRevealPhase - Phase où les joueurs prennent leurs cartes et découvrent leurs rôles
 */
const RoleRevealPhase: React.FC = () => {
  const { gameState, setGameState, moveToNextPhase } = useGame();
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState<string>('');
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [cardRevealed, setCardRevealed] = useState<number | null>(null);

  // Réinitialiser l'état quand on entre dans cette phase
  useEffect(() => {
    setRevealedCards(new Set());
    setSelectedCardIndex(null);
    setCardRevealed(null);
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
    // Pour un redémarrage, on affiche directement le mot
    // Pour une nouvelle partie, on demande d'abord le nom
    if (!isNewGame) {
      setCardRevealed(cardIndex);
    } else {
      setCardRevealed(null);
    }
  };

  const handleNameSubmit = () => {
    if (playerName.trim() === '') {
      return;
    }
    setCardRevealed(selectedCardIndex);
  };

  const handleCardComplete = () => {
    if (selectedCardIndex === null) return;

    const needsNameUpdate = currentPlayerHasDefaultName;
    const finalPlayerName = needsNameUpdate ? playerName.trim() : currentPlayerName;

    // Marquer la carte comme révélée
    const newRevealedCards = new Set(revealedCards);
    newRevealedCards.add(selectedCardIndex);
    setRevealedCards(newRevealedCards);

    // Mettre à jour le nom du joueur si nécessaire
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

    // Réinitialiser
    setSelectedCardIndex(null);
    setPlayerName('');
    setCardRevealed(null);
  };

  // Vue: Carte sélectionnée et mot révélé
  if (selectedCardIndex !== null && cardRevealed === selectedCardIndex) {
    const selectedPlayer = gameState.players[selectedCardIndex];
    const displayName = currentPlayerHasDefaultName ? playerName.trim() : currentPlayerName;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {selectedPlayer.role === 'Mr. White' ? 'Votre Rôle' : 'Votre Mot Secret'}
          </h2>

          <div className="mb-6">
            <p className="text-lg text-center mb-4">
              <span className="font-semibold">{displayName}</span>
            </p>

            {selectedPlayer.role === 'Mr. White' ? (
              <>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm mb-4">
                  <p className="text-sm text-gray-300 mb-2">Votre Rôle</p>
                  <p className="text-3xl font-bold text-center text-yellow-400">
                    Vous êtes Mr. White
                  </p>
                </div>

                <p className="text-sm text-center text-gray-300 italic mb-6">
                  Vous ne connaissez aucun mot secret. Votre objectif est de survivre et de découvrir les mots pendant la discussion.
                </p>
              </>
            ) : (
              <>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm mb-4">
                  <p className="text-sm text-gray-300 mb-2">Votre Mot Secret</p>
                  <p className="text-3xl font-bold text-center">
                    {selectedPlayer.secretWord}
                  </p>
                </div>

                <p className="text-sm text-center text-gray-300 italic mb-6">
                  Décrivez ce mot sans le nommer pendant la discussion.
                </p>
              </>
            )}

            <button
              onClick={handleCardComplete}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Carte prise
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vue: Saisie du nom (nouvelle partie uniquement)
  if (selectedCardIndex !== null && cardRevealed !== selectedCardIndex && isNewGame) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Entrez votre nom</h2>

          <div className="mb-6">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Votre nom"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-center text-xl"
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
                playerName.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Voir mon mot
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vue: Sélection de carte
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isNewGame ? 'Choisissez une carte' : `${currentPlayerName}, prenez une carte`}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {gameState.players.map((_, index) => {
            const isRevealed = revealedCards.has(index);

            if (isRevealed) {
              return null; // Ne pas afficher les cartes déjà prises
            }

            return (
              <button
                key={index}
                onClick={() => handleCardClick(index)}
                className="aspect-[2/3] bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center border-2 border-white/30"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">🃏</div>
                  <div className="text-sm font-semibold">Carte {index + 1}</div>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-gray-300 mt-6">
          {revealedCards.size} / {gameState.players.length} cartes prises
        </p>
      </div>
    </div>
  );
};

export default RoleRevealPhase;
