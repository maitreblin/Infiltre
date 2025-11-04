import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

/**
 * Composant PhaseDisplay
 * Gère l'affichage conditionnel de la Phase B (AffichageRole) et de la Phase C (TourDeParole)
 */
const PhaseDisplay: React.FC = () => {
  const { gameState, setGameState, moveToNextPhase } = useGame();
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState<string>('');
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [cardRevealed, setCardRevealed] = useState<number | null>(null);

  // Réinitialiser revealedCards quand on entre dans la phase AffichageRole
  useEffect(() => {
    if (gameState.currentPhase === 'AffichageRole') {
      setRevealedCards(new Set());
      setSelectedCardIndex(null);
      setCardRevealed(null);
    }
  }, [gameState.currentPhase]);

  // Effet pour passer automatiquement à la phase suivante quand toutes les cartes sont prises
  useEffect(() => {
    if (
      gameState.currentPhase === 'AffichageRole' &&
      revealedCards.size === gameState.players.length &&
      gameState.players.length > 0
    ) {
      // Toutes les cartes sont prises, passer à la phase suivante
      setGameState((prev) => ({
        ...prev,
        currentPlayerIndexForSpeech: 0,
      }));
      moveToNextPhase('TourDeParole');
    }
  }, [revealedCards.size, gameState.players.length, gameState.currentPhase, setGameState, moveToNextPhase]);

  // Phase B : Affichage avec cartes
  if (gameState.currentPhase === 'AffichageRole') {
    // Trouver le joueur actuel qui doit prendre une carte
    const currentPlayerIndex = gameState.currentPlayerIndexForRole;
    const currentPlayer = gameState.players[currentPlayerIndex];
    const currentPlayerName = currentPlayer?.name || `Joueur ${currentPlayerIndex + 1}`;
    
    // Vérifier si c'est une nouvelle partie (noms par défaut) ou un Recommencer (noms personnalisés)
    // On vérifie si TOUS les joueurs ont encore des noms par défaut (nouvelle partie)
    // OU si le joueur actuel a encore un nom par défaut (on continue à demander les noms)
    const allPlayersHaveDefaultNames = gameState.players.every((p) => /^Joueur \d+$/.test(p.name));
    const currentPlayerHasDefaultName = /^Joueur \d+$/.test(currentPlayerName);
    // Si tous les joueurs ont des noms par défaut, c'est une nouvelle partie
    // Si seulement le joueur actuel a un nom par défaut, on continue à demander les noms
    const isNewGame = allPlayersHaveDefaultNames || currentPlayerHasDefaultName;

    const handleCardClick = (cardIndex: number) => {
      setSelectedCardIndex(cardIndex);
      setPlayerName('');
      // Pour un Recommencer, on affiche directement le mot (pas besoin de demander le nom)
      // Pour une nouvelle partie, on demande d'abord le nom
      if (!isNewGame) {
        setCardRevealed(cardIndex);
      } else {
        setCardRevealed(null);
      }
    };

    const handleNameSubmit = () => {
      if (playerName.trim() === '') {
        alert('Veuillez entrer votre nom.');
        return;
      }
      setCardRevealed(selectedCardIndex);
    };

    const handleCardComplete = () => {
      if (selectedCardIndex === null) return;

      // Vérifier si le joueur actuel a encore un nom par défaut (nouvelle partie)
      const needsNameUpdate = currentPlayerHasDefaultName;
      const finalPlayerName = needsNameUpdate ? playerName.trim() : currentPlayerName;

      // Marquer la carte comme révélée
      const newRevealedCards = new Set(revealedCards);
      newRevealedCards.add(selectedCardIndex);

      // Mettre à jour l'état des cartes révélées
      setRevealedCards(newRevealedCards);

      // Mettre à jour le nom du joueur si c'est une nouvelle partie (le joueur a encore un nom par défaut)
      if (needsNameUpdate) {
        setGameState((prev) => {
          // Mettre à jour le nom du joueur actuel (celui qui prend la carte)
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
        // Pour un Recommencer, juste passer au joueur suivant
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
      // L'effet useEffect se chargera de passer à la phase suivante si nécessaire
    };

    // Si une carte est sélectionnée et le mot est révélé
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

    // Si une carte est sélectionnée mais le nom n'est pas encore entré (seulement pour nouvelle partie)
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


    // Affichage des cartes disponibles
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
  }

  // Phase C : Tour de Parole
  if (gameState.currentPhase === 'TourDeParole') {
    const handleGoToVote = () => {
      moveToNextPhase('VoteElimination');
    };

    // Réorganiser l'ordre pour que Mr. White ne soit jamais en premier
    const getOrderedPlayers = () => {
      const ordered = [...gameState.activePlayers];
      
      // Vérifier si le premier joueur est Mr. White
      const firstPlayer = gameState.players.find((p) => p.name === ordered[0]);
      
      if (firstPlayer?.role === 'Mr. White' && ordered.length > 1) {
        // Si le premier est Mr. White, on doit le déplacer
        const mrWhiteName = ordered[0]; // Le Mr. White qui était en premier
        
        // Prendre tous les autres joueurs (non-Mr.White)
        const otherPlayers = ordered.slice(1);
        
        // Mélanger aléatoirement les autres joueurs
        const shuffled = [...otherPlayers].sort(() => Math.random() - 0.5);
        
        // Retourner : [premier joueur non-Mr.White, ...mélange aléatoire, Mr. White]
        return [...shuffled, mrWhiteName];
      }
      
      // Si le premier n'est pas Mr. White, on peut juste mélanger le reste
      // mais on garde le premier en place et on mélange les autres
      const first = ordered[0];
      const rest = ordered.slice(1);
      const shuffledRest = [...rest].sort(() => Math.random() - 0.5);
      
      return [first, ...shuffledRest];
    };

    const orderedPlayers = getOrderedPlayers();

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
  }

  // Si aucune des phases gérées, retourner null
  return null;
};

export default PhaseDisplay;

