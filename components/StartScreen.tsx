
import React from 'react';
import { TEXT_COLOR } from '../constants';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${TEXT_COLOR} bg-gray-800 rounded-lg shadow-xl`}>
      <h1 className="text-5xl font-bold mb-6 text-yellow-400 tracking-wider">Tank Battle</h1>
      <p className="text-lg mb-8 text-center max-w-md">
        Destroy all enemy tanks and protect your base to win!
      </p>
      <button
        onClick={onStart}
        className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg text-xl shadow-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
      >
        Start Game
      </button>
      <div className="mt-8 text-sm text-gray-400">
        <p className="font-semibold text-base mb-1">Controls:</p>
        <p>Arrow Keys: Move Tank</p>
        <p>J Key: Shoot</p>
        <p>P Key / HUD Button: Pause/Resume Game</p>
      </div>
    </div>
  );
};

export default StartScreen;
