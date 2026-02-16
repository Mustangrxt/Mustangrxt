import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { FlowerOfLife } from '../components/FlowerOfLife';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const FoodPyramidPreview = () => {
  const navigate = useNavigate();
  
  const pyramidLevels = [
    {
      level: 1,
      name: "Divine Light",
      vibration: "Highest",
      foods: ["Fresh Juices", "Raw Fruits", "Sprouts", "Living Water"],
      textColor: "text-yellow-400",
      borderColor: "border-yellow-400/50",
      bgColor: "bg-yellow-400/10",
      width: "w-40"
    },
    {
      level: 2,
      name: "Solar Energy",
      vibration: "Very High",
      foods: ["Raw Vegetables", "Nuts", "Seeds", "Herbs"],
      textColor: "text-orange-400",
      borderColor: "border-orange-400/50",
      bgColor: "bg-orange-400/10",
      width: "w-56"
    },
    {
      level: 3,
      name: "Earth's Vitality",
      vibration: "High",
      foods: ["Grass-Fed Meat", "Wild Fish", "Pasture Eggs", "Bone Broth"],
      textColor: "text-cyan-400",
      borderColor: "border-cyan-400/50",
      bgColor: "bg-cyan-400/10",
      width: "w-72"
    },
    {
      level: 4,
      name: "Grounded Nourishment",
      vibration: "Moderate",
      foods: ["Cooked Vegetables", "Legumes", "Whole Grains", "Fermented Foods"],
      textColor: "text-violet-400",
      borderColor: "border-violet-400/50",
      bgColor: "bg-violet-400/10",
      width: "w-96"
    },
    {
      level: 5,
      name: "Dense Matter",
      vibration: "Low",
      foods: ["Processed Foods", "Refined Sugar", "Conventional Meat", "Artificial Additives"],
      textColor: "text-zinc-500",
      borderColor: "border-zinc-600/50",
      bgColor: "bg-zinc-600/10",
      width: "w-[28rem]"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative">
      <FlowerOfLife />
      <div className="noise-overlay" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">
              The Vibrational Food Pyramid
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-zinc-500 text-lg">
            Your Eating Window Guide • Nourish Your Temple
          </p>
        </motion.div>

        {/* Pyramid */}
        <div className="flex flex-col items-center gap-3 mb-12">
          {pyramidLevels.map((level, index) => (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, type: "spring" }}
              className={`${level.width} max-w-full ${level.bgColor} ${level.borderColor} border rounded-xl p-4 text-center backdrop-blur-sm`}
            >
              <div className={`text-sm font-bold ${level.textColor} uppercase tracking-wider mb-1`}>
                {level.name}
              </div>
              <div className="text-xs text-zinc-500 mb-3">
                {level.vibration} Vibration
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {level.foods.map((food) => (
                  <span 
                    key={food}
                    className={`text-xs px-3 py-1 rounded-full ${level.bgColor} ${level.textColor} border ${level.borderColor}`}
                  >
                    {food}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sacred Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl text-center p-8 glass-card rounded-2xl border border-yellow-400/20"
        >
          <div className="text-yellow-400/60 text-xs uppercase tracking-widest mb-4">
            Sacred Wisdom
          </div>
          <blockquote className="text-zinc-200 italic text-xl md:text-2xl leading-relaxed mb-4">
            "The body is your temple. Keep it pure and clean for the soul to reside in."
          </blockquote>
          <div className="text-zinc-500">
            — Feed it with light, and it shall radiate with the energy of the universe
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Button
            onClick={() => navigate('/')}
            className="btn-pathfinder px-8 py-3"
          >
            Back to Protocol
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default FoodPyramidPreview;
