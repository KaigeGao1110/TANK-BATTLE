
import React from 'react';
import { BaseData } from '../types';

interface BaseProps {
  base: BaseData;
}

const Base: React.FC<BaseProps> = ({ base }) => {
  const { x, y, width, height, color } = base;

  // Render base using provided color classes
  return (
    <div
      className={`absolute flex items-center justify-center text-xs font-bold ${color}`}
      style={{
        left: x,
        top: y,
        width,
        height,
        zIndex: 10,
      }}
      aria-label="Game Base"
    >
      B
    </div>
  );
};

export default Base;
