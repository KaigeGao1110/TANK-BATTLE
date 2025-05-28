
import React from 'react';
import { TEXT_COLOR } from '../constants';

interface PauseScreenProps {
  onResume: () => void;
  onExitToMenu: () => void;
}

const PauseScreen: React.FC<PauseScreenProps> = ({ onResume, onExitToMenu }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
      <div className={`p-8 rounded-lg shadow-xl ${TEXT_COLOR} bg-gray-800 w-full max-w-md text-center`}>
        <h2 className="text-4xl font-bold mb-6 text-yellow-400">Paused</h2>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={onResume}
            className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg text-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
            aria-label="Resume Game"
          >
            Resume
          </button>
          <button
            onClick={onExitToMenu}
            className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg text-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            aria-label="Exit to Menu"
          >
            Exit to Menu
          </button>
        </div>

        <div className="text-sm text-gray-400">
          <p className="font-semibold text-base mb-1">Controls:</p>
          <p>Arrow Keys: Move Tank</p>
          <p>J Key: Shoot</p>
          <p>P Key: Resume Game</p>
        </div>
      </div>
    </div>
  );
};

export default PauseScreen;
