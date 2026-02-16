import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { X } from 'lucide-react';

export const LawModal = ({ 
  isOpen, 
  onClose, 
  law 
}) => {
  if (!law) return null;

  const isUnlocked = law.isUnlocked;
  
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
                background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.15) 0%, rgba(75, 0, 130, 0.2) 50%, rgba(138, 43, 226, 0.1) 100%)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(138, 43, 226, 0.4)',
                boxShadow: '0 0 40px rgba(138, 43, 226, 0.3), inset 0 0 60px rgba(138, 43, 226, 0.05)'
              }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/30 text-zinc-400 hover:text-white hover:bg-black/50 transition-colors z-10"
                data-testid="law-modal-close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="p-8 pt-12">
                {/* Law Number Badge */}
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center font-orbitron text-2xl font-bold"
                    style={{
                      background: isUnlocked 
                        ? 'linear-gradient(135deg, rgba(138, 43, 226, 0.4) 0%, rgba(138, 43, 226, 0.2) 100%)'
                        : 'rgba(30, 30, 30, 0.8)',
                      border: `2px solid ${isUnlocked ? 'rgba(138, 43, 226, 0.6)' : 'rgba(60, 60, 60, 0.5)'}`,
                      color: isUnlocked ? '#8A2BE2' : '#52525B',
                      boxShadow: isUnlocked ? '0 0 20px rgba(138, 43, 226, 0.4)' : 'none'
                    }}
                  >
                    {law.law_number}
                  </div>
                  <div>
                    <div className="text-xs text-violet-400/70 font-mono tracking-widest mb-1">
                      LAW {law.law_number} OF 12
                    </div>
                    <h2 
                      className="font-orbitron text-2xl font-bold"
                      style={{
                        color: isUnlocked ? '#DDA0DD' : '#71717A',
                        textShadow: isUnlocked ? '0 0 20px rgba(138, 43, 226, 0.5)' : 'none'
                      }}
                    >
                      {law.name}
                    </h2>
                  </div>
                </div>

                {/* Phase */}
                <div 
                  className="inline-block px-4 py-2 rounded-lg mb-6"
                  style={{
                    background: 'rgba(138, 43, 226, 0.15)',
                    border: '1px solid rgba(138, 43, 226, 0.3)'
                  }}
                >
                  <span className="text-violet-300 font-mono text-sm">
                    Fasting Phase: <span className="font-bold">{law.phase}</span>
                  </span>
                </div>

                {/* Title - "The Why" */}
                <div className="mb-4">
                  <div className="text-xs text-zinc-500 tracking-widest mb-2">THE BREAKDOWN</div>
                  <h3 
                    className="font-orbitron text-xl"
                    style={{
                      color: '#C9A0DC',
                      textShadow: '0 0 10px rgba(138, 43, 226, 0.3)'
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
                <div className="mt-8 pt-6 border-t border-violet-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-3 h-3 rounded-full ${isUnlocked ? 'bg-violet-400 glow-violet' : 'bg-zinc-600'}`}
                        style={{
                          animation: isUnlocked ? 'pulse 2s infinite' : 'none'
                        }}
                      />
                      <span className={`text-sm font-medium ${isUnlocked ? 'text-violet-300' : 'text-zinc-500'}`}>
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
