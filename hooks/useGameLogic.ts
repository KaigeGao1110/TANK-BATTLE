
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Direction, Position, TankData, ProjectileData, GameMap, MapTile, TileType, ExplosionData, KeysPressed, GameObject, BaseData, GameStatus
} from '../types';
import {
  TILE_SIZE, PLAYER_TANK_SPEED, ENEMY_TANK_SPEED, PROJECTILE_SPEED, TANK_SIZE,
  PLAYER_START_LIVES, INITIAL_ENEMY_COUNT, TANK_FIRE_COOLDOWN, ENEMY_FIRE_COOLDOWN,
  EXPLOSION_DURATION, EXPLOSION_MAX_SIZE, PLAYER_TANK_COLOR, ENEMY_TANK_COLOR,
  PROJECTILE_WIDTH, PROJECTILE_HEIGHT, TANK_INITIAL_HEALTH, BRICK_HEALTH,
  GAME_WIDTH, GAME_HEIGHT, PLAYER_SPAWN_POSITION, ENEMY_SPAWN_POSITIONS, MAX_ACTIVE_ENEMIES,
  BASE_SIZE, BASE_COLOR, BASE_INITIAL_HEALTH, BASE_POSITION, GAME_ROWS, GAME_COLS,
  generateId
} from '../constants';
import { checkCollision } from '../utils/geometry';
import { generateInitialMap } from '../utils/mapGenerator';

interface UseGameLogicProps {
  onGameOver: (win: boolean, score: number) => void;
  isPaused: boolean;
}

