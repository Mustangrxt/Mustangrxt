import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Clock } from 'lucide-react';
import { Button } from './ui/button';

const FoodPyramidModal = ({ isOpen, onClose, hoursCompleted, endTime }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer counting since fast ended
  useEffect(() => {
    if (!isOpen) return;
    
    const startTime = endTime ? new Date(endTime) : new Date();
    
    const updateTimer = () => {
      const now = new Date();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedSeconds(elapsed);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isOpen, endTime]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pyramidLevels = [
    {
      name: "Divine Light",
      vibration: "Highest",
      foods: ["Fresh Juices", "Raw Fruits", "Sprouts", "Living Water"],
      textColor: "text-yellow-400",
      borderColor: "border-yellow-400/40",
      bgColor: "bg-yellow-400/10",
    },
    {
      name: "Solar Energy",
      vibration: "Very High",
      foods: ["Raw Vegetables", "Nuts", "Seeds", "Herbs"],
      textColor: "text-orange-400",
      borderColor: "border-orange-400/40",
      bgColor: "bg-orange-400/10",
    },
    {
      name: "Earth's Vitality",
      vibration: "High",
      foods: ["Grass-Fed Meat", "Wild Fish", "Pasture Eggs", "Bone Broth"],
      textColor: "text-cyan-400",
      borderColor: "border-cyan-400/40",
      bgColor: "bg-cyan-400/10",
    },
    {
      name: "Grounded Nourishment",
      vibration: "Moderate",
      foods: ["Cooked Vegetables", "Legumes", "Whole Grains", "Fermented"],
      textColor: "text-violet-400",
      borderColor: "border-violet-400/40",
      bgColor: "bg-violet-400/10",
    },
    {
      name: "Dense Matter",
      vibration: "Low",
      foods: ["Processed Foods", "Refined Sugar", "Conventional Meat"],
      textColor: "text-zinc-500",
      borderColor: "border-zinc-600/40",
      bgColor: "bg-zinc-600/10",
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/95 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg glass rounded-xl p-4 max-h-[95vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            data-testid="food-pyramid-modal"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-300 transition-colors z-10"
              data-testid="close-food-pyramid"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Timer */}
            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <h2 className="text-lg font-bold text-zinc-100">
                  The Vibrational Food Pyramid
                </h2>
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
              
              {/* Eating Window Timer */}
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span className="text-zinc-500 text-xs">Eating Window:</span>
                <span className="font-mono text-cyan-400 text-sm font-bold">{formatTime(elapsedSeconds)}</span>
              </div>
              
              {hoursCompleted && (
                <p className="text-zinc-600 text-xs mt-1">
                  {hoursCompleted.toFixed(1)} hours transmutation completed
                </p>
              )}
            </div>

            {/* Compact Pyramid */}
            <div className="flex flex-col items-center gap-1 mb-3">
              {pyramidLevels.map((level, index) => {
                const widths = ['w-32', 'w-44', 'w-56', 'w-68', 'w-80'];
                return (
                  <motion.div
                    key={level.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.03 * index }}
                    className={`${widths[index]} max-w-full ${level.bgColor} ${level.borderColor} border rounded-lg py-1.5 px-2 text-center`}
                  >
                    <div className={`text-[9px] font-bold ${level.textColor} uppercase tracking-wider`}>
                      {level.name}
                    </div>
                    <div className="flex flex-wrap justify-center gap-0.5 mt-0.5">
                      {level.foods.map((food) => (
                        <span 
                          key={food}
                          className={`text-[8px] px-1.5 py-0.5 rounded-full ${level.bgColor} ${level.textColor} border ${level.borderColor}`}
                        >
                          {food}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Sacred Quote - Compact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center p-3 glass-card rounded-lg border border-yellow-400/20 mb-3"
            >
              <div className="text-yellow-400/60 text-[9px] uppercase tracking-widest mb-1">
                Sacred Wisdom
              </div>
              <blockquote className="text-zinc-300 italic text-xs leading-relaxed">
                "The body is your temple. Keep it pure and clean for the soul to reside in."
              </blockquote>
              <div className="mt-1 text-zinc-500 text-[10px]">
                — Feed it with light, and it shall radiate with the energy of the universe
              </div>
            </motion.div>

            {/* Action Button */}
            <div className="text-center">
              <Button
                onClick={onClose}
                className="btn-gold px-6 py-2 text-sm"
                data-testid="close-pyramid-btn"
              >
                Begin Eating Window
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { FoodPyramidModal };
