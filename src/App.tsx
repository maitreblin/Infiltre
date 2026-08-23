import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ToastContainer';
import ConfigurationPhase from './components/ConfigurationPhase';
import RoleRevealPhase from './components/RoleRevealPhase';
import SpeechOrderPhase from './components/SpeechOrderPhase';
import VoteEliminationPhase from './components/VoteEliminationPhase';
import FinDePartiePhase from './components/FinDePartiePhase';

const AppContent: React.FC = () => {
  const { gameState } = useGame();

  const renderPhase = () => {
    switch (gameState.currentPhase) {
      case 'Configuration':
        return <ConfigurationPhase />;
      case 'AffichageRole':
        return <RoleRevealPhase />;
      case 'TourDeParole':
        return <SpeechOrderPhase />;
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
    <ToastProvider>
      <GameProvider>
        <ToastContainer />
        <AppContent />
      </GameProvider>
    </ToastProvider>
  );
};

export default App;

