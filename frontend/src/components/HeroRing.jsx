import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const HeroRing = ({ 
  hours = 0, 
  goalHours = 24, 
  size = 320,
  onCenterClick 
}) => {
  // Determine stage based on hours
  const stage = useMemo(() => {
    if (hours >= 72) return 3; // Gold
    if (hours >= 24) return 2; // Violet
    return 1; // Cyan
  }, [hours]);

  const colors = {
    1: { primary: '#00FFFF', glow: 'rgba(0, 255, 255, 0.5)' },
    2: { primary: '#8A2BE2', glow: 'rgba(138, 43, 226, 0.5)' },
    3: { primary: '#FFD700', glow: 'rgba(255, 215, 0, 0.6)' }
  };

  const currentColor = colors[stage];
  const progress = Math.min((hours / goalHours) * 100, 100);
  
  // SVG circle calculations
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2 - 20;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  // Format time display
  const formatTime = (totalHours) => {
    const h = Math.floor(totalHours);
    const m = Math.floor((totalHours - h) * 60);
    const s = Math.floor(((totalHours - h) * 60 - m) * 60);
    return {
      hours: h.toString().padStart(2, '0'),
      minutes: m.toString().padStart(2, '0'),
      seconds: s.toString().padStart(2, '0')
    };
  };

  const time = formatTime(hours);
  const isGolden = hours >= 100;

  return (
    <div 
      className={`relative cursor-pointer ${isGolden ? 'golden-flare' : ''}`}
      style={{ width: size, height: size }}
      onClick={onCenterClick}
      data-testid="hero-ring"
    >
      {/* Background glow */}
      <div 
        className="absolute inset-0 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: currentColor.primary }}
      />
      
      {/* SVG Ring */}
      <svg 
        className="absolute inset-0 -rotate-90"
        width={size} 
        height={size}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={currentColor.primary}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 10px ${currentColor.glow})`
          }}
          className="pulse-ring"
        />

        {/* Glowing tip */}
        {progress > 0 && (
          <motion.circle
            cx={size / 2 + radius * Math.cos((progress / 100) * 2 * Math.PI - Math.PI / 2)}
            cy={size / 2 + radius * Math.sin((progress / 100) * 2 * Math.PI - Math.PI / 2)}
            r={4}
            fill={currentColor.primary}
            style={{
              filter: `drop-shadow(0 0 8px ${currentColor.primary})`
            }}
            animate={{
              opacity: [1, 0.6, 1],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Timer display */}
        <div className="text-center">
          <div 
            className="font-orbitron text-5xl md:text-6xl font-bold tracking-wider"
            style={{ 
              color: currentColor.primary,
              textShadow: `0 0 20px ${currentColor.glow}`
            }}
            data-testid="timer-display"
          >
            {time.hours}:{time.minutes}:{time.seconds}
          </div>
          <div className="text-zinc-500 text-sm mt-2 font-mono tracking-wide">
            {hours.toFixed(2)} / {goalHours} HOURS
          </div>
        </div>

        {/* Stage indicator */}
        <div 
          className="mt-4 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest"
          style={{
            backgroundColor: `${currentColor.primary}15`,
            color: currentColor.primary,
            border: `1px solid ${currentColor.primary}40`
          }}
        >
          {stage === 1 && 'BIOLOGICAL PHASE'}
          {stage === 2 && 'MENTAL PHASE'}
          {stage === 3 && (isGolden ? 'TRANSCENDENCE' : 'SPIRITUAL PHASE')}
        </div>

        {/* Golden badge */}
        {isGolden && (
          <motion.div 
            className="absolute -top-2 -right-2 w-12 h-12 flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center glow-gold">
              <span className="text-black text-lg">100</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HeroRing;
