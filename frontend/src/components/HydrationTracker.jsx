import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Plus, Sparkles, Info, X } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HydrationTracker = ({ isTransmuting }) => {
  const [hydrationData, setHydrationData] = useState({
    total_ml: 0,
    goal_ml: 3000,
    percentage: 0,
    glasses: 0,
    electrolyte_glasses: 0
  });
  const [tip, setTip] = useState(null);
  const [showTip, setShowTip] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  useEffect(() => {
    fetchHydration();
    fetchTip();
    
    // Remind every hour during transmutation
    if (isTransmuting) {
      const interval = setInterval(() => {
        const lastLog = localStorage.getItem('last_hydration_reminder');
        const now = Date.now();
        if (!lastLog || now - parseInt(lastLog) > 3600000) { // 1 hour
          toast.info('💧 Time to hydrate! Add salt water with electrolytes.', {
            duration: 10000
          });
          localStorage.setItem('last_hydration_reminder', now.toString());
        }
      }, 300000); // Check every 5 minutes
      
      return () => clearInterval(interval);
    }
  }, [isTransmuting]);

  const fetchHydration = async () => {
    try {
      const response = await fetch(`${API}/hydration/today`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setHydrationData(data);
      }
    } catch (error) {
      console.error('Error fetching hydration:', error);
    }
  };

  const fetchTip = async () => {
    try {
      const response = await fetch(`${API}/hydration/tip`);
      if (response.ok) {
        const data = await response.json();
        setTip(data);
      }
    } catch (error) {
      console.error('Error fetching tip:', error);
    }
  };

  const logWater = async (withElectrolytes = false) => {
    setIsLogging(true);
    try {
      const response = await fetch(`${API}/hydration/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          amount_ml: 250,
          has_electrolytes: withElectrolytes
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setHydrationData(prev => ({
          ...prev,
          total_ml: data.total_today,
          percentage: Math.min(100, Math.round((data.total_today / 3000) * 100)),
          glasses: prev.glasses + 1,
          electrolyte_glasses: withElectrolytes ? prev.electrolyte_glasses + 1 : prev.electrolyte_glasses
        }));
        toast.success(withElectrolytes ? '💧⚡ Electrolyte water logged!' : '💧 Water logged!');
      }
    } catch (error) {
      toast.error('Failed to log hydration');
    }
    setIsLogging(false);
  };

  const waveProgress = hydrationData.percentage;

  return (
    <div className="glass-card rounded-xl p-4 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-cyan-400" />
          <h3 className="text-zinc-200 font-bold text-sm">Hydration</h3>
        </div>
        <button
          onClick={() => setShowTip(!showTip)}
          className="text-zinc-500 hover:text-cyan-400 transition-colors"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Water Level Visual */}
      <div className="relative h-24 bg-zinc-900/50 rounded-lg overflow-hidden mb-4 border border-zinc-800">
        {/* Wave animation */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500/40 to-cyan-400/20"
          initial={{ height: 0 }}
          animate={{ height: `${waveProgress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Wave effect */}
          <div className="absolute top-0 left-0 right-0 h-3 overflow-hidden">
            <motion.div
              className="absolute w-[200%] h-full"
              animate={{ x: [0, "-50%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{
                background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-31.8z' fill='rgba(34,211,238,0.3)'/%3E%3C/svg%3E")`,
                backgroundSize: '50% 100%'
              }}
            />
          </div>
        </motion.div>

        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-2xl font-bold text-cyan-400">{waveProgress}%</span>
            <p className="text-zinc-500 text-xs">{hydrationData.total_ml}ml / {hydrationData.goal_ml}ml</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between text-xs text-zinc-500 mb-4">
        <span>{hydrationData.glasses} glasses today</span>
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-yellow-400" />
          {hydrationData.electrolyte_glasses} with electrolytes
        </span>
      </div>

      {/* Log Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => logWater(false)}
          disabled={isLogging}
          variant="outline"
          className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-xs py-2"
          data-testid="log-water-btn"
        >
          <Plus className="w-3 h-3 mr-1" />
          Water
        </Button>
        <Button
          onClick={() => logWater(true)}
          disabled={isLogging}
          className="bg-gradient-to-r from-cyan-500/20 to-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:from-cyan-500/30 hover:to-yellow-500/30 text-xs py-2"
          data-testid="log-electrolyte-btn"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          + Salt/Electrolytes
        </Button>
      </div>

      {/* Tip Modal */}
      <AnimatePresence>
        {showTip && tip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-0 bg-black/95 rounded-xl p-4 flex flex-col"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-cyan-400 text-xs uppercase tracking-wider">Coach's Tip</span>
              <button onClick={() => setShowTip(false)} className="text-zinc-500 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed flex-1">{tip.tip}</p>
            <div className="mt-3 pt-3 border-t border-zinc-800">
              <span className="text-violet-400 text-xs">{tip.law}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { HydrationTracker };
