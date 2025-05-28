
import React, { useState, useCallback, useEffect } from 'react';
import { GameStatus } from './types';
import GameScreen from './components/GameScreen';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import { BACKGROUND_COLOR as APP_BACKGROUND } from './constants';

const App: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.START_SCREEN);
  const [finalScore, setFinalScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameId, setGameId] = useState<number>(Date.now()); // Used to force remount GameScreen

  const handleStartGame = useCallback(() => {
    setGameId(Date.now()); // Ensure a fresh game instance
    setGameStatus(GameStatus.PLAYING);
  }, []);

  const handlePauseRequest = useCallback(() => {
    if (gameStatus === GameStatus.PLAYING) {
      setGameStatus(GameStatus.PAUSED);
    }
  }, [gameStatus]);

  const handleResumeRequest = useCallback(() => {
    if (gameStatus === GameStatus.PAUSED) {
      setGameStatus(GameStatus.PLAYING);
    }
  }, [gameStatus]);

  const handleExitToMenuRequest = useCallback(() => {
    setGameStatus(GameStatus.START_SCREEN);
  }, []);

  const handleGameOver = useCallback((win: boolean, score: number) => {
    setGameWon(win);
    setFinalScore(score);
    setGameStatus(win ? GameStatus.GAME_OVER_WIN : GameStatus.GAME_OVER_LOSE);
  }, []);

  const handleRestartGame = useCallback(() => {
    setGameId(Date.now()); // New key forces GameScreen to remount, resetting its state
    setGameStatus(GameStatus.PLAYING);
  }, []);

  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        if (gameStatus === GameStatus.PLAYING) {
          handlePauseRequest();
        } else if (gameStatus === GameStatus.PAUSED) {
          handleResumeRequest();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyPress);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyPress);
    };
  }, [gameStatus, handlePauseRequest, handleResumeRequest]);
  
  const renderContent = () => {
    switch (gameStatus) {
      case GameStatus.START_SCREEN:
        return <StartScreen onStart={handleStartGame} />;
      case GameStatus.PLAYING:
      case GameStatus.PAUSED:
        return (
          <GameScreen
            key={gameId} // This key ensures GameScreen remounts on restart
            initialGameStatus={gameStatus} // Pass current status for pause handling
            onGameOver={handleGameOver}
            onPauseRequest={handlePauseRequest}
            onResumeRequest={handleResumeRequest}
            onExitToMenuRequest={handleExitToMenuRequest}
          />
        );
      case GameStatus.GAME_OVER_WIN:
      case GameStatus.GAME_OVER_LOSE:
        return <GameOverScreen win={gameWon} score={finalScore} onRestart={handleRestartGame} />;
      default:
        return <StartScreen onStart={handleStartGame} />;
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center ${APP_BACKGROUND} p-4`}>
      {renderContent()}
    </div>
  );
};

export default App;
