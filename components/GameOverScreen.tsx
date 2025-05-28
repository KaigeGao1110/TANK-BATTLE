
import React from 'react';
import { TEXT_COLOR } from '../constants';

interface GameOverScreenProps {
  win: boolean;
  score: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ win, score, onRestart }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${TEXT_COLOR} bg-gray-800 rounded-lg shadow-xl`}>
      <h1 className={`text-5xl font-bold mb-4 ${win ? 'text-green-400' : 'text-red-500'}`}>
        {win ? 'Victory!' : 'Game Over'}
      </h1>
      <p className="text-2xl mb-6">Your Score: {score}</p>
      <button
        onClick={onRestart}
        className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg text-xl shadow-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        Play Again
      </button>
    </div>
  );
};

export default GameOverScreen;
    