import React from 'react';
import { ProjectileData } from '../types';
import { PROJECTILE_COLOR } from '../constants';

interface ProjectileProps {
  projectile: ProjectileData;
}

const Projectile: React.FC<ProjectileProps> = ({ projectile }) => {
  const { x, y, width, height } = projectile; // Changed: Deconstruct x, y directly

  return (
    <div
      className={`absolute ${PROJECTILE_COLOR} rounded-sm`}
      style={{
        left: x, // Changed: Use x directly
        top: y,  // Changed: Use y directly
        width: width,
        height: height,
        boxShadow: '0 0 5px 1px rgba(250, 204, 21, 0.7)' // yellow-400 glow
      }}
    />
  );
};

export default Projectile;