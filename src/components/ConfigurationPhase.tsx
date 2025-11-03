import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const ConfigurationPhase: React.FC = () => {
  const { initializeGame } = useGame();
  const [playerNames, setPlayerNames] = useState<string[]>(['']);
  const [citoyenWord, setCitoyenWord] = useState('');
  const [undercoverWord, setUndercoverWord] = useState('');

  const addPlayer = () => {
    setPlayerNames([...playerNames, '']);
  };

  const updatePlayerName = (index: number, name: string) => {
    const updated = [...playerNames];
    updated[index] = name;
    setPlayerNames(updated);
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 1) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const handleStartGame = () => {
    const validNames = playerNames.filter((name) => name.trim() !== '');
    if (validNames.length >= 3 && citoyenWord.trim() !== '' && undercoverWord.trim() !== '') {
      initializeGame(validNames, {
        citoyen: citoyenWord.trim(),
        undercover: undercoverWord.trim(),
      });
    } else {
      alert('Veuillez entrer au moins 3 joueurs et les deux mots secrets.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-900 to-blue-900 text-white">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Le Suspect</h1>
        <h2 className="text-xl font-semibold mb-6 text-center">Configuration</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Joueurs</label>
            {playerNames.map((name, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => updatePlayerName(index, e.target.value)}
                  placeholder={`Joueur ${index + 1}`}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {playerNames.length > 1 && (
                  <button
                    onClick={() => removePlayer(index)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addPlayer}
              className="w-full mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              + Ajouter un joueur
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mot Secret (Citoyen)</label>
            <input
              type="text"
              value={citoyenWord}
              onChange={(e) => setCitoyenWord(e.target.value)}
              placeholder="Ex: Banane"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mot Secret (Undercover)</label>
            <input
              type="text"
              value={undercoverWord}
              onChange={(e) => setUndercoverWord(e.target.value)}
              placeholder="Ex: Pomme"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleStartGame}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          Démarrer la partie
        </button>
      </div>
    </div>
  );
};

export default ConfigurationPhase;

