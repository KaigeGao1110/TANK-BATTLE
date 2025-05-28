
import React from 'react';
import { BaseData } from '../types';

interface BaseProps {
  base: BaseData;
}

const Base: React.FC<BaseProps> = ({ base }) => {
  const { x, y, width, height } = base;

  // Simplified rendering for debugging: A solid red square
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: width,
        height: height,
        backgroundColor: 'red',
        border: '2px solid black',
        zIndex: 10, // Ensure it's reasonably high in stacking context
      }}
      aria-label="Game Base (Debug)"
    >
      <span style={{color: 'white', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}>B</span>
    </div>
  );
};

export default Base;
