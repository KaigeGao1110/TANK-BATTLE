
import React from 'react';
import { ExplosionData } from '../types';
import { EXPLOSION_DURATION } from '../constants';

interface ExplosionProps {
  explosion: ExplosionData;
}

const Explosion: React.FC<ExplosionProps> = ({ explosion }) => {
  const { x, y, size, startTime, duration, color } = explosion;
  const elapsedTime = Date.now() - startTime;
  const progress = Math.min(elapsedTime / duration, 1);
  const currentSize = size * progress;
  const opacity = 1 - progress;

  if (progress >= 1) return null;

  return (
    <div
      className={`absolute rounded-full ${color}`}
      style={{
        left: x - currentSize / 2,
        top: y - currentSize / 2,
        width: currentSize,
        height: currentSize,
        opacity: opacity,
        transform: 'scale(1)', // Ensure transform is applied for smooth animation
        transition: `opacity ${EXPLOSION_DURATION / 2}ms ease-out, transform ${duration}ms ease-out`,
      }}
    />
  );
};

export default Explosion;
    