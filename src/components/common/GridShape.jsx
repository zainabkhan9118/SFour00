import React from 'react';

const GridShape = () => {
  return (
    <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-4 opacity-30">
      {/* Generate a 12x12 grid of dots */}
      {Array.from({ length: 144 }).map((_, i) => (
        <div 
          key={i}
          className="w-1 h-1 bg-white rounded-full" 
        />
      ))}
    </div>
  );
};

export default GridShape;