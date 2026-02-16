import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { X } from 'lucide-react';

// Color scheme for each Law - progressing through the spectrum
const LAW_COLORS = {
  1: { primary: '#00FFFF', secondary: '#00CED1', glow: 'rgba(0, 255, 255, 0.5)', bg: 'rgba(0, 100, 100, 0.15)' }, // Cyan
  2: { primary: '#00BFFF', secondary: '#1E90FF', glow: 'rgba(0, 191, 255, 0.5)', bg: 'rgba(0, 80, 120, 0.15)' }, // Deep Sky Blue
  3: { primary: '#4169E1', secondary: '#6495ED', glow: 'rgba(65, 105, 225, 0.5)', bg: 'rgba(40, 60, 140, 0.15)' }, // Royal Blue
  4: { primary: '#8A2BE2', secondary: '#9370DB', glow: 'rgba(138, 43, 226, 0.5)', bg: 'rgba(75, 0, 130, 0.15)' }, // Blue Violet
  5: { primary: '#9932CC', secondary: '#BA55D3', glow: 'rgba(153, 50, 204, 0.5)', bg: 'rgba(90, 30, 120, 0.15)' }, // Dark Orchid
  6: { primary: '#DA70D6', secondary: '#EE82EE', glow: 'rgba(218, 112, 214, 0.5)', bg: 'rgba(130, 60, 130, 0.15)' }, // Orchid
  7: { primary: '#FF69B4', secondary: '#FF1493', glow: 'rgba(255, 105, 180, 0.5)', bg: 'rgba(150, 50, 100, 0.15)' }, // Hot Pink
  8: { primary: '#FF4500', secondary: '#FF6347', glow: 'rgba(255, 69, 0, 0.5)', bg: 'rgba(150, 40, 0, 0.15)' }, // Orange Red
  9: { primary: '#FF8C00', secondary: '#FFA500', glow: 'rgba(255, 140, 0, 0.5)', bg: 'rgba(150, 80, 0, 0.15)' }, // Dark Orange
  10: { primary: '#FFD700', secondary: '#FFDF00', glow: 'rgba(255, 215, 0, 0.5)', bg: 'rgba(150, 120, 0, 0.15)' }, // Gold
  11: { primary: '#F0E68C', secondary: '#EEE8AA', glow: 'rgba(240, 230, 140, 0.5)', bg: 'rgba(140, 130, 60, 0.15)' }, // Khaki Gold
  12: { primary: '#FFFACD', secondary: '#FAFAD2', glow: 'rgba(255, 250, 205, 0.6)', bg: 'rgba(150, 140, 80, 0.15)' }, // Lemon Chiffon (Pure Light)
};

export const LawModal = ({ 
  isOpen, 
  onClose, 
  law 
}) => {
  if (!law) return null;

  const isUnlocked = law.isUnlocked;
  const colors = LAW_COLORS[law.law_number] || LAW_COLORS[1];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent 
            className="bg-transparent border-0 shadow-none max-w-lg p-0"
            data-testid="law-modal"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${colors.bg} 0%, rgba(10, 10, 10, 0.95) 50%, ${colors.bg} 100%)`,
                backdropFilter: 'blur(24px)',
                border: `1px solid ${colors.primary}40`,
                boxShadow: `0 0 40px ${colors.glow}, inset 0 0 60px ${colors.bg}`
              }}
            >
              {/* Animated border glow */}
              <div 
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: `linear-gradient(45deg, transparent 30%, ${colors.primary}20 50%, transparent 70%)`,
                  animation: 'shimmer 3s infinite linear'
                }}
              />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/30 text-zinc-400 hover:text-white hover:bg-black/50 transition-colors z-10"
                data-testid="law-modal-close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="p-8 pt-12 relative z-10">
                {/* Law Number Badge */}
                <div className="flex items-center gap-4 mb-6">
                  <motion.div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center font-orbitron text-2xl font-bold"
                    style={{
                      background: isUnlocked 
                        ? `linear-gradient(135deg, ${colors.primary}40 0%, ${colors.primary}20 100%)`
                        : 'rgba(30, 30, 30, 0.8)',
                      border: `2px solid ${isUnlocked ? colors.primary : 'rgba(60, 60, 60, 0.5)'}`,
                      color: isUnlocked ? colors.primary : '#52525B',
                      boxShadow: isUnlocked ? `0 0 20px ${colors.glow}` : 'none'
                    }}
                    animate={isUnlocked ? {
                      boxShadow: [
                        `0 0 20px ${colors.glow}`,
                        `0 0 30px ${colors.glow}`,
                        `0 0 20px ${colors.glow}`
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {law.law_number}
                  </motion.div>
                  <div>
                    <div 
                      className="text-xs font-mono tracking-widest mb-1"
                      style={{ color: `${colors.primary}90` }}
                    >
                      LAW {law.law_number} OF 12
                    </div>
                    <h2 
                      className="font-orbitron text-2xl font-bold"
                      style={{
                        color: isUnlocked ? colors.secondary : '#71717A',
                        textShadow: isUnlocked ? `0 0 20px ${colors.glow}` : 'none'
                      }}
                    >
                      {law.name}
                    </h2>
                  </div>
                </div>

                {/* Phase Badge */}
                <div 
                  className="inline-block px-4 py-2 rounded-lg mb-6"
                  style={{
                    background: `${colors.primary}15`,
                    border: `1px solid ${colors.primary}30`
                  }}
                >
                  <span style={{ color: colors.primary }} className="font-mono text-sm">
                    Fasting Phase: <span className="font-bold">{law.phase}</span>
                  </span>
                </div>

                {/* Title - "The Why" */}
                <div className="mb-4">
                  <div className="text-xs text-zinc-500 tracking-widest mb-2">THE BREAKDOWN</div>
                  <h3 
                    className="font-orbitron text-xl"
                    style={{
                      color: colors.secondary,
                      textShadow: `0 0 10px ${colors.glow}`
                    }}
                  >
                    {law.title}
                  </h3>
                </div>

                {/* Description */}
                <p 
                  className="text-base leading-relaxed"
                  style={{
                    color: isUnlocked ? '#E8E8E8' : '#9CA3AF'
                  }}
                >
                  {law.breakdown}
                </p>

                {/* Status indicator */}
                <div 
                  className="mt-8 pt-6"
                  style={{ borderTop: `1px solid ${colors.primary}20` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: isUnlocked ? colors.primary : '#52525B',
                          boxShadow: isUnlocked ? `0 0 10px ${colors.glow}` : 'none'
                        }}
                        animate={isUnlocked ? {
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.7, 1]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span 
                        className="text-sm font-medium"
                        style={{ color: isUnlocked ? colors.primary : '#52525B' }}
                      >
                        {isUnlocked ? 'ACTIVATED' : 'LOCKED'}
                      </span>
                    </div>
                    {!isUnlocked && (
                      <span className="text-xs text-zinc-500">
                        Unlocks at {law.hours_start}h
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default LawModal;
