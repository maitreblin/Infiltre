import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

const ConfigurationPhase: React.FC = () => {
  const { initializeGame } = useGame();
  const [totalPlayers, setTotalPlayers] = useState<number>(6);
  const [numUndercovers, setNumUndercovers] = useState<number>(2);
  const [numMrWhite, setNumMrWhite] = useState<number>(0);

  const isEven = totalPlayers % 2 === 0;
  const adversaries = numUndercovers + numMrWhite;

  // Calcul automatique du nombre de Civils selon les règles
  const getCalculatedCivils = () => {
    if (isEven) {
      // Nombre pair :
      if (numUndercovers === 0 && numMrWhite === 0) {
        // Pas de contrainte, juste au moins 1 Civil
        return totalPlayers;
      } else if (numUndercovers > 0 && numMrWhite === 0) {
        // Undercover seuls : Civil doit être > Undercover
        // Total = Civil + Undercover
        // Civil = Total - Undercover
        // On doit garantir Civil > Undercover, donc Total - Undercover > Undercover
        // Total > 2 * Undercover
        // Undercover < Total / 2
        // Si Undercover >= Total/2, on limite Undercover à Total/2 - 1
        const maxUndercover = Math.floor(totalPlayers / 2) - 1;
        if (numUndercovers > maxUndercover) {
          // Ajuster automatiquement
          return totalPlayers - maxUndercover; // Civil sera > Undercover
        }
        return totalPlayers - numUndercovers;
      } else if (numUndercovers > 0 && numMrWhite > 0) {
        // Les deux : Civil = Undercover + Mr White
        return numUndercovers + numMrWhite;
      } else if (numUndercovers === 0 && numMrWhite > 0) {
        // Mr White seuls : même logique que Undercover seuls
        const maxMrWhite = Math.floor(totalPlayers / 2) - 1;
        if (numMrWhite > maxMrWhite) {
          return totalPlayers - maxMrWhite;
        }
        return totalPlayers - numMrWhite;
      }
    }
    // Nombre impair : Civil > Undercover + Mr White
    // Total = Civil + Undercover + Mr White
    // Civil = Total - (Undercover + Mr White)
    // On doit avoir : Civil > (Undercover + Mr White)
    // Donc : Total - (Undercover + Mr White) > (Undercover + Mr White)
    // Total > 2 * (Undercover + Mr White)
    // (Undercover + Mr White) < Total / 2
    // Le maximum d'adversaires est floor(Total/2)
    // Si adversaries >= Total/2, on limite à floor(Total/2) - 1 pour garantir Civil > adversaries
    const maxAdversaries = Math.floor(totalPlayers / 2);
    if (adversaries > maxAdversaries) {
      // Limiter pour garantir Civil > adversaries
      const limitedAdversaries = maxAdversaries;
      return totalPlayers - limitedAdversaries; // Garantit Civil > adversaries
    }
    return totalPlayers - adversaries;
  };

  // Utiliser le nombre de civils calculé automatiquement
  const calculatedCivils = getCalculatedCivils();

  // Ajustement automatique des Undercover et Mr White quand le total change
  useEffect(() => {
    const isEven = totalPlayers % 2 === 0;
    
    // Calculer les maximums selon les règles
    let maxUndercovers: number;
    let maxMrWhite: number;

    if (isEven) {
      if (numMrWhite === 0) {
        // Undercover seuls : Civil > Undercover
        maxUndercovers = Math.max(0, Math.floor(totalPlayers / 2) - 1);
      } else {
        // Les deux présents : Civil = Undercover + Mr White
        maxUndercovers = Math.max(0, Math.floor(totalPlayers / 2) - numMrWhite);
      }

      if (numUndercovers === 0) {
        // Mr White seuls : Civil > Mr White
        maxMrWhite = Math.max(0, Math.floor(totalPlayers / 2) - 1);
      } else {
        // Les deux présents : Civil = Undercover + Mr White
        maxMrWhite = Math.max(0, Math.floor(totalPlayers / 2) - numUndercovers);
      }
    } else {
      // Impair : Civil > Undercover + Mr White
      // Maximum total d'adversaires = floor(Total/2)
      const maxAdversaries = Math.floor(totalPlayers / 2);
      maxUndercovers = Math.max(0, maxAdversaries - numMrWhite);
      maxMrWhite = Math.max(0, maxAdversaries - numUndercovers);
    }

    // Ajuster Undercover si nécessaire (ne jamais aller en négatif)
    if (numUndercovers > maxUndercovers) {
      const newUndercovers = Math.max(0, maxUndercovers);
      setNumUndercovers(newUndercovers);
      
      // Si on a ajusté Undercover, recalculer Mr White avec la nouvelle valeur
      if (isEven && numMrWhite > 0) {
        const newMaxMrWhite = Math.max(0, Math.floor(totalPlayers / 2) - newUndercovers);
        if (numMrWhite > newMaxMrWhite) {
          setNumMrWhite(Math.max(0, newMaxMrWhite));
        }
      }
    }

    // Ajuster Mr White si nécessaire (ne jamais aller en négatif)
    if (numMrWhite > maxMrWhite) {
      const newMrWhite = Math.max(0, maxMrWhite);
      setNumMrWhite(newMrWhite);
      
      // Si on a ajusté Mr White, recalculer Undercover avec la nouvelle valeur
      if (isEven && numUndercovers > 0) {
        const newMaxUndercovers = Math.max(0, Math.floor(totalPlayers / 2) - newMrWhite);
        if (numUndercovers > newMaxUndercovers) {
          setNumUndercovers(Math.max(0, newMaxUndercovers));
        }
      }
    }
  }, [totalPlayers]); // Se déclenche uniquement quand totalPlayers change

  // Validation des règles
  const isValidConfiguration = () => {
    if (calculatedCivils < 1) return false; // Au moins 1 Civil
    
    // Il faut au moins 1 Undercover OU 1 Mr White
    if (numUndercovers === 0 && numMrWhite === 0) {
      return false; // Pas de partie sans adversaires
    }
    
    if (isEven) {
      // Nombre pair :
      if (numUndercovers > 0 && numMrWhite === 0) {
        return calculatedCivils > numUndercovers; // Civil > Undercover
      } else if (numUndercovers > 0 && numMrWhite > 0) {
        return calculatedCivils === adversaries; // Civil = Undercover + Mr White
      } else if (numUndercovers === 0 && numMrWhite > 0) {
        return calculatedCivils > numMrWhite; // Civil > Mr White
      }
      return false;
    } else {
      // Nombre impair : Civil > Undercover + Mr White
      return calculatedCivils > adversaries;
    }
  };

  const handleUndercoversChange = (delta: number) => {
    setNumUndercovers((prev) => {
      const newValue = prev + delta;
      const minValue = 0;
      let maxValue: number;
      
      if (isEven) {
        if (numMrWhite === 0) {
          // Undercover seuls : Civil > Undercover
          // Total = Civil + Undercover, avec Civil > Undercover
          // Donc Total > 2 * Undercover
          // Undercover < Total / 2
          maxValue = Math.floor(totalPlayers / 2) - 1; // Pour garantir Civil > Undercover
        } else {
          // Si Mr White > 0, alors Civil = Undercover + Mr White
          maxValue = Math.floor(totalPlayers / 2) - numMrWhite;
        }
      } else {
        // Impair : Civils > Undercover + Mr White
        // Total = Civils + Undercover + Mr White
        // Civils = Total - Undercover - Mr White
        // Total - Undercover - Mr White > Undercover + Mr White
        // Total > 2 * (Undercover + Mr White)
        // Undercover + Mr White < Total / 2
        // Undercover <= floor(Total / 2) - Mr White
        maxValue = Math.floor(totalPlayers / 2) - numMrWhite;
      }
      // Au moins 1 Civil
      maxValue = Math.min(maxValue, totalPlayers - numMrWhite - 1);
      return Math.max(minValue, Math.min(maxValue, newValue));
    });
  };

  const handleMrWhiteChange = (delta: number) => {
    setNumMrWhite((prev) => {
      const newValue = prev + delta;
      const minValue = 0;
      let maxValue: number;
      
      if (isEven) {
        if (numUndercovers === 0) {
          // Mr White seuls : Civil > Mr White
          // Total = Civil + Mr White, avec Civil > Mr White
          // Donc Total > 2 * Mr White
          // Mr White < Total / 2
          maxValue = Math.floor(totalPlayers / 2) - 1; // Pour garantir Civil > Mr White
        } else {
          // Si Undercover > 0, alors Civil = Undercover + Mr White
          maxValue = Math.floor(totalPlayers / 2) - numUndercovers;
        }
      } else {
        // Impair : Civils > Undercover + Mr White
        // Total = Civils + Undercover + Mr White
        // Civils = Total - Undercover - Mr White
        // Total - Undercover - Mr White > Undercover + Mr White
        // Total > 2 * (Undercover + Mr White)
        // Undercover + Mr White < Total / 2
        // Mr White <= floor(Total / 2) - Undercover
        maxValue = Math.floor(totalPlayers / 2) - numUndercovers;
      }
      // Au moins 1 Civil
      maxValue = Math.min(maxValue, totalPlayers - numUndercovers - 1);
      return Math.max(minValue, Math.min(maxValue, newValue));
    });
  };

  const handleStartGame = () => {
    if (totalPlayers < 3) {
      alert('Il faut au moins 3 joueurs.');
      return;
    }
    if (calculatedCivils < 1) {
      alert('Il doit y avoir au moins 1 Civil.');
      return;
    }
    if (numUndercovers === 0 && numMrWhite === 0) {
      alert('Il doit y avoir au moins 1 Undercover OU 1 Mr White.');
      return;
    }
    if (!isValidConfiguration()) {
      if (isEven) {
        if ((numUndercovers > 0 && numMrWhite === 0) || (numUndercovers === 0 && numMrWhite > 0)) {
          alert(`Pour un nombre pair de joueurs, vous ne pouvez pas avoir seulement des Undercover ou seulement des Mr White.\nVous devez avoir soit les deux (Undercover > 0 ET Mr White > 0), soit aucun des deux (Undercover = 0 ET Mr White = 0).`);
        } else {
          alert(`Pour un nombre pair de joueurs avec Undercover et Mr White, le nombre de Civils doit être égal à (Undercover + Mr White).\nActuellement: ${calculatedCivils} Civils ≠ ${adversaries} (Undercover + Mr White)`);
        }
      } else {
        alert(`Pour un nombre impair de joueurs, le nombre de Civils doit être supérieur à (Undercover + Mr White).\nActuellement: ${calculatedCivils} Civils ≤ ${adversaries} (Undercover + Mr White)`);
      }
      return;
    }
    // Utiliser le nombre de civils calculé pour initialiser le jeu
    // Le total de joueurs = Civils + Undercover + Mr White
    const totalPlayersForGame = calculatedCivils + numUndercovers + numMrWhite;
    initializeGame(totalPlayersForGame, numUndercovers, numMrWhite);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-900 to-blue-900 text-white">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Le Suspect</h1>
        <h2 className="text-xl font-semibold mb-6 text-center">Configuration</h2>

        <div className="space-y-6 mb-6">
          {/* Slider pour le nombre total de joueurs */}
          <div>
            <label className="block text-lg font-medium mb-3 text-center">
              Joueurs : <span className="text-2xl font-bold">{totalPlayers}</span>
            </label>
            <input
              type="range"
              min="3"
              max="15"
              value={totalPlayers}
              onChange={(e) => setTotalPlayers(parseInt(e.target.value, 10))}
              className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
              style={{
                background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${((totalPlayers - 3) / (15 - 3)) * 100}%, rgba(255,255,255,0.2) ${((totalPlayers - 3) / (15 - 3)) * 100}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              <span>3</span>
              <span>15</span>
            </div>
          </div>

          {/* Affichage des rôles avec boutons +/- */}
          <div className="space-y-3">
            {/* Civils - lecture seule */}
            <div className="flex items-center justify-between bg-blue-600/80 rounded-full px-6 py-4">
              <span className="font-bold text-lg">Civils</span>
              <span className="text-2xl font-bold">{calculatedCivils}</span>
            </div>

            {/* Undercover - avec boutons +/- */}
            <div className="flex items-center justify-between bg-gray-800/80 rounded-full px-6 py-4">
              <span className="font-bold text-lg">Undercover</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleUndercoversChange(-1)}
                  disabled={numUndercovers <= 0}
                  className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 disabled:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors font-bold text-xl"
                >
                  -
                </button>
                <span className="text-2xl font-bold min-w-[2rem] text-center">{numUndercovers}</span>
                <button
                  onClick={() => handleUndercoversChange(1)}
                  disabled={
                    isEven
                      ? numMrWhite > 0 
                        ? numUndercovers + numMrWhite >= Math.floor(totalPlayers / 2)
                        : numUndercovers + numMrWhite >= totalPlayers - 1
                      : numUndercovers + numMrWhite >= Math.floor(totalPlayers / 2)
                  }
                  className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 disabled:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors font-bold text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* Mr. White - avec boutons +/- */}
            <div className="flex items-center justify-between bg-yellow-600/80 rounded-full px-6 py-4">
              <span className="font-bold text-lg">Mr. White</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleMrWhiteChange(-1)}
                  disabled={numMrWhite <= 0}
                  className="w-10 h-10 flex items-center justify-center bg-yellow-700 hover:bg-yellow-600 disabled:bg-yellow-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors font-bold text-xl"
                >
                  -
                </button>
                <span className="text-2xl font-bold min-w-[2rem] text-center">{numMrWhite}</span>
                <button
                  onClick={() => handleMrWhiteChange(1)}
                  disabled={
                    isEven
                      ? numUndercovers > 0
                        ? numUndercovers + numMrWhite >= Math.floor(totalPlayers / 2)
                        : numUndercovers + numMrWhite >= totalPlayers - 1
                      : numUndercovers + numMrWhite >= Math.floor(totalPlayers / 2)
                  }
                  className="w-10 h-10 flex items-center justify-center bg-yellow-700 hover:bg-yellow-600 disabled:bg-yellow-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors font-bold text-xl"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-sm text-gray-300 text-center mb-2">
              Une paire de mots sera sélectionnée aléatoirement au début de la partie.
            </p>
            {isValidConfiguration() ? (
              <p className="text-sm text-green-400 text-center font-semibold mt-2">
                ✓ Configuration valide
              </p>
            ) : (
              <p className="text-sm text-red-400 text-center font-semibold mt-2">
                {numUndercovers === 0 && numMrWhite === 0
                  ? `⚠ Il doit y avoir au moins 1 Undercover OU 1 Mr White`
                  : isEven
                  ? (numUndercovers > 0 && numMrWhite === 0) || (numUndercovers === 0 && numMrWhite > 0)
                    ? `⚠ Nombre pair : vous ne pouvez pas avoir seulement Undercover ou seulement Mr White`
                    : `⚠ Civils doit être égal à (Undercover + Mr White)`
                  : `⚠ Civils doit être supérieur à (Undercover + Mr White)`}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleStartGame}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg"
        >
          COMMENCER
        </button>
      </div>
    </div>
  );
};

export default ConfigurationPhase;

