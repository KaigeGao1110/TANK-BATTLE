
import React from 'react';
import { PLAYER_START_LIVES, TEXT_COLOR, HUD_BACKGROUND_COLOR } from '../constants';

interface HudProps {
  lives: number;
  score: number;
  enemiesRemaining: number;
  level?: number; // Optional
  onPauseRequest?: () => void; // Callback for pause button
}

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${className}`}>
    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.218c-.017.01-.033.018-.046.027L12 21.75l-.355-.84-.007-.003-.022-.012Zm1.023-.255a.5.5 0 0 0-.638 0l-.007.004-.026.014a13.752 13.752 0 0 0-.354.2a23.65 23.65 0 0 0-4.013 3.036C4.042 18.445 1.5 15.261 1.5 11.25c0-3.449 2.642-6.25 5.938-6.25A6.25 6.25 0 0 1 12 7.159a6.25 6.25 0 0 1 4.563-2.159c3.296 0 5.937 2.801 5.937 6.25 0 4.011-2.542 7.195-4.965 9.399a23.65 23.65 0 0 0-4.013 3.035 13.752 13.752 0 0 0-.354.2l-.026.014-.007.004-.003.001Z" />
  </svg>
);


const Hud: React.FC<HudProps> = ({ lives, score, enemiesRemaining, level = 1, onPauseRequest }) => {
  return (
    <div className={`p-4 ${HUD_BACKGROUND_COLOR} ${TEXT_COLOR} shadow-lg rounded-b-lg w-full flex justify-between items-center`}>
      <div className="flex items-center space-x-2">
        <span className="font-bold text-lg">Lives:</span>
        <div className="flex">
          {Array.from({ length: PLAYER_START_LIVES }).map((_, i) => (
            <HeartIcon key={i} className={i < lives ? 'text-red-500' : 'text-gray-400'} />
          ))}
        </div>
      </div>
      <div className="text-center">
        <span className="font-bold text-lg">Score: </span>
        <span className="text-xl">{score}</span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
            <span className="font-bold text-lg">Enemies: </span>
            <span className="text-xl">{enemiesRemaining}</span>
        </div>
        {onPauseRequest && (
            <button
            onClick={onPauseRequest}
            className="px-4 py-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md text-sm shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-label="Pause Game"
            >
            Pause
            </button>
        )}
      </div>
      {/* <div className="text-center mt-1 text-sm">Level: {level}</div> */}
    </div>
  );
};

export default Hud;
