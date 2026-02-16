import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Clock } from 'lucide-react';
import { FlowerOfLife } from '../components/FlowerOfLife';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const FoodPyramidPreview = () => {
  const navigate = useNavigate();
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Simulate eating window timer (starts from page load for preview)
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
      foods: ["Cooked Vegetables", "Legumes", "Whole Grains", "Fermented Foods"],
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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <FlowerOfLife />
      <div className="noise-overlay" />

      <div className="relative z-10 flex flex-col items-center justify-center h-screen p-4">
        {/* Header with Timer */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h1 className="text-xl md:text-2xl font-bold text-zinc-100">
              The Vibrational Food Pyramid
            </h1>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>
          
          {/* Eating Window Timer */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-zinc-500 text-sm">Eating Window:</span>
            <span className="font-mono text-cyan-400 text-lg">{formatTime(elapsedTime)}</span>
          </div>
        </motion.div>

        {/* Compact Pyramid */}
        <div className="flex flex-col items-center gap-1.5 mb-4">
          {pyramidLevels.map((level, index) => {
            const widths = ['w-36', 'w-48', 'w-60', 'w-72', 'w-80'];
            return (
              <motion.div
                key={level.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index }}
                className={`${widths[index]} ${level.bgColor} ${level.borderColor} border rounded-lg py-2 px-3 text-center`}
              >
                <div className={`text-[10px] font-bold ${level.textColor} uppercase tracking-wider`}>
                  {level.name}
                </div>
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  {level.foods.map((food) => (
                    <span 
                      key={food}
                      className={`text-[9px] px-2 py-0.5 rounded-full ${level.bgColor} ${level.textColor} border ${level.borderColor}`}
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
          transition={{ delay: 0.4 }}
          className="max-w-lg text-center p-4 glass-card rounded-xl border border-yellow-400/20"
        >
          <div className="text-yellow-400/60 text-[10px] uppercase tracking-widest mb-2">
            Sacred Wisdom
          </div>
          <blockquote className="text-zinc-200 italic text-sm leading-relaxed">
            "The body is your temple. Keep it pure and clean for the soul to reside in."
          </blockquote>
          <div className="text-zinc-500 text-xs mt-2">
            — Feed it with light, and it shall radiate with the energy of the universe
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4"
        >
          <Button
            onClick={() => navigate('/')}
            className="btn-pathfinder px-6 py-2 text-sm"
          >
            Back to Protocol
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default FoodPyramidPreview;
