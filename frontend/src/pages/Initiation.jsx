import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, Flame, Brain, Heart, Sparkles } from 'lucide-react';

const Initiation = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0); // 0: dot, 1: expand, 2: content, 3: intent, 4: first-word
  const [selectedIntent, setSelectedIntent] = useState(null);

  const intents = [
    {
      id: 'shred',
      name: 'SHRED',
      icon: Flame,
      focus: 'Focus on Fat Loss & The Law of Cause & Effect',
      color: 'orange'
    },
    {
      id: 'clarity',
      name: 'CLARITY',
      icon: Brain,
      focus: 'Focus on Brain Optimization & The Law of Compensation',
      color: 'cyan'
    },
    {
      id: 'heal',
      name: 'HEAL',
      icon: Heart,
      focus: 'Focus on Peak Autophagy & The Law of Attraction',
      color: 'emerald'
    },
    {
      id: 'rebirth',
      name: 'REBIRTH',
      icon: Sparkles,
      focus: 'The 100-Hour Path to the Law of Gender',
      color: 'yellow'
    }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(1), 1500);
    const timer2 = setTimeout(() => setPhase(2), 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleIntentSelect = (intent) => {
    setSelectedIntent(intent);
    localStorage.setItem('transmutation_intent', intent.id);
    setPhase(4);
  };

  const handleBeginProtocol = () => {
    localStorage.setItem('onboarding_complete', 'true');
    localStorage.setItem('show_first_transmutation', 'true');
    navigate('/dashboard');
  };

  const gridPoints = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const radius = 150;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      delay: i * 0.1
    };
  });

  const colorClasses = {
    orange: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400', hover: 'hover:bg-orange-500/30 hover:border-orange-400' },
    cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/50', text: 'text-cyan-400', hover: 'hover:bg-cyan-500/30 hover:border-cyan-400' },
    emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400', hover: 'hover:bg-emerald-500/30 hover:border-emerald-400' },
    yellow: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400', hover: 'hover:bg-yellow-500/30 hover:border-yellow-400' }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      {/* Central Animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence>
          {phase === 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.3, 1], opacity: 1 }}
              exit={{ scale: 50, opacity: 0 }}
              transition={{ 
                scale: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 0.3 }
              }}
              className="w-4 h-4 rounded-full bg-cyan-400"
              style={{ boxShadow: '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.5)' }}
            />
          )}
        </AnimatePresence>

        {phase >= 1 && phase < 4 && (
          <motion.div className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ duration: 1 }}
              className="absolute w-[400px] h-[400px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(0, 255, 255, 0.2) 0%, transparent 70%)', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
            />
            <svg width="400" height="400" viewBox="-200 -200 400 400" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {gridPoints.map((point, i) => (
                <motion.line key={`line-${i}`} x1="0" y1="0" x2={point.x} y2={point.y} stroke="rgba(0, 255, 255, 0.3)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: point.delay }} />
              ))}
              {gridPoints.map((point, i) => {
                const nextPoint = gridPoints[(i + 1) % 12];
                return <motion.line key={`outer-${i}`} x1={point.x} y1={point.y} x2={nextPoint.x} y2={nextPoint.y} stroke="rgba(0, 255, 255, 0.2)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 1 + point.delay }} />;
              })}
              {gridPoints.map((point, i) => (
                <motion.circle key={`point-${i}`} cx={point.x} cy={point.y} r="6" fill="#00FFFF" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, delay: point.delay }} style={{ filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.8))' }} />
              ))}
              <motion.circle cx="0" cy="0" r="8" fill="#00FFFF" initial={{ scale: 0 }} animate={{ scale: [1, 1.2, 1] }} transition={{ scale: { duration: 2, repeat: Infinity, ease: "easeInOut" } }} style={{ filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 1))' }} />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Phase 2: Welcome Content */}
      <AnimatePresence>
        {phase === 2 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.8 }} className="relative z-10 max-w-2xl mx-auto px-6 text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl md:text-3xl font-bold mb-8 leading-relaxed">
              <span className="text-cyan-400">"Forge your physique through the 12 Laws:</span><br />
              <span className="text-zinc-300">Transmute spiritual sovereignty into biological transformation."</span>
            </motion.h1>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-8 text-left space-y-6 mb-8">
              <p className="text-cyan-400 text-lg">Welcome to the Vessel, <span className="font-bold">Pathfinder</span>.</p>
              <p className="text-zinc-400 leading-relaxed">Here, fasting is not a diet — it is a <span className="text-cyan-400">transmutation of the flesh</span>. You are about to align your physical body goals with the immutable Laws of the Universe.</p>
              <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-violet-400 font-bold text-lg mb-4">The Protocol:</h3>
                <div className="space-y-4">
                  <div className="flex gap-3"><span className="text-cyan-400 font-bold shrink-0">The Hero:</span><p className="text-zinc-400">Your central timer is your portal. It tracks your transition from <span className="text-cyan-400">Cyan (Initiate)</span> to <span className="text-violet-400">Violet (Purge)</span> to <span className="text-yellow-400">Solar Gold (Ascension)</span>.</p></div>
                  <div className="flex gap-3"><span className="text-violet-400 font-bold shrink-0">The Codex:</span><p className="text-zinc-400">On your left are the 12 Laws. As you fast, they ignite. Click them to see exactly how your biology is shifting to meet your spirit.</p></div>
                  <div className="flex gap-3"><span className="text-emerald-400 font-bold shrink-0">The Coach:</span><p className="text-zinc-400">The Granite Coach is your guide. It bridges the gap between cellular science and cosmic law. Ask him anything.</p></div>
                  <div className="flex gap-3"><span className="text-yellow-400 font-bold shrink-0">The 100-Hour Threshold:</span><p className="text-zinc-400">Reach the 100-hour mark to permanently lock the <span className="text-yellow-400 font-bold">Golden Solar Flare</span> into your profile.</p></div>
                </div>
              </div>
              <p className="text-zinc-300 text-lg pt-4 text-center italic">Are you ready to begin your first transmutation?</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Button onClick={() => setPhase(3)} className="btn-pathfinder px-12 py-6 text-lg tracking-wider group" data-testid="continue-btn">
                CONTINUE <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 3: Intent Selection */}
      <AnimatePresence>
        {phase === 3 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.8 }} className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h2 className="text-cyan-400 text-sm uppercase tracking-widest mb-2">The First Action</h2>
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">SET YOUR INTENT</h1>
              <p className="text-zinc-400 text-lg">What is your primary transmutation goal?</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {intents.map((intent, index) => {
                const colors = colorClasses[intent.color];
                return (
                  <motion.button
                    key={intent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => handleIntentSelect(intent)}
                    className={`p-6 rounded-xl ${colors.bg} border ${colors.border} ${colors.hover} transition-all text-left group`}
                    data-testid={`intent-${intent.id}`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center`}>
                        <intent.icon className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <h3 className={`text-2xl font-bold ${colors.text}`}>{intent.name}</h3>
                    </div>
                    <p className="text-zinc-400 text-sm">{intent.focus}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 4: The First Word */}
      <AnimatePresence>
        {phase === 4 && selectedIntent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="relative z-10 max-w-2xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8 border border-cyan-400/30">
              {/* Header */}
              <div className="text-center mb-6 pb-6 border-b border-zinc-800">
                <h2 className="text-cyan-400 text-xs uppercase tracking-widest mb-2">The Granite Coach Initiation</h2>
                <div className="flex justify-center gap-6 text-sm">
                  <div><span className="text-zinc-500">Status:</span> <span className="text-emerald-400">Transmutation Initiated</span></div>
                  <div><span className="text-zinc-500">Current Law:</span> <span className="text-cyan-400">The Law of Divine Oneness (Hour 0)</span></div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-4 text-zinc-300 leading-relaxed">
                <p><span className="text-cyan-400 font-bold">"Transmuter,</span> your intent has been recorded in the Codex.</p>
                
                <p>You are currently at <span className="text-cyan-400 font-bold">Hour 0</span>. In the world of the flesh, your insulin is beginning to drop, clearing the path for your body to access its stored energy. In the world of the spirit, you are under <span className="text-violet-400">the Law of Divine Oneness</span>.</p>
                
                <p><span className="text-yellow-400">Realize this:</span> Your body, your goal, and the atoms of the stars are not separate. This fast is the thread that weaves them back together. Every hour you spend in this state of 'Empty' brings you closer to being 'Full' of your own sovereign power.</p>
                
                <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 my-6">
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Your Daily Stoic Reminder</p>
                  <p className="text-zinc-200 italic">"No man is free who is not master of himself."</p>
                  <p className="text-zinc-500 text-sm mt-1">— Epictetus</p>
                </div>

                <p>I am standing by. You have <span className="text-cyan-400 font-bold">5 prompts remaining</span> for this 24-hour cycle. How shall we begin the transformation?"</p>
              </div>

              {/* Info notes */}
              <div className="mt-6 pt-6 border-t border-zinc-800 space-y-2">
                <p className="text-zinc-600 text-xs flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">i</span>
                  Prompts reset on a rolling 24-hour cycle from your first message.
                </p>
                <p className="text-zinc-600 text-xs flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">!</span>
                  Forgot to start? Tap the timer to shift your timeline.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8 text-center">
              <Button onClick={handleBeginProtocol} className="btn-gold px-12 py-6 text-lg tracking-wider group" data-testid="begin-protocol-btn">
                ENTER THE PROTOCOL <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase < 2 && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} onClick={() => setPhase(2)} className="absolute bottom-8 right-8 text-zinc-600 hover:text-zinc-400 text-sm transition-colors">
          Skip intro
        </motion.button>
      )}
    </div>
  );
};

export default Initiation;
