
import React from 'react';
import { TankData, Direction } from '../types';
// import { TANK_SIZE } from '../constants'; // TANK_SIZE is implicitly part of tank.width/height

interface TankProps {
  tank: TankData;
}

const Tank: React.FC<TankProps> = ({ tank }) => {
  const { x, y, direction, color, width, height } = tank;

  // Turret Design: Longer and more prominent
  const turretThickness = Math.min(width, height) * 0.22; // Barrel thickness
  const turretLength = Math.min(width, height) * 0.7;  // Barrel length, protruding from center

  let turretStyle: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)', // Darker shade for turret, more opaque
    borderRadius: '2px', // Slightly rounded barrel tip
  };

  // Position the turret to pivot around the tank's center
  // The (left, top) CSS properties are relative to the tank's div
  switch (direction) {
    case Direction.UP:
      turretStyle = {
        ...turretStyle,
        width: turretThickness,
        height: turretLength,
        left: (width - turretThickness) / 2,
        top: (height / 2) - turretLength, // Bottom of barrel aligns with tank center
      };
      break;
    case Direction.DOWN:
      turretStyle = {
        ...turretStyle,
        width: turretThickness,
        height: turretLength,
        left: (width - turretThickness) / 2,
        top: height / 2, // Top of barrel aligns with tank center
      };
      break;
    case Direction.LEFT:
      turretStyle = {
        ...turretStyle,
        width: turretLength,
        height: turretThickness,
        left: (width / 2) - turretLength, // Right end of barrel aligns with tank center
        top: (height - turretThickness) / 2,
      };
      break;
    case Direction.RIGHT:
      turretStyle = {
        ...turretStyle,
        width: turretLength,
        height: turretThickness,
        left: width / 2, // Left end of barrel aligns with tank center
        top: (height - turretThickness) / 2,
      };
      break;
  }

  return (
    <div
      className={`absolute ${color} border border-black/30 rounded-sm flex justify-center items-center transition-all duration-50 ease-linear`}
      style={{
        left: x,
        top: y,
        width: width,
        height: height,
      }}
      aria-label={`Tank facing ${direction}`}
    >
      <div style={turretStyle} aria-hidden="true" />
    </div>
  );
};

export default Tank;
