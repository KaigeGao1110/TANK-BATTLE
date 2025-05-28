
import { TileType } from './types';

export const TILE_SIZE = 32; // pixels
export const GAME_ROWS = 16; // Adjusted for HUD space potentially
export const GAME_COLS = 22;

export const GAME_WIDTH = GAME_COLS * TILE_SIZE;
export const GAME_HEIGHT = GAME_ROWS * TILE_SIZE;

export const PLAYER_TANK_SPEED = 2;
export const ENEMY_TANK_SPEED = 0.6; // Reduced from 1
export const PROJECTILE_SPEED = 5;

export const TANK_SIZE = TILE_SIZE * 0.9; // Tank body will be slightly smaller than a tile
export const PROJECTILE_WIDTH = 6; // For vertical travel
export const PROJECTILE_HEIGHT = 10; // For vertical travel


export const PLAYER_START_LIVES = 3;
export const INITIAL_ENEMY_COUNT = 20; 
export const MAX_ACTIVE_ENEMIES = 1; // Changed from 5 to 1

export const TANK_FIRE_COOLDOWN = 500; // ms for player
export const ENEMY_FIRE_COOLDOWN = 1000; // ms for enemy

export const EXPLOSION_DURATION = 400; // ms
export const EXPLOSION_MAX_SIZE = TILE_SIZE * 1.2;

// Colors
export const PLAYER_TANK_COLOR = 'bg-yellow-500'; // Changed from bg-green-500
export const ENEMY_TANK_COLOR = 'bg-red-600';
export const PROJECTILE_COLOR = 'bg-yellow-400';
export const BRICK_WALL_COLOR = 'bg-orange-700';
export const STEEL_WALL_COLOR = 'bg-gray-500';
export const BACKGROUND_COLOR = 'bg-gray-900'; // Game area background
export const TEXT_COLOR = 'text-gray-100';
export const HUD_BACKGROUND_COLOR = 'bg-gray-700';
export const BASE_COLOR = 'bg-yellow-400 border-2 border-yellow-600'; // Changed from bg-blue-400 border-2 border-blue-600


export const TANK_INITIAL_HEALTH = 3; // Hits a tank can take
export const BRICK_HEALTH = 1; // Hits a brick wall can take
export const BASE_INITIAL_HEALTH = 3; // Hits the base can take
export const BASE_SIZE = TILE_SIZE;


// Adjusted Player Spawn and new Base Position
// Player spawns to the left of the base. Base is near bottom-center.
export const PLAYER_SPAWN_POSITION = { x: TILE_SIZE * (GAME_COLS / 2 - 4), y: TILE_SIZE * (GAME_ROWS - 2) };
export const BASE_POSITION = { x: TILE_SIZE * (GAME_COLS / 2), y: TILE_SIZE * (GAME_ROWS - 2) }; // map[14][11]

export const ENEMY_SPAWN_POSITIONS: { x: number; y: number }[] = [
  { x: TILE_SIZE * 2, y: TILE_SIZE * 2 }, // Corresponds to map[2][2]
  { x: TILE_SIZE * (GAME_COLS / 2), y: TILE_SIZE * 2 }, // Corresponds to map[2][11]
  { x: TILE_SIZE * (GAME_COLS - 3), y: TILE_SIZE * 2 }, // Corresponds to map[2][19]
];

export const generateId = (): string => `id-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

// Base protection: map[14][11] is base.
// Walls at: [13][10], [13][11], [13][12] (row above base)
// Walls at: [14][10] (left), [14][12] (right)
export const DEFAULT_MAP_TEMPLATE: TileType[][] = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2], // Row 0
  [2,0,0,0,1,1,0,0,0,0,2,0,0,0,0,0,1,1,0,0,0,2], // Row 1
  [2,0,0,0,0,1,0,2,2,0,2,0,2,2,0,1,0,0,2,0,0,2], // Row 2 (Cell [2][2] is 0 for enemy spawn)
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2], // Row 3
  [2,0,1,1,0,2,2,0,1,1,1,1,1,1,0,2,2,0,1,1,0,2], // Row 4
  [2,0,0,0,0,2,0,0,0,1,2,1,0,0,0,2,0,0,0,0,0,2], // Row 5
  [2,1,1,0,0,0,0,1,0,0,2,0,0,1,0,0,0,0,1,1,0,2], // Row 6
  [2,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,2], // Row 7
  [2,0,2,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,2,0,0,2], // Row 8
  [2,0,0,0,2,2,0,0,0,0,1,0,0,0,0,2,2,0,0,0,0,2], // Row 9
  [2,1,1,0,0,0,0,1,2,0,0,0,2,1,0,0,0,0,1,1,0,2], // Row 10
  [2,0,0,0,1,1,0,0,0,1,2,1,0,0,0,1,1,0,0,0,0,2], // Row 11
  [2,0,2,0,0,1,2,2,0,0,2,0,0,2,2,1,0,0,2,0,0,2], // Row 12
  // Row 13: Base protection (above base)
  [2,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,2], // Row 13 (cells 10,11,12 are BRICK)
  // Row 14: Player spawn [14][7], Base [14][11]. Walls at [14][10] & [14][12]
  [2,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,0,2], // Row 14 (cell 7,11 are EMPTY, cell 10,12 are BRICK)
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2], // Row 15
];