export const useGameLogic = ({ onGameOver, isPaused }: UseGameLogicProps) => {
  const [map, setMap] = useState<GameMap>(() => generateInitialMap());
  const [playerTank, setPlayerTank] = useState<TankData | null>(null);
  const [enemyTanks, setEnemyTanks] = useState<TankData[]>([]);
  const [projectiles, setProjectiles] = useState<ProjectileData[]>([]);
  const [explosions, setExplosions] = useState<ExplosionData[]>([]);
  const [base, setBase] = useState<BaseData | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(PLAYER_START_LIVES);
  const [enemiesRemainingText, setEnemiesRemainingText] = useState(INITIAL_ENEMY_COUNT); // For HUD
  const enemiesToSpawnRef = useRef(INITIAL_ENEMY_COUNT);


  const [gameOverState, setGameOverState] = useState(false); 

  const keysPressedRef = useRef<KeysPressed>({});
  const gameLoopRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(performance.now());
  const gameTickRef = useRef<(timestamp: number) => void>();


  const spawnPlayer = useCallback(() => {
    setPlayerTank({
      id: 'player',
      x: PLAYER_SPAWN_POSITION.x,
      y: PLAYER_SPAWN_POSITION.y,
      width: TANK_SIZE,
      height: TANK_SIZE,
      direction: Direction.UP,
      color: PLAYER_TANK_COLOR,
      health: TANK_INITIAL_HEALTH,
      isPlayer: true,
      lastShotTime: 0, 
      speed: PLAYER_TANK_SPEED,
    });
  }, []);

  const spawnBase = useCallback(() => {
    setBase({
      id: 'game-base',
      x: BASE_POSITION.x,
      y: BASE_POSITION.y,
      width: BASE_SIZE,
      height: BASE_SIZE,
      health: BASE_INITIAL_HEALTH,
      color: BASE_COLOR,
    });
  }, []);

  useEffect(() => {
    // This effect runs when GameScreen mounts (due to key={gameId} changing),
    // resetting the game state.
    spawnPlayer();
    spawnBase();
    enemiesToSpawnRef.current = INITIAL_ENEMY_COUNT;
    setEnemiesRemainingText(INITIAL_ENEMY_COUNT);
    setScore(0);
    setLives(PLAYER_START_LIVES);
    setGameOverState(false);
    setProjectiles([]);
    setExplosions([]);
    setEnemyTanks([]); // Ensure enemies are cleared for a full reset
    setMap(generateInitialMap());
    keysPressedRef.current = {}; // Reset pressed keys
    lastFrameTimeRef.current = performance.now(); // Reset frame time for the new game
  }, [spawnPlayer, spawnBase]); // spawnPlayer and spawnBase are stable callbacks


  useEffect(() => {
    if (lives > 0 && !playerTank && !gameOverState && !isPaused) { 
        spawnPlayer();
    }
  }, [lives, playerTank, gameOverState, spawnPlayer, isPaused]);


  useEffect(() => {
    if (!isPaused && !gameOverState) {
      lastFrameTimeRef.current = performance.now(); // Reset time when unpausing or starting
    }
  }, [isPaused, gameOverState]);


  const createExplosion = (x: number, y: number, size: number, color: string = 'bg-orange-500') => {
    return {
      id: generateId(),
      x, y, size,
      startTime: Date.now(),
      duration: EXPLOSION_DURATION,
      color,
    };
  };

  const fireProjectile = useCallback((tankToModify: TankData): ProjectileData | null => {
    const now = Date.now();
    const cooldown = tankToModify.isPlayer ? TANK_FIRE_COOLDOWN : ENEMY_FIRE_COOLDOWN;

    if (now - tankToModify.lastShotTime < cooldown) {
      return null;
    }
    // Caller MUST update tankToModify.lastShotTime = now; 
    
    const tankCenterX = tankToModify.x + tankToModify.width / 2;
    const tankCenterY = tankToModify.y + tankToModify.height / 2;
    const turretActualLength = TANK_SIZE * 0.7; 


    let pX = 0, pY = 0;
    let pWidth = PROJECTILE_WIDTH, pHeight = PROJECTILE_HEIGHT; 

    switch (tankToModify.direction) {
      case Direction.UP:
        pX = tankCenterX - pWidth / 2;
        pY = tankCenterY - turretActualLength - pHeight;
        break;
      case Direction.DOWN:
        pX = tankCenterX - pWidth / 2;
        pY = tankCenterY + turretActualLength;
        break;
      case Direction.LEFT:
        pWidth = PROJECTILE_HEIGHT; pHeight = PROJECTILE_WIDTH; 
        pX = tankCenterX - turretActualLength - pWidth;
        pY = tankCenterY - pHeight / 2;
        break;
      case Direction.RIGHT:
        pWidth = PROJECTILE_HEIGHT; pHeight = PROJECTILE_WIDTH; 
        pX = tankCenterX + turretActualLength;
        pY = tankCenterY - pHeight / 2;
        break;
    }

    return {
      id: generateId(), x: pX, y: pY, 
      width: pWidth, height: pHeight,
      direction: tankToModify.direction, ownerId: tankToModify.id, speed: PROJECTILE_SPEED,
    };
  }, []);


  const spawnEnemy = useCallback(() => {
    const availableSpawnPositions = ENEMY_SPAWN_POSITIONS.filter(spawnPos => {
      const isOccupiedByEnemy = enemyTanks.some(et => 
        Math.abs(et.x - spawnPos.x) < TANK_SIZE && Math.abs(et.y - spawnPos.y) < TANK_SIZE
      );
      const isOccupiedByPlayer = playerTank ? 
        (Math.abs(playerTank.x - spawnPos.x) < TANK_SIZE * 1.5 && Math.abs(playerTank.y - spawnPos.y) < TANK_SIZE * 1.5)
        : false;
      return !isOccupiedByEnemy && !isOccupiedByPlayer;
    });
    
    if (availableSpawnPositions.length === 0) return false;
    const spawnPos = availableSpawnPositions[Math.floor(Math.random() * availableSpawnPositions.length)];

    const newEnemy: TankData = {
      id: generateId(),
      x: spawnPos.x,
      y: spawnPos.y,
      width: TANK_SIZE,
      height: TANK_SIZE,
      direction: Direction.DOWN,
      color: ENEMY_TANK_COLOR,
      health: TANK_INITIAL_HEALTH,
      isPlayer: false,
      lastShotTime: Date.now() + Math.random() * ENEMY_FIRE_COOLDOWN, 
      speed: ENEMY_TANK_SPEED,
    };
    setEnemyTanks(prev => [...prev, newEnemy]);
    enemiesToSpawnRef.current -= 1;
    // setEnemiesRemainingText is updated in the game tick based on current enemyTanks and enemiesToSpawnRef
    return true;
  }, [enemyTanks, playerTank]); // playerTank and enemyTanks are dependencies for checking spawn positions


  useEffect(() => {
    gameTickRef.current = (timestamp: number) => {
      if (isPaused || gameOverState) {
        lastFrameTimeRef.current = timestamp; 
        return;
      }

      const delta = Math.max(0, (timestamp - lastFrameTimeRef.current) / 1000);
      lastFrameTimeRef.current = timestamp;

      // Work with copies of state for this tick's mutations
      let updatedPlayerTank = playerTank ? { ...playerTank } : null;
      let updatedEnemyTanks = enemyTanks.map(t => ({ ...t }));
      let updatedMap = map.map(row => row.map(tile => ({ ...tile })));
      let updatedBase = base ? { ...base } : null;
      let updatedScore = score;
      let updatedLives = lives;
      
      const newlyFiredProjectilesThisTick: ProjectileData[] = [];
      const newExplosionsThisTick: ExplosionData[] = [];
      
      const calculateNewTankPosition = (tank: TankData, d: number, collisionMap: GameMap, otherTanks: TankData[], gameBase: BaseData | null): Position => {
        let newX = tank.x;
        let newY = tank.y;
        const effectiveSpeed = tank.speed * d * 60; 

        switch (tank.direction) {
          case Direction.UP: newY -= effectiveSpeed; break;
          case Direction.DOWN: newY += effectiveSpeed; break;
          case Direction.LEFT: newX -= effectiveSpeed; break;
          case Direction.RIGHT: newX += effectiveSpeed; break;
        }

        newX = Math.max(0, Math.min(newX, GAME_WIDTH - tank.width));
        newY = Math.max(0, Math.min(newY, GAME_HEIGHT - tank.height));
        
        const tempTankHitbox = { ...tank, x: newX, y: newY }; // Use this for collision checks

        for (let r = 0; r < collisionMap.length; r++) {
          for (let c = 0; c < collisionMap[r].length; c++) {
            if (collisionMap[r][c].type !== TileType.EMPTY) {
              const wall: GameObject = { 
                id: `wall-${r}-${c}`, x: c * TILE_SIZE, y: r * TILE_SIZE,
                width: TILE_SIZE, height: TILE_SIZE,
              };
              if (checkCollision(tempTankHitbox, wall)) return { x: tank.x, y: tank.y }; 
            }
          }
        }
        
        for (const otherTank of otherTanks) {
            if (otherTank.id === tank.id) continue;
            if (checkCollision(tempTankHitbox, otherTank)) return { x: tank.x, y: tank.y };
        }
        if (gameBase && checkCollision(tempTankHitbox, gameBase)) {
             return { x: tank.x, y: tank.y };
        }
        return { x: newX, y: newY };
      };

      // Player Tank Logic
      if (updatedPlayerTank) {
        let playerMoved = false;
        let newPlayerDirection = updatedPlayerTank.direction;

        if (keysPressedRef.current['ArrowUp']) { newPlayerDirection = Direction.UP; playerMoved = true; }
        else if (keysPressedRef.current['ArrowDown']) { newPlayerDirection = Direction.DOWN; playerMoved = true; }
        else if (keysPressedRef.current['ArrowLeft']) { newPlayerDirection = Direction.LEFT; playerMoved = true; }
        else if (keysPressedRef.current['ArrowRight']) { newPlayerDirection = Direction.RIGHT; playerMoved = true; }

        updatedPlayerTank.direction = newPlayerDirection;

        if (playerMoved) {
          const { x: newX, y: newY } = calculateNewTankPosition(updatedPlayerTank, delta, updatedMap, updatedEnemyTanks, updatedBase);
          updatedPlayerTank.x = newX;
          updatedPlayerTank.y = newY;
        }

        if (keysPressedRef.current['KeyJ']) {
          const proj = fireProjectile(updatedPlayerTank);
          if (proj) {
            updatedPlayerTank.lastShotTime = Date.now(); 
            newlyFiredProjectilesThisTick.push(proj);
          }
        }
      }

      // Enemy Tank Logic
      updatedEnemyTanks = updatedEnemyTanks.map(enemy => {
        let currentEnemy = { ...enemy }; // Operate on a copy
        if (Math.random() < 0.015 * (60 * delta)) { 
          const directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
          currentEnemy.direction = directions[Math.floor(Math.random() * directions.length)];
        }
        // Pass all other tanks (player and other enemies) for collision check
        const otherTanksForCollision = [...(updatedPlayerTank ? [updatedPlayerTank] : []), ...updatedEnemyTanks.filter(et => et.id !== currentEnemy.id)];
        const { x: newX, y: newY } = calculateNewTankPosition(currentEnemy, delta, updatedMap, otherTanksForCollision, updatedBase);
        currentEnemy.x = newX;
        currentEnemy.y = newY;

        if (Math.random() < 0.025 * (60 * delta)) { 
          const proj = fireProjectile(currentEnemy);
          if (proj) {
            currentEnemy.lastShotTime = Date.now();
            newlyFiredProjectilesThisTick.push(proj);
          }
        }
        return currentEnemy;
      });
      
      let currentProjectiles = [...projectiles, ...newlyFiredProjectilesThisTick];
      const survivingProjectiles: ProjectileData[] = [];

      for (const p of currentProjectiles) {
        let projectile = { ...p }; // Work with a copy
        const effectiveSpeed = projectile.speed * delta * 60;
        switch (projectile.direction) {
          case Direction.UP: projectile.y -= effectiveSpeed; break;
          case Direction.DOWN: projectile.y += effectiveSpeed; break;
          case Direction.LEFT: projectile.x -= effectiveSpeed; break;
          case Direction.RIGHT: projectile.x += effectiveSpeed; break;
        }

        let projectileDestroyed = false;

        const projTileC = Math.floor((projectile.x + projectile.width / 2) / TILE_SIZE);
        const projTileR = Math.floor((projectile.y + projectile.height / 2) / TILE_SIZE);

        if (projTileR >= 0 && projTileR < GAME_ROWS && projTileC >= 0 && projTileC < GAME_COLS) {
          const tile = updatedMap[projTileR][projTileC];
          if (tile.type !== TileType.EMPTY) {
            projectileDestroyed = true;
            newExplosionsThisTick.push(createExplosion(projectile.x + projectile.width / 2, projectile.y + projectile.height / 2, TILE_SIZE * 0.5, 'bg-gray-400'));
            if (tile.type === TileType.BRICK) {
              tile.health = (tile.health || BRICK_HEALTH) - 1; // Ensure health starts at BRICK_HEALTH
              if (tile.health <= 0) {
                tile.type = TileType.EMPTY;
              }
            }
          }
        }
        
        if (!projectileDestroyed && updatedPlayerTank && projectile.ownerId !== updatedPlayerTank.id && checkCollision(projectile, updatedPlayerTank)) {
          projectileDestroyed = true;
          updatedPlayerTank.health -= 1;
          newExplosionsThisTick.push(createExplosion(updatedPlayerTank.x + TANK_SIZE / 2, updatedPlayerTank.y + TANK_SIZE / 2, EXPLOSION_MAX_SIZE));
          if (updatedPlayerTank.health <= 0) {
            updatedLives -= 1;
            if (updatedLives <= 0) { // No lives left
               updatedPlayerTank = null;
            } else { // Lives remaining, will be respawned by useEffect
               updatedPlayerTank = null; 
            }
          }
        }

        if (!projectileDestroyed) {
          // Need a new array for filtering to avoid modifying during iteration
          const tempEnemyTanks: TankData[] = [];
          for (const enemy of updatedEnemyTanks) {
            if (projectile.ownerId !== enemy.id && checkCollision(projectile, enemy)) {
              projectileDestroyed = true;
              enemy.health -= 1; // Directly modify the enemy in updatedEnemyTanks copy
              newExplosionsThisTick.push(createExplosion(enemy.x + TANK_SIZE / 2, enemy.y + TANK_SIZE / 2, EXPLOSION_MAX_SIZE, ENEMY_TANK_COLOR));
              if (enemy.health > 0) {
                tempEnemyTanks.push(enemy); // Keep if not destroyed
              } else {
                updatedScore += 100; // Add score if destroyed
              }
              break; // Projectile hits one enemy and is destroyed
            } else {
              tempEnemyTanks.push(enemy); // Keep if not hit
            }
          }
          if(projectileDestroyed) updatedEnemyTanks = tempEnemyTanks;
        }
        
        if (!projectileDestroyed && updatedBase && projectile.ownerId !== 'player' && checkCollision(projectile, updatedBase)) {
            projectileDestroyed = true;
            updatedBase.health -=1;
            newExplosionsThisTick.push(createExplosion(updatedBase.x + BASE_SIZE / 2, updatedBase.y + BASE_SIZE / 2, EXPLOSION_MAX_SIZE, 'bg-red-700'));
            // Game over if base health <= 0 is checked later
        }

        if (!projectileDestroyed && (projectile.x < -projectile.width || projectile.x > GAME_WIDTH || projectile.y < -projectile.height || projectile.y > GAME_HEIGHT)) {
          projectileDestroyed = true; // Off-screen
        }

        if (!projectileDestroyed) {
          survivingProjectiles.push(projectile);
        }
      }
      
      setPlayerTank(updatedPlayerTank);
      setEnemyTanks(updatedEnemyTanks.filter(e => e.health > 0)); // Ensure only live enemies are set
      setProjectiles(survivingProjectiles);
      setMap(updatedMap);
      setBase(updatedBase);
      setScore(updatedScore);
      setLives(updatedLives);
      setEnemiesRemainingText(enemiesToSpawnRef.current + updatedEnemyTanks.filter(e => e.health > 0).length);
      
      setExplosions(prevExplosions => 
         [...prevExplosions.filter(exp => Date.now() - exp.startTime < exp.duration), ...newExplosionsThisTick]
      );

      if (!gameOverState) {
        if (updatedLives <= 0 || (updatedBase && updatedBase.health <= 0)) {
          setGameOverState(true);
          onGameOver(false, updatedScore);
        } else if (enemiesToSpawnRef.current <= 0 && updatedEnemyTanks.filter(e => e.health > 0).length === 0) {
          setGameOverState(true);
          onGameOver(true, updatedScore);
        }
      }
      
      if (!isPaused && !gameOverState && enemiesToSpawnRef.current > 0 && updatedEnemyTanks.filter(e => e.health > 0).length < MAX_ACTIVE_ENEMIES) {
        spawnEnemy(); 
      }

    }; 
  }, [ 
    isPaused, gameOverState, playerTank, enemyTanks, projectiles, map, base, score, lives, 
    onGameOver, fireProjectile, spawnEnemy, spawnPlayer // Stable callbacks can be listed
  ]);


  useEffect(() => {
    const loop = (timestamp: number) => {
      if (gameTickRef.current) {
        gameTickRef.current(timestamp);
      }
      if (!gameOverState) { 
         gameLoopRef.current = requestAnimationFrame(loop);
      }
    };

    if (!isPaused && !gameOverState) {
      lastFrameTimeRef.current = performance.now(); 
      gameLoopRef.current = requestAnimationFrame(loop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPaused, gameOverState]);


  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysPressedRef.current = { ...keysPressedRef.current, [e.code]: true };
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressedRef.current = { ...keysPressedRef.current, [e.code]: false };
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { map, playerTank, enemyTanks, projectiles, explosions, base, score, lives, enemiesRemaining: enemiesRemainingText };
};