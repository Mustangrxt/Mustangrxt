import React, { useState } from 'react';
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
import { LawModal } from './LawModal';

// Color scheme for each Law - progressing through the spectrum
const LAW_COLORS = {
  1: { primary: '#00FFFF', glow: 'rgba(0, 255, 255, 0.5)' }, // Cyan
  2: { primary: '#00BFFF', glow: 'rgba(0, 191, 255, 0.5)' }, // Deep Sky Blue
  3: { primary: '#4169E1', glow: 'rgba(65, 105, 225, 0.5)' }, // Royal Blue
  4: { primary: '#8A2BE2', glow: 'rgba(138, 43, 226, 0.5)' }, // Blue Violet
  5: { primary: '#9932CC', glow: 'rgba(153, 50, 204, 0.5)' }, // Dark Orchid
  6: { primary: '#DA70D6', glow: 'rgba(218, 112, 214, 0.5)' }, // Orchid
  7: { primary: '#FF69B4', glow: 'rgba(255, 105, 180, 0.5)' }, // Hot Pink
  8: { primary: '#FF4500', glow: 'rgba(255, 69, 0, 0.5)' }, // Orange Red
  9: { primary: '#FF8C00', glow: 'rgba(255, 140, 0, 0.5)' }, // Dark Orange
  10: { primary: '#FFD700', glow: 'rgba(255, 215, 0, 0.5)' }, // Gold
  11: { primary: '#F0E68C', glow: 'rgba(240, 230, 140, 0.5)' }, // Khaki Gold
  12: { primary: '#FFFACD', glow: 'rgba(255, 250, 205, 0.6)' }, // Lemon Chiffon (Pure Light)
};

// Updated 12 Laws with new data structure
const LAWS = [
  { law_number: 1, name: "Divine Oneness", icon: Globe, hours_start: 0, hours_end: 8, phase: "0-8 Hours", title: "The Connection", breakdown: "Your body is not separate from your mind. As your blood sugar stabilizes, you realize that every choice you make ripples through your entire existence." },
  { law_number: 2, name: "Vibration", icon: Activity, hours_start: 9, hours_end: 16, phase: "9-16 Hours", title: "The Shift", breakdown: "Everything is in motion. Your body is shifting its frequency from 'sugar-burning' to 'fat-burning,' elevating your metabolic vibration." },
  { law_number: 3, name: "Action", icon: Zap, hours_start: 17, hours_end: 24, phase: "17-24 Hours", title: "The Sacrifice", breakdown: "Growth requires movement. Autophagy begins here; you are actively destroying the old to make room for the new." },
  { law_number: 4, name: "Correspondence", icon: Repeat, hours_start: 25, hours_end: 32, phase: "25-32 Hours", title: "The Mirror", breakdown: "'As within, so without.' Your internal cellular repair is a direct reflection of your external discipline and Will." },
  { law_number: 5, name: "Cause & Effect", icon: ArrowRightLeft, hours_start: 33, hours_end: 40, phase: "33-40 Hours", title: "The Harvest", breakdown: "Every hour of hunger is a 'cause' that produces the 'effect' of massive Growth Hormone surges. You reap what you sow." },
  { law_number: 6, name: "Compensation", icon: Scale, hours_start: 41, hours_end: 48, phase: "41-48 Hours", title: "The Reward", breakdown: "The Universe rewards sacrifice. As the brain creates BDNF, you are compensated with elite mental clarity and focus." },
  { law_number: 7, name: "Attraction", icon: Magnet, hours_start: 49, hours_end: 56, phase: "49-56 Hours", title: "The Magnet", breakdown: "Peak Autophagy. As you purge toxins, your vessel becomes clean, attracting higher thoughts and creative energy." },
  { law_number: 8, name: "Perpetual Transmutation", icon: Flame, hours_start: 57, hours_end: 64, phase: "57-64 Hours", title: "The Alchemy", breakdown: "Energy cannot be destroyed. You are transmuting physical hunger into raw, usable spiritual power." },
  { law_number: 9, name: "Relativity", icon: GitCompare, hours_start: 65, hours_end: 72, phase: "65-72 Hours", title: "The Perspective", breakdown: "Your 'struggle' is relative. Compared to the strength of your Spirit, the body's temporary hunger is an illusion." },
  { law_number: 10, name: "Polarity", icon: BatteryCharging, hours_start: 73, hours_end: 80, phase: "73-80 Hours", title: "The Duality", breakdown: "Hunger and Fullness are two sides of one coin. You cannot know true Abundance until you have mastered the Void." },
  { law_number: 11, name: "Rhythm", icon: Music2, hours_start: 81, hours_end: 90, phase: "81-90 Hours", title: "The Pulse", breakdown: "You have exited the chaos of modern eating and entered the natural rhythm of the Earth. You are in sync with the All." },
  { law_number: 12, name: "Gender (Creation)", icon: Sparkles, hours_start: 91, hours_end: 100, phase: "91-100+ Hours", title: "The Birth", breakdown: "Stem Cell Regeneration. You have birthed a new biological version of yourself. You are the Creator of your own Vessel." }
];

export const MilestoneIcons = ({ currentHours = 0 }) => {
  const [selectedLaw, setSelectedLaw] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLawClick = (law, isUnlocked) => {
    setSelectedLaw({ ...law, isUnlocked });
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-3" data-testid="milestone-icons">
        {LAWS.map((law, index) => {
          const isUnlocked = currentHours >= law.hours_start;
          const isActive = currentHours >= law.hours_start && currentHours < law.hours_end;
          const isNext = !isUnlocked && (index === 0 || currentHours >= LAWS[index - 1].hours_start);
          const color = LAW_COLORS[law.law_number];
          const Icon = law.icon;

          return (
            <motion.div
              key={law.name}
              className={`relative cursor-pointer ${isActive ? 'milestone-active' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleLawClick(law, isUnlocked)}
              data-testid={`milestone-${law.name.toLowerCase().replace(/\s+/g, '-').replace(/[()&]/g, '')}`}
              tabIndex={0}
              role="button"
            >
              {/* Hexagonal container */}
              <div 
                className="relative w-12 h-12 flex items-center justify-center transition-transform hover:scale-110"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                }}
              >
                {/* Background */}
                <div 
                  className="absolute inset-0 transition-all duration-300"
                  style={{
                    backgroundColor: isUnlocked ? `${color.primary}20` : '#18181B',
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

                {/* Active glow ring */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                      boxShadow: `inset 0 0 15px ${color.glow}`
                    }}
                    animate={{
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                  />
                )}

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
                  className="absolute -right-1 -top-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: color.primary }}
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

              {/* Phase label */}
              <div 
                className="absolute -right-14 top-1/2 -translate-y-1/2 text-[10px] font-mono whitespace-nowrap"
                style={{
                  color: isUnlocked ? color.primary : '#52525B'
                }}
              >
                {law.phase.split(' ')[0]}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Law Modal */}
      <LawModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        law={selectedLaw}
      />
    </>
  );
};

export default MilestoneIcons;
