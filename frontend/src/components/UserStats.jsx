import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Target, Zap, Trophy, TrendingUp } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const intentInfo = {
  shred: { label: 'SHRED', color: 'text-orange-400', icon: Flame, description: 'Fat Loss & Cause & Effect' },
  clarity: { label: 'CLARITY', color: 'text-cyan-400', icon: Zap, description: 'Brain Optimization' },
  heal: { label: 'HEAL', color: 'text-emerald-400', icon: Target, description: 'Peak Autophagy' },
  rebirth: { label: 'REBIRTH', color: 'text-yellow-400', icon: Trophy, description: '100-Hour Ascension' }
};

const UserStats = () => {
  const [stats, setStats] = useState({
    total_transmutations: 0,
    total_hours: 0,
    current_streak: 0,
    longest_streak: 0,
    intent: null,
    golden_badge: false
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API}/user/stats`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const intent = stats.intent ? intentInfo[stats.intent] : null;
  const IntentIcon = intent?.icon || Target;

  return (
    <div className="glass-card rounded-xl p-4">
      {/* Intent/Goal */}
      {intent && (
        <div className="mb-4 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center`}>
              <IntentIcon className={`w-5 h-5 ${intent.color}`} />
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Current Intent</p>
              <p className={`font-bold ${intent.color}`}>{intent.label}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Current Streak */}
        <motion.div 
          className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-zinc-500 text-xs">Streak</span>
          </div>
          <p className="text-2xl font-bold text-orange-400">{stats.current_streak}</p>
          <p className="text-zinc-600 text-xs">days</p>
        </motion.div>

        {/* Longest Streak */}
        <motion.div 
          className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-zinc-500 text-xs">Best</span>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{stats.longest_streak}</p>
          <p className="text-zinc-600 text-xs">days</p>
        </motion.div>

        {/* Total Transmutations */}
        <motion.div 
          className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-zinc-500 text-xs">Sessions</span>
          </div>
          <p className="text-2xl font-bold text-cyan-400">{stats.total_transmutations}</p>
          <p className="text-zinc-600 text-xs">total</p>
        </motion.div>

        {/* Total Hours */}
        <motion.div 
          className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-violet-400" />
            <span className="text-zinc-500 text-xs">Hours</span>
          </div>
          <p className="text-2xl font-bold text-violet-400">{stats.total_hours.toFixed(0)}</p>
          <p className="text-zinc-600 text-xs">transmuted</p>
        </motion.div>
      </div>

      {/* Golden Badge */}
      {stats.golden_badge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-black" />
          </div>
          <div>
            <p className="text-yellow-400 font-bold text-sm">Golden Solar Flare</p>
            <p className="text-zinc-500 text-xs">100+ Hour Achievement Unlocked</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export { UserStats };
