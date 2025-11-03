import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import ConfigurationPhase from './components/ConfigurationPhase';
import PhaseDisplay from './components/PhaseDisplay';
import VoteEliminationPhase from './components/VoteEliminationPhase';
import FinDePartiePhase from './components/FinDePartiePhase';

const AppContent: React.FC = () => {
  const { gameState } = useGame();

  const renderPhase = () => {
    switch (gameState.currentPhase) {
      case 'Configuration':
        return <ConfigurationPhase />;
      case 'AffichageRole':
      case 'TourDeParole':
        return <PhaseDisplay />;
      case 'VoteElimination':
        return <VoteEliminationPhase />;
      case 'FinDePartie':
        return <FinDePartiePhase />;
      default:
        return <ConfigurationPhase />;
    }
  };

  return <div className="min-h-screen">{renderPhase()}</div>;
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;

