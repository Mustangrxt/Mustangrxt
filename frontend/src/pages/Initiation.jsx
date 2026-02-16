import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';

const Initiation = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0); // 0: dot, 1: expand, 2: content

  useEffect(() => {
    // Phase 1: Dot pulses for 1.5s then expands
    const timer1 = setTimeout(() => setPhase(1), 1500);
    // Phase 2: Show content after expansion
    const timer2 = setTimeout(() => setPhase(2), 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleBegin = () => {
    // Mark onboarding as complete
    localStorage.setItem('onboarding_complete', 'true');
    navigate('/dashboard');
  };

  // 12-point sacred geometry grid points
  const gridPoints = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const radius = 150;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      delay: i * 0.1
    };
  });

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      {/* Central Animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Pulsing Dot */}
        <AnimatePresence>
          {phase === 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: 1 
              }}
              exit={{ scale: 50, opacity: 0 }}
              transition={{ 
                scale: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 0.3 }
              }}
              className="w-4 h-4 rounded-full bg-cyan-400"
              style={{
                boxShadow: '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.5)'
              }}
            />
          )}
        </AnimatePresence>

        {/* Sacred Geometry Grid */}
        {phase >= 1 && (
          <motion.div 
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Central glow */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ duration: 1 }}
              className="absolute w-[400px] h-[400px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(0, 255, 255, 0.2) 0%, transparent 70%)',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />

            {/* 12 Points */}
            <svg width="400" height="400" viewBox="-200 -200 400 400" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {/* Connecting lines */}
              {gridPoints.map((point, i) => (
                <motion.line
                  key={`line-${i}`}
                  x1="0"
                  y1="0"
                  x2={point.x}
                  y2={point.y}
                  stroke="rgba(0, 255, 255, 0.3)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: point.delay }}
                />
              ))}
              
              {/* Outer circle connections */}
              {gridPoints.map((point, i) => {
                const nextPoint = gridPoints[(i + 1) % 12];
                return (
                  <motion.line
                    key={`outer-${i}`}
                    x1={point.x}
                    y1={point.y}
                    x2={nextPoint.x}
                    y2={nextPoint.y}
                    stroke="rgba(0, 255, 255, 0.2)"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 1 + point.delay }}
                  />
                );
              })}

              {/* Points */}
              {gridPoints.map((point, i) => (
                <motion.circle
                  key={`point-${i}`}
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="#00FFFF"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: point.delay }}
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.8))'
                  }}
                />
              ))}

              {/* Center point */}
              <motion.circle
                cx="0"
                cy="0"
                r="8"
                fill="#00FFFF"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ 
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{
                  filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 1))'
                }}
              />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Content */}
      <AnimatePresence>
        {phase === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-2xl mx-auto px-6 text-center"
          >
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold mb-8 leading-relaxed"
            >
              <span className="text-cyan-400">"Forge your physique through the 12 Laws:</span>
              <br />
              <span className="text-zinc-300">Transmute spiritual sovereignty into biological transformation."</span>
            </motion.h1>

            {/* Welcome Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-8 text-left space-y-6 mb-8"
            >
              <p className="text-cyan-400 text-lg">
                Welcome to the Vessel, <span className="font-bold">Pathfinder</span>.
              </p>

              <p className="text-zinc-400 leading-relaxed">
                Here, fasting is not a diet — it is a <span className="text-cyan-400">transmutation of the flesh</span>. You are about to align your physical body goals with the immutable Laws of the Universe.
              </p>

              <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-violet-400 font-bold text-lg mb-4">The Protocol:</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <span className="text-cyan-400 font-bold shrink-0">The Hero:</span>
                    <p className="text-zinc-400">Your central timer is your portal. It tracks your transition from <span className="text-cyan-400">Cyan (Initiate)</span> to <span className="text-violet-400">Violet (Purge)</span> to <span className="text-yellow-400">Solar Gold (Ascension)</span>.</p>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-violet-400 font-bold shrink-0">The Codex:</span>
                    <p className="text-zinc-400">On your left are the 12 Laws. As you fast, they ignite. Click them to see exactly how your biology is shifting to meet your spirit.</p>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-emerald-400 font-bold shrink-0">The Coach:</span>
                    <p className="text-zinc-400">The Granite Coach is your guide. It bridges the gap between cellular science and cosmic law. Ask him anything.</p>
                  </div>

                  <div className="flex gap-3">
                    <span className="text-yellow-400 font-bold shrink-0">The 100-Hour Threshold:</span>
                    <p className="text-zinc-400">Reach the 100-hour mark to permanently lock the <span className="text-yellow-400 font-bold">Golden Solar Flare</span> into your profile.</p>
                  </div>
                </div>
              </div>

              <p className="text-zinc-300 text-lg pt-4 text-center italic">
                Are you ready to begin your first transmutation?
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                onClick={handleBegin}
                className="btn-pathfinder px-12 py-6 text-lg tracking-wider group"
                data-testid="begin-transmutation-btn"
              >
                BEGIN THE PROTOCOL
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip button during animation */}
      {phase < 2 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => setPhase(2)}
          className="absolute bottom-8 right-8 text-zinc-600 hover:text-zinc-400 text-sm transition-colors"
        >
          Skip intro
        </motion.button>
      )}
    </div>
  );
};

export default Initiation;
