import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

const FoodPyramidModal = ({ isOpen, onClose, hoursCompleted }) => {
  const pyramidLevels = [
    {
      level: 1,
      name: "Divine Light",
      vibration: "Highest",
      foods: ["Fresh Juices", "Raw Fruits", "Sprouts", "Living Water"],
      color: "from-yellow-400 to-yellow-500",
      textColor: "text-yellow-400",
      borderColor: "border-yellow-400/50",
      bgColor: "bg-yellow-400/10",
      width: "w-32"
    },
    {
      level: 2,
      name: "Solar Energy",
      vibration: "Very High",
      foods: ["Raw Vegetables", "Nuts", "Seeds", "Herbs"],
      color: "from-yellow-500 to-orange-400",
      textColor: "text-orange-400",
      borderColor: "border-orange-400/50",
      bgColor: "bg-orange-400/10",
      width: "w-48"
    },
    {
      level: 3,
      name: "Earth's Vitality",
      vibration: "High",
      foods: ["Grass-Fed Meat", "Wild Fish", "Pasture Eggs", "Bone Broth"],
      color: "from-cyan-400 to-cyan-500",
      textColor: "text-cyan-400",
      borderColor: "border-cyan-400/50",
      bgColor: "bg-cyan-400/10",
      width: "w-64"
    },
    {
      level: 4,
      name: "Grounded Nourishment",
      vibration: "Moderate",
      foods: ["Cooked Vegetables", "Legumes", "Whole Grains", "Fermented Foods"],
      color: "from-violet-400 to-violet-500",
      textColor: "text-violet-400",
      borderColor: "border-violet-400/50",
      bgColor: "bg-violet-400/10",
      width: "w-80"
    },
    {
      level: 5,
      name: "Dense Matter",
      vibration: "Low",
      foods: ["Processed Foods", "Refined Sugar", "Conventional Meat", "Artificial Additives"],
      color: "from-zinc-500 to-zinc-600",
      textColor: "text-zinc-500",
      borderColor: "border-zinc-600/50",
      bgColor: "bg-zinc-600/10",
      width: "w-96"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl glass rounded-2xl p-8 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            data-testid="food-pyramid-modal"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors z-10"
              data-testid="close-food-pyramid"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 mb-4"
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-zinc-100">
                  The Vibrational Food Pyramid
                </h2>
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
              <p className="text-zinc-500 text-sm">
                Your Eating Window Guide • {hoursCompleted?.toFixed(1) || 0} Hours Completed
              </p>
            </div>

            {/* Pyramid */}
            <div className="flex flex-col items-center gap-2 mb-8">
              {pyramidLevels.map((level, index) => (
                <motion.div
                  key={level.level}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`${level.width} ${level.bgColor} ${level.borderColor} border rounded-lg p-3 text-center relative overflow-hidden`}
                  style={{
                    clipPath: index === 0 
                      ? 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' 
                      : 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)'
                  }}
                >
                  {/* Glow effect for top levels */}
                  {index < 2 && (
                    <div className={`absolute inset-0 bg-gradient-to-b ${level.color} opacity-10`} />
                  )}
                  
                  <div className="relative z-10">
                    <div className={`text-xs font-bold ${level.textColor} uppercase tracking-wider mb-1`}>
                      {level.name}
                    </div>
                    <div className="text-[10px] text-zinc-400 mb-2">
                      {level.vibration} Vibration
                    </div>
                    <div className="flex flex-wrap justify-center gap-1">
                      {level.foods.map((food) => (
                        <span 
                          key={food}
                          className={`text-[9px] px-2 py-0.5 rounded-full ${level.bgColor} ${level.textColor} border ${level.borderColor}`}
                        >
                          {food}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sacred Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center p-6 glass-card rounded-xl border border-yellow-400/20"
            >
              <div className="text-yellow-400/60 text-xs uppercase tracking-widest mb-3">
                Sacred Wisdom
              </div>
              <blockquote className="text-zinc-300 italic text-lg leading-relaxed">
                "The body is your temple. Keep it pure and clean for the soul to reside in."
              </blockquote>
              <div className="mt-3 text-zinc-500 text-sm">
                — Feed it with light, and it shall radiate with the energy of the universe
              </div>
            </motion.div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center"
            >
              <Button
                onClick={onClose}
                className="btn-gold px-8 py-3"
                data-testid="close-pyramid-btn"
              >
                Begin Your Eating Window
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { FoodPyramidModal };
