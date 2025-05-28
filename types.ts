
export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export interface Position {
  x: number;
  y: number;
}

export interface GameObject extends Position {
  id: string;
  width: number;
  height: number;
}

export interface TankData extends GameObject {
  direction: Direction;
  color: string;
  health: number;
  isPlayer: boolean;
  lastShotTime: number;
  speed: number;
}

export interface ProjectileData extends GameObject {
  direction: Direction;
  ownerId: string; // ID of the tank that fired it
  speed: number;
}

export enum TileType {
  EMPTY = 0,
  BRICK = 1,
  STEEL = 2,
}

export interface MapTile {
  id: string;
  type: TileType;
  health?: number; // For destructible bricks
}

export type GameMap = MapTile[][];

export interface ExplosionData extends Position {
  id:string;
  startTime: number;
  duration: number;
  size: number;
  color: string;
}

export enum GameStatus {
  START_SCREEN,
  PLAYING,
  PAUSED,
  GAME_OVER_WIN,
  GAME_OVER_LOSE,
}

export interface KeysPressed {
  [key: string]: boolean;
}

export interface BaseData extends GameObject {
  health: number;
  color: string;
}
