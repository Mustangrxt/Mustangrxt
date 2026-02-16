import React from 'react';
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
  CircleDashed 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';

const LAWS = [
  { name: "Divine Oneness", icon: Globe, hours: 1, description: "All is one. Your cells begin their sacred journey." },
  { name: "Vibration", icon: Activity, hours: 4, description: "Everything vibrates. Your frequency rises." },
  { name: "Action", icon: Zap, hours: 8, description: "Movement creates change. Ketones begin forming." },
  { name: "Correspondence", icon: Repeat, hours: 12, description: "As above, so below. Growth hormone surges." },
  { name: "Cause and Effect", icon: ArrowRightLeft, hours: 16, description: "Every action has a reaction. Autophagy initiates." },
  { name: "Compensation", icon: Scale, hours: 20, description: "You receive what you give. Fat burning peaks." },
  { name: "Attraction", icon: Magnet, hours: 24, description: "Like attracts like. Cellular renewal accelerates." },
  { name: "Transmutation", icon: Flame, hours: 36, description: "Energy transforms. Deep autophagy engaged." },
  { name: "Relativity", icon: GitCompare, hours: 48, description: "All is relative. Stem cells activate." },
  { name: "Polarity", icon: BatteryCharging, hours: 60, description: "Opposites are identical. Immune reset begins." },
  { name: "Rhythm", icon: Music2, hours: 72, description: "Everything flows. Full cellular regeneration." },
  { name: "Gender", icon: CircleDashed, hours: 100, description: "Balance achieved. Transcendence complete." }
];

export const MilestoneIcons = ({ currentHours = 0 }) => {
  const getStageColor = (hours) => {
    if (hours >= 72) return { primary: '#FFD700', glow: 'rgba(255, 215, 0, 0.5)' };
    if (hours >= 24) return { primary: '#8A2BE2', glow: 'rgba(138, 43, 226, 0.5)' };
    return { primary: '#00FFFF', glow: 'rgba(0, 255, 255, 0.5)' };
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col gap-3" data-testid="milestone-icons">
        {LAWS.map((law, index) => {
          const isUnlocked = currentHours >= law.hours;
          const isNext = !isUnlocked && (index === 0 || currentHours >= LAWS[index - 1].hours);
          const color = getStageColor(law.hours);
          const Icon = law.icon;

          return (
            <Tooltip key={law.name}>
              <TooltipTrigger asChild>
                <motion.div
                  className={`relative cursor-pointer ${isUnlocked ? 'milestone-active' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  data-testid={`milestone-${law.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {/* Hexagonal container */}
                  <div 
                    className="relative w-12 h-12 flex items-center justify-center"
                    style={{
                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                    }}
                  >
                    {/* Background */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        backgroundColor: isUnlocked ? `${color.primary}20` : '#18181B',
                        transition: 'all 0.3s ease'
                      }}
                    />
                    
                    {/* Border effect */}
                    <div 
                      className="absolute inset-[2px]"
                      style={{
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        backgroundColor: '#0A0A0A'
                      }}
                    />

                    {/* Icon */}
                    <Icon 
                      size={20}
                      className="relative z-10 transition-all duration-300"
                      style={{
                        color: isUnlocked ? color.primary : '#52525B',
                        filter: isUnlocked ? `drop-shadow(0 0 6px ${color.glow})` : 'none'
                      }}
                    />
                  </div>

                  {/* Next indicator */}
                  {isNext && (
                    <motion.div 
                      className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-cyan-400"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [1, 0.5, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    />
                  )}

                  {/* Hours label */}
                  <div 
                    className="absolute -right-8 top-1/2 -translate-y-1/2 text-[10px] font-mono"
                    style={{
                      color: isUnlocked ? color.primary : '#52525B'
                    }}
                  >
                    {law.hours}h
                  </div>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                className="glass-card max-w-xs p-4"
                sideOffset={20}
              >
                <div className="space-y-2">
                  <div 
                    className="font-orbitron text-sm font-bold"
                    style={{ color: color.primary }}
                  >
                    {law.name}
                  </div>
                  <div className="text-zinc-400 text-xs">
                    Unlocks at {law.hours} hours
                  </div>
                  <div className="text-zinc-300 text-sm leading-relaxed">
                    {law.description}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default MilestoneIcons;
