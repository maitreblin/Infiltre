import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const VoteEliminationPhase: React.FC = () => {
  const { gameState, eliminatePlayer, checkMrWhiteGuess } = useGame();
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [eliminationResult, setEliminationResult] = useState<{
    eliminated: string;
    role: string;
  } | null>(null);
  const [showMrWhiteGuess, setShowMrWhiteGuess] = useState<boolean>(false);
  const [guessedWord, setGuessedWord] = useState<string>('');
  const [guessResult, setGuessResult] = useState<'correct' | 'incorrect' | null>(null);

  const handleEliminate = () => {
    if (!selectedPlayer) {
      alert('Veuillez sélectionner un joueur à éliminer.');
      return;
    }

    const eliminatedPlayer = gameState.players.find((p) => p.name === selectedPlayer);
    if (eliminatedPlayer) {
      // Si c'est un Mr. White, afficher l'écran de devinette
      if (eliminatedPlayer.role === 'Mr. White') {
        setShowMrWhiteGuess(true);
        setEliminationResult({
          eliminated: eliminatedPlayer.name,
          role: eliminatedPlayer.role,
        });
      } else {
        // Pour les autres rôles, affichage normal
        setEliminationResult({
          eliminated: eliminatedPlayer.name,
          role: eliminatedPlayer.role,
        });
        
        // Attendre un peu avant d'éliminer effectivement le joueur
        setTimeout(() => {
          eliminatePlayer(selectedPlayer);
        }, 3000);
      }
    }
  };

  const handleMrWhiteGuessSubmit = () => {
    if (guessedWord.trim() === '') {
      alert('Veuillez entrer un mot.');
      return;
    }

    const isCorrect = checkMrWhiteGuess(guessedWord, selectedPlayer);
    setGuessResult(isCorrect ? 'correct' : 'incorrect');
  };

  // Écran de devinette pour Mr. White
  if (showMrWhiteGuess && eliminationResult) {
    if (guessResult === 'correct') {
      // La transition sera gérée automatiquement par le GameContext
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-900 to-emerald-900 text-white">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl text-center">
            <h2 className="text-2xl font-bold mb-4">🎉 Victoire !</h2>
            <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm mb-6">
              <p className="text-lg mb-2">
                <span className="font-bold">{eliminationResult.eliminated}</span> a trouvé le mot !
              </p>
              <p className="text-xl font-bold text-green-400 mb-2">
                Le mot était : {gameState.secretWords.citoyen}
              </p>
              <p className="text-lg font-semibold">
                Mr. White et Undercover gagnent !
              </p>
            </div>
            <p className="text-sm text-gray-300">Passage à la fin de partie...</p>
          </div>
        </div>
      );
    }

    if (guessResult === 'incorrect') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-red-900 to-orange-900 text-white">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl text-center">
            <h2 className="text-2xl font-bold mb-4">Mauvaise réponse</h2>
            <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm mb-6">
              <p className="text-lg mb-2">
                <span className="font-bold">{eliminationResult.eliminated}</span>
              </p>
              <p className="text-xl font-bold mb-2">
                était un <span className="text-yellow-400">{eliminationResult.role}</span>
              </p>
              <p className="text-sm text-gray-300">
                Le mot était : {gameState.secretWords.citoyen}
              </p>
            </div>
            <p className="text-sm text-gray-300">Passage automatique...</p>
          </div>
        </div>
      );
    }

    // Écran de saisie de la devinette
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-yellow-900 to-orange-900 text-white">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {eliminationResult.eliminated} était Mr. White
          </h2>
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm mb-6">
            <p className="text-lg text-center mb-4">
              Vous avez une dernière chance !
            </p>
            <p className="text-sm text-center text-gray-300 mb-4">
              Si vous trouvez le mot des civils, vous gagnez avec les Undercover.
            </p>
            <input
              type="text"
              value={guessedWord}
              onChange={(e) => setGuessedWord(e.target.value)}
              placeholder="Entrez le mot que vous pensez être celui des civils"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-center"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && guessedWord.trim() !== '') {
                  handleMrWhiteGuessSubmit();
                }
              }}
              autoFocus
            />
          </div>
          <button
            onClick={handleMrWhiteGuessSubmit}
            disabled={guessedWord.trim() === ''}
            className={`w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
              guessedWord.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Valider
          </button>
        </div>
      </div>
    );
  }

  // Écran de résultat d'élimination pour les autres rôles
  if (eliminationResult && !showMrWhiteGuess) {
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

