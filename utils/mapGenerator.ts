
import { GameMap, MapTile, TileType } from '../types';
import { GAME_ROWS, GAME_COLS, TILE_SIZE, BRICK_HEALTH, DEFAULT_MAP_TEMPLATE, generateId } from '../constants';

export const generateInitialMap = (): GameMap => {
  const map: GameMap = [];
  for (let r = 0; r < GAME_ROWS; r++) {
    map[r] = [];
    for (let c = 0; c < GAME_COLS; c++) {
      const tileType = DEFAULT_MAP_TEMPLATE[r]?.[c] ?? TileType.EMPTY;
      map[r][c] = {
        id: generateId(),
        type: tileType,
        health: tileType === TileType.BRICK ? BRICK_HEALTH : undefined,
      };
    }
  }
  return map;
};