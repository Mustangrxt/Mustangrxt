import React from 'react';

export const FlowerOfLife = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vmax] h-[150vmax] opacity-[0.04] rotate-slow"
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="flower-pattern" x="0" y="0" width="100" height="86.6" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="43.3" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400" />
            <circle cx="25" cy="0" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400" />
            <circle cx="75" cy="0" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400" />
            <circle cx="0" cy="43.3" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400" />
            <circle cx="100" cy="43.3" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400" />
            <circle cx="25" cy="86.6" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400" />
            <circle cx="75" cy="86.6" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400" />
          </pattern>
          <radialGradient id="fade-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="70%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="fade-mask">
            <rect x="0" y="0" width="500" height="500" fill="url(#fade-gradient)" />
          </mask>
        </defs>
        <rect x="0" y="0" width="500" height="500" fill="url(#flower-pattern)" mask="url(#fade-mask)" />
        {/* Central circles for the Flower of Life core */}
        <g className="text-cyan-400" mask="url(#fade-mask)">
          <circle cx="250" cy="250" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="250" cy="200" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="250" cy="300" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="206.7" cy="225" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="293.3" cy="225" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="206.7" cy="275" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="293.3" cy="275" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </g>
      </svg>
    </div>
  );
};

export default FlowerOfLife;
