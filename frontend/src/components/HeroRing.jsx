import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Activity, 
  Zap, 
  Repeat, 
  ArrowRightLeft, 
  Scale, 
  Magnet, 
  Flame, 
  GitCompare, 
  BatteryCharging, 
  Music2, 
  Sparkles 
} from 'lucide-react';

// Law data with icons and colors
const LAWS_DATA = [
  { law_number: 1, name: "Divine Oneness", icon: Globe, hours_start: 0, hours_end: 8, color: '#00FFFF' },
  { law_number: 2, name: "Vibration", icon: Activity, hours_start: 9, hours_end: 16, color: '#00BFFF' },
  { law_number: 3, name: "Action", icon: Zap, hours_start: 17, hours_end: 24, color: '#4169E1' },
  { law_number: 4, name: "Correspondence", icon: Repeat, hours_start: 25, hours_end: 32, color: '#8A2BE2' },
  { law_number: 5, name: "Cause & Effect", icon: ArrowRightLeft, hours_start: 33, hours_end: 40, color: '#9932CC' },
  { law_number: 6, name: "Compensation", icon: Scale, hours_start: 41, hours_end: 48, color: '#DA70D6' },
  { law_number: 7, name: "Attraction", icon: Magnet, hours_start: 49, hours_end: 56, color: '#FF69B4' },
  { law_number: 8, name: "Perpetual Transmutation", icon: Flame, hours_start: 57, hours_end: 64, color: '#FF4500' },
  { law_number: 9, name: "Relativity", icon: GitCompare, hours_start: 65, hours_end: 72, color: '#FF8C00' },
  { law_number: 10, name: "Polarity", icon: BatteryCharging, hours_start: 73, hours_end: 80, color: '#FFD700' },
  { law_number: 11, name: "Rhythm", icon: Music2, hours_start: 81, hours_end: 90, color: '#F0E68C' },
  { law_number: 12, name: "Gender (Creation)", icon: Sparkles, hours_start: 91, hours_end: 100, color: '#FFFACD' },
];

// Get current law based on hours
const getCurrentLaw = (hours) => {
  for (let i = LAWS_DATA.length - 1; i >= 0; i--) {
    if (hours >= LAWS_DATA[i].hours_start) {
      return LAWS_DATA[i];
    }
  }
  return LAWS_DATA[0];
};

export const HeroRing = ({ 
  hours = 0, 
  goalHours = 24, 
  size = 320,
  onCenterClick 
}) => {
  // Get current law and its properties
  const currentLaw = useMemo(() => getCurrentLaw(hours), [hours]);
  const CurrentLawIcon = currentLaw.icon;
  
  // Determine stage based on hours
  const stage = useMemo(() => {
    if (hours >= 72) return 3; // Gold
    if (hours >= 24) return 2; // Violet
    return 1; // Cyan
  }, [hours]);

  const stageNames = {
    1: 'BIOLOGICAL PHASE',
    2: 'MENTAL PHASE',
    3: 'SPIRITUAL PHASE'
  };

  const progress = Math.min((hours / goalHours) * 100, 100);
  
  // SVG circle calculations - THICKER RING
  const strokeWidth = 12; // Increased from 6 to 12
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
        style={{ backgroundColor: currentLaw.color }}
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
        
        {/* Secondary track glow */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`${currentLaw.color}15`}
          strokeWidth={strokeWidth + 4}
        />
        
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={currentLaw.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 15px ${currentLaw.color}80)`
          }}
          className="pulse-ring"
        />

        {/* Glowing tip */}
        {progress > 0 && (
          <motion.circle
            cx={size / 2 + radius * Math.cos((progress / 100) * 2 * Math.PI - Math.PI / 2)}
            cy={size / 2 + radius * Math.sin((progress / 100) * 2 * Math.PI - Math.PI / 2)}
            r={6}
            fill={currentLaw.color}
            style={{
              filter: `drop-shadow(0 0 12px ${currentLaw.color})`
            }}
            animate={{
              opacity: [1, 0.6, 1],
              scale: [1, 1.3, 1]
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
              color: currentLaw.color,
              textShadow: `0 0 30px ${currentLaw.color}80`
            }}
            data-testid="timer-display"
          >
            {time.hours}:{time.minutes}:{time.seconds}
          </div>
          <div className="text-zinc-500 text-sm mt-2 font-mono tracking-wide">
            {hours.toFixed(2)} / {goalHours} HOURS
          </div>
        </div>

        {/* Stage indicator with Law Icon */}
        <motion.div 
          className="mt-4 px-4 py-2 rounded-full flex items-center gap-2"
          style={{
            backgroundColor: `${currentLaw.color}15`,
            border: `1px solid ${currentLaw.color}40`
          }}
          key={currentLaw.law_number}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CurrentLawIcon 
            size={18} 
            style={{ 
              color: currentLaw.color,
              filter: `drop-shadow(0 0 6px ${currentLaw.color}80)`
            }} 
          />
          <span 
            className="text-xs font-orbitron font-medium tracking-widest"
            style={{ color: currentLaw.color }}
          >
            {stageNames[stage]}
          </span>
        </motion.div>

        {/* Current Law Name */}
        <motion.div 
          className="mt-2 text-xs font-mono tracking-wide"
          style={{ color: `${currentLaw.color}90` }}
          key={`law-${currentLaw.law_number}`}
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          LAW {currentLaw.law_number}: {currentLaw.name.toUpperCase()}
        </motion.div>

        {/* Golden badge */}
        {isGolden && (
          <motion.div 
            className="absolute -top-2 -right-2 w-14 h-14 flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center glow-gold">
              <span className="text-black text-lg font-bold">100+</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HeroRing;
