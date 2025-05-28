
import React from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { GameMap, TankData, ProjectileData, ExplosionData, BaseData, GameStatus } from '../types';
import { GAME_WIDTH, GAME_HEIGHT, TILE_SIZE, BACKGROUND_COLOR } from '../constants';
import Wall from './Wall';
import Tank from './Tank';
import Projectile from './Projectile';
import Explosion from './Explosion';
import Base from './Base'; // Import Base component
import Hud from './Hud';
import PauseScreen from './PauseScreen'; // Import PauseScreen component

interface GameScreenProps {
  initialGameStatus: GameStatus; // Game can start in PLAYING or PAUSED (e.g. if browser tab loses focus)
  onGameOver: (win: boolean, score: number) => void;
  onPauseRequest: () => void;
  onResumeRequest: () => void;
  onExitToMenuRequest: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  initialGameStatus,
  onGameOver,
  onPauseRequest,
  onResumeRequest,
  onExitToMenuRequest,
}) => {
  const isPaused = initialGameStatus === GameStatus.PAUSED;

  const {
    map, playerTank, enemyTanks, projectiles, explosions, base, // Include base
    score, lives, enemiesRemaining,
  } = useGameLogic({ onGameOver, isPaused });

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Hud
        lives={lives}
        score={score}
        enemiesRemaining={enemiesRemaining}
        onPauseRequest={onPauseRequest}
      />
      <div
        className={`relative ${BACKGROUND_COLOR} border-4 border-gray-600 shadow-2xl overflow-hidden`}
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
        }}
      >
        {map.map((row, rIdx) =>
          row.map((tile, cIdx) => (
            <Wall key={tile.id} tile={tile} x={cIdx * TILE_SIZE} y={rIdx * TILE_SIZE} />
          ))
        )}
        {base && <Base base={base} />} {/* Render the base */}
        {playerTank && <Tank tank={playerTank} />}
        {enemyTanks.map(tank => (
          <Tank key={tank.id} tank={tank} />
        ))}
        {projectiles.map(proj => (
          <Projectile key={proj.id} projectile={proj} />
        ))}
        {explosions.map(exp => (
          <Explosion key={exp.id} explosion={exp} />
        ))}

        {isPaused && (
          <PauseScreen
            onResume={onResumeRequest}
            onExitToMenu={onExitToMenuRequest}
          />
        )}
      </div>
    </div>
  );
};

export default GameScreen;
