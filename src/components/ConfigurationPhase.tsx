import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { useToast } from '../context/ToastContext';
import {
  calculateCivils,
  calculateMaxUndercovers,
  calculateMaxMrWhite,
  validateConfiguration,
} from '../utils/gameRules';
import { getAllAvailableThemes } from '../data/wordPairs';
import WordManagerSection from './WordManagerSection';

const ConfigurationPhase: React.FC = () => {
  const { gameState, initializeGame } = useGame();
  const { showToast } = useToast();
  const [totalPlayers, setTotalPlayers] = useState<number>(6);
  const [numUndercovers, setNumUndercovers] = useState<number>(2);
  const [numMrWhite, setNumMrWhite] = useState<number>(0);
  const [selectedTheme, setSelectedTheme] = useState<string>(gameState.selectedTheme || 'ALL');
  const [themesList, setThemesList] = useState(() => getAllAvailableThemes());

  const refreshThemes = useCallback(() => {
    const updated = getAllAvailableThemes();
    setThemesList(updated);
    // Vérifier si le thème sélectionné existe toujours
    if (!updated.some((t) => t.id === selectedTheme)) {
      setSelectedTheme('ALL');
    }
  }, [selectedTheme]);

  // Calcul automatique du nombre de Civils selon les règles
  const calculatedCivils = calculateCivils(totalPlayers, numUndercovers, numMrWhite);

  // Ajustement automatique des Undercover et Mr White quand le total change
  useEffect(() => {
    const maxUndercovers = calculateMaxUndercovers(totalPlayers, numMrWhite);
    const maxMrWhite = calculateMaxMrWhite(totalPlayers, numUndercovers);

    // Ajuster Undercover si nécessaire
    if (numUndercovers > maxUndercovers) {
      const newUndercovers = Math.max(0, maxUndercovers);
      setNumUndercovers(newUndercovers);

      // Recalculer Mr White avec la nouvelle valeur
      const newMaxMrWhite = calculateMaxMrWhite(totalPlayers, newUndercovers);
      if (numMrWhite > newMaxMrWhite) {
        setNumMrWhite(Math.max(0, newMaxMrWhite));
      }
    }

    // Ajuster Mr White si nécessaire
    if (numMrWhite > maxMrWhite) {
      const newMrWhite = Math.max(0, maxMrWhite);
      setNumMrWhite(newMrWhite);

      // Recalculer Undercover avec la nouvelle valeur
      const newMaxUndercovers = calculateMaxUndercovers(totalPlayers, newMrWhite);
      if (numUndercovers > newMaxUndercovers) {
        setNumUndercovers(Math.max(0, newMaxUndercovers));
      }
    }
  }, [totalPlayers]);

  // Validation des règles
  const validation = validateConfiguration(
    totalPlayers,
    numUndercovers,
    numMrWhite,
    calculatedCivils
  );

  const handleUndercoversChange = (delta: number) => {
    setNumUndercovers((prev) => {
      const newValue = prev + delta;
      const maxValue = calculateMaxUndercovers(totalPlayers, numMrWhite);
      return Math.max(0, Math.min(maxValue, newValue));
    });
  };

  const handleMrWhiteChange = (delta: number) => {
    setNumMrWhite((prev) => {
      const newValue = prev + delta;
      const maxValue = calculateMaxMrWhite(totalPlayers, numUndercovers);
      return Math.max(0, Math.min(maxValue, newValue));
    });
  };

  const handleStartGame = () => {
    if (totalPlayers < 3) {
      showToast('Il faut au moins 3 joueurs.', 'error');
      return;
    }

    if (!validation.isValid && validation.errorMessage) {
      showToast(validation.errorMessage, 'error');
      return;
    }

    initializeGame(totalPlayers, numUndercovers, numMrWhite, selectedTheme);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-8 bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white">
      {/* Carte Principale de Configuration */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
        <h1 className="text-3xl font-bold mb-2 text-center tracking-tight">Le Suspect</h1>
        <h2 className="text-lg font-semibold mb-6 text-center text-indigo-200">Configuration de la partie</h2>

        <div className="space-y-6 mb-6">
          {/* Sélecteur de Thème */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2 text-center">
              Thème des mots secrets
            </label>
            <div className="relative">
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="w-full appearance-none bg-white/15 hover:bg-white/20 border border-white/30 text-white py-3 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-medium cursor-pointer transition-all pr-10"
              >
                {themesList.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                    {t.name} ({t.count} paires)
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/70">
                ▼
              </div>
            </div>
          </div>

          {/* Slider pour le nombre total de joueurs */}
          <div>
            <label className="block text-lg font-medium mb-3 text-center">
              Joueurs : <span className="text-2xl font-bold text-blue-300">{totalPlayers}</span>
            </label>
            <input
              type="range"
              min="3"
              max="25"
              value={totalPlayers}
              onChange={(e) => setTotalPlayers(parseInt(e.target.value, 10))}
              className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
              style={{
                background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${((totalPlayers - 3) / (25 - 3)) * 100}%, rgba(255,255,255,0.2) ${((totalPlayers - 3) / (25 - 3)) * 100}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              <span>3</span>
              <span>25</span>
            </div>
          </div>

          {/* Affichage des rôles avec boutons +/- */}
          <div className="space-y-3">
            {/* Civils - lecture seule */}
            <div className="flex items-center justify-between bg-blue-600/80 rounded-2xl px-6 py-3.5 shadow-md">
              <span className="font-bold text-base sm:text-lg">Civils</span>
              <span className="text-2xl font-bold">{calculatedCivils}</span>
            </div>

            {/* Undercover - avec boutons +/- */}
            <div className="flex items-center justify-between bg-gray-800/80 rounded-2xl px-6 py-3.5 shadow-md">
              <span className="font-bold text-base sm:text-lg">Undercover</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleUndercoversChange(-1)}
                  disabled={numUndercovers <= 0}
                  className="w-9 h-9 flex items-center justify-center bg-gray-700 hover:bg-gray-600 disabled:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed rounded-full transition-all font-bold text-lg"
                >
                  -
                </button>
                <span className="text-2xl font-bold min-w-[2rem] text-center">{numUndercovers}</span>
                <button
                  onClick={() => handleUndercoversChange(1)}
                  disabled={numUndercovers >= calculateMaxUndercovers(totalPlayers, numMrWhite)}
                  className="w-9 h-9 flex items-center justify-center bg-gray-700 hover:bg-gray-600 disabled:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed rounded-full transition-all font-bold text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Mr. White - avec boutons +/- */}
            <div className="flex items-center justify-between bg-yellow-600/80 rounded-2xl px-6 py-3.5 shadow-md">
              <span className="font-bold text-base sm:text-lg">Mr. White</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleMrWhiteChange(-1)}
                  disabled={numMrWhite <= 0}
                  className="w-9 h-9 flex items-center justify-center bg-yellow-700 hover:bg-yellow-600 disabled:bg-yellow-900 disabled:opacity-40 disabled:cursor-not-allowed rounded-full transition-all font-bold text-lg"
                >
                  -
                </button>
                <span className="text-2xl font-bold min-w-[2rem] text-center">{numMrWhite}</span>
                <button
                  onClick={() => handleMrWhiteChange(1)}
                  disabled={numMrWhite >= calculateMaxMrWhite(totalPlayers, numUndercovers)}
                  className="w-9 h-9 flex items-center justify-center bg-yellow-700 hover:bg-yellow-600 disabled:bg-yellow-900 disabled:opacity-40 disabled:cursor-not-allowed rounded-full transition-all font-bold text-lg"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleStartGame}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg text-lg tracking-wide"
        >
          COMMENCER
        </button>
      </div>

      {/* Section Dépliante pour ajouter/gérer les mots sous la carte principale */}
      <WordManagerSection onPacksUpdated={refreshThemes} />
    </div>
  );
};

export default ConfigurationPhase;
