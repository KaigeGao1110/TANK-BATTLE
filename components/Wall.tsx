
import React from 'react';
import { MapTile, TileType } from '../types';
import { TILE_SIZE, BRICK_WALL_COLOR, STEEL_WALL_COLOR } from '../constants';

interface WallProps {
  tile: MapTile;
  x: number;
  y: number;
}

const Wall: React.FC<WallProps> = ({ tile, x, y }) => {
  if (tile.type === TileType.EMPTY) {
    return null;
  }

  let colorClass = '';
  if (tile.type === TileType.BRICK) {
    colorClass = BRICK_WALL_COLOR;
  } else if (tile.type === TileType.STEEL) {
    colorClass = STEEL_WALL_COLOR;
  }

  return (
    <div
      className={`absolute ${colorClass} border border-black/20`}
      style={{
        left: x,
        top: y,
        width: TILE_SIZE,
        height: TILE_SIZE,
      }}
    />
  );
};

export default Wall;
    