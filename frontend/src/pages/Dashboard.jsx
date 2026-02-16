import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HeroRing } from '../components/HeroRing';
import { MilestoneIcons } from '../components/MilestoneIcons';
import { GoldenParticles } from '../components/GoldenParticles';
import { TimeTravelModal } from '../components/TimeTravelModal';
import { FlowerOfLife } from '../components/FlowerOfLife';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Play, 
  Square, 
  Clock, 
  MessageSquare, 
  User, 
  LogOut,
  History,
  TrendingUp,
  Award
} from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeTransmutation, setActiveTransmutation] = useState(null);
  const [currentHours, setCurrentHours] = useState(0);
  const [goalHours, setGoalHours] = useState(24);
  const [isTimeTravelOpen, setIsTimeTravelOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch active transmutation
  const fetchActiveTransmutation = useCallback(async () => {
    try {
      const response = await fetch(`${API}/transmutations/active`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setActiveTransmutation(data);
        if (data) {
          setCurrentHours(data.total_hours);
          setGoalHours(data.goal_hours);
        }
      }
    } catch (error) {
      console.error('Error fetching active transmutation:', error);
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`${API}/transmutations/stats`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchActiveTransmutation();
    fetchStats();
  }, [fetchActiveTransmutation, fetchStats]);

  // Real-time timer update
  useEffect(() => {
    if (!activeTransmutation) return;

    const interval = setInterval(() => {
      const startTime = new Date(activeTransmutation.start_time);
      const now = new Date();
      const hours = (now - startTime) / (1000 * 60 * 60);
      setCurrentHours(Math.max(0, hours));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTransmutation]);

  // Start transmutation
  const handleStart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/transmutations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ goal_hours: goalHours })
      });
      
      if (response.ok) {
        const data = await response.json();
        setActiveTransmutation(data);
        setCurrentHours(data.total_hours);
        toast.success('Transmutation begun. Your journey starts now.');
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Failed to start transmutation');
      }
    } catch (error) {
      toast.error('Failed to start transmutation');
    }
    setIsLoading(false);
  };

  // End transmutation
  const handleEnd = async () => {
    if (!activeTransmutation) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/transmutations/${activeTransmutation.transmutation_id}/end`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success(`Transmutation complete. ${data.total_hours.toFixed(2)} hours achieved.`);
        setActiveTransmutation(null);
        setCurrentHours(0);
        fetchStats();
      }
    } catch (error) {
      toast.error('Failed to end transmutation');
    }
    setIsLoading(false);
  };

  // Time travel - update start time
  const handleTimeTravel = async (newStartTime) => {
    if (!activeTransmutation) return;
    
    try {
      const response = await fetch(`${API}/transmutations/${activeTransmutation.transmutation_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ start_time: newStartTime })
      });
      
      if (response.ok) {
        const data = await response.json();
        setActiveTransmutation(data);
        setCurrentHours(data.total_hours);
        toast.success('Time travel successful. Start time updated.');
      }
    } catch (error) {
      toast.error('Time travel failed');
    }
  };

  const isGolden = currentHours >= 100 || user?.golden_badge;

  return (
    <div className="min-h-screen bg-black text-white relative">
      <FlowerOfLife />
      <GoldenParticles enabled={isGolden} />
      <div className="noise-overlay" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 border-b border-zinc-900">
        <div className="font-orbitron text-xl tracking-wider">
          <span className="text-cyan-400">PATHFINDER</span>
          <span className="text-zinc-600 ml-2">DSM</span>
        </div>
        
        <nav className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/coach')}
            className="text-zinc-400 hover:text-cyan-400"
            data-testid="nav-coach"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Coach
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="text-zinc-400 hover:text-cyan-400"
            data-testid="nav-profile"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-zinc-500 hover:text-red-400"
            data-testid="nav-logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Milestones - Left Side */}
            <div className="hidden lg:block lg:col-span-2">
              <div className="sticky top-24">
                <h3 className="font-orbitron text-xs text-zinc-600 tracking-widest mb-6">
                  12 LAWS
                </h3>
                <MilestoneIcons currentHours={currentHours} />
              </div>
            </div>

            {/* Hero Ring - Center */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center min-h-[60vh]">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <HeroRing 
                  hours={currentHours}
                  goalHours={goalHours}
                  size={Math.min(400, window.innerWidth - 100)}
                  onCenterClick={() => activeTransmutation && setIsTimeTravelOpen(true)}
                />
              </motion.div>

              {/* Controls */}
              <div className="mt-12 flex flex-col items-center gap-6">
                {!activeTransmutation ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3">
                      <label className="text-zinc-500 text-sm">Goal:</label>
                      <Input
                        type="number"
                        value={goalHours}
                        onChange={(e) => setGoalHours(Number(e.target.value))}
                        className="w-24 bg-zinc-900/50 border-zinc-800 text-center font-mono"
                        min={1}
                        max={168}
                        data-testid="goal-hours-input"
                      />
                      <span className="text-zinc-500 text-sm">hours</span>
                    </div>
                    <Button
                      onClick={handleStart}
                      disabled={isLoading}
                      className="btn-pathfinder px-12 py-6 text-lg font-orbitron tracking-wider"
                      data-testid="start-transmutation-btn"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Begin Transmutation
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsTimeTravelOpen(true)}
                        className="border-zinc-700 text-zinc-300 hover:border-cyan-400"
                        data-testid="time-travel-btn"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Time Travel
                      </Button>
                      <Button
                        onClick={handleEnd}
                        disabled={isLoading}
                        className="bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30"
                        data-testid="end-transmutation-btn"
                      >
                        <Square className="w-4 h-4 mr-2" />
                        End Transmutation
                      </Button>
                    </div>
                    <p className="text-zinc-600 text-xs">
                      Click the ring center or Time Travel button to adjust start time
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Stats - Right Side */}
            <div className="lg:col-span-4 space-y-6">
              {/* User Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-6 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  {user?.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name}
                      className="w-12 h-12 rounded-full border-2 border-zinc-800"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                      <User className="w-6 h-6 text-zinc-500" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-zinc-100">{user?.name}</div>
                    <div className="text-zinc-500 text-sm">{user?.email}</div>
                  </div>
                  {(user?.golden_badge || isGolden) && (
                    <div className="ml-auto">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center glow-gold">
                        <Award className="w-5 h-5 text-black" />
                      </div>
                    </div>
                  )}
                </div>
                {user?.is_pro && (
                  <div className="mt-4 px-3 py-1.5 bg-violet-500/20 text-violet-400 text-xs font-medium rounded-full border border-violet-500/30 inline-block">
                    PATHFINDER PRO
                  </div>
                )}
              </motion.div>

              {/* Stats Cards */}
              {stats && (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 rounded-xl"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                      <h3 className="font-orbitron text-sm text-zinc-400">Total Stats</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-3xl font-bold text-cyan-400 font-mono">
                          {stats.total_hours.toFixed(1)}
                        </div>
                        <div className="text-xs text-zinc-500">Total Hours</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-violet-400 font-mono">
                          {stats.total_transmutations}
                        </div>
                        <div className="text-xs text-zinc-500">Sessions</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-xl"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <History className="w-5 h-5 text-violet-400" />
                      <h3 className="font-orbitron text-sm text-zinc-400">Records</h3>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-yellow-400 font-mono">
                        {stats.longest_session_hours.toFixed(1)}
                      </div>
                      <div className="text-xs text-zinc-500">Longest Session (hours)</div>
                    </div>
                  </motion.div>
                </>
              )}

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6 rounded-xl"
              >
                <h3 className="font-orbitron text-sm text-zinc-400 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-zinc-800 text-zinc-300 justify-start hover:border-cyan-400"
                    onClick={() => navigate('/coach')}
                    data-testid="quick-action-coach"
                  >
                    <MessageSquare className="w-4 h-4 mr-3 text-cyan-400" />
                    Ask the Granite Coach
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-zinc-800 text-zinc-300 justify-start hover:border-violet-400"
                    onClick={() => navigate('/profile')}
                    data-testid="quick-action-history"
                  >
                    <History className="w-4 h-4 mr-3 text-violet-400" />
                    View History
                  </Button>
                </div>
              </motion.div>

              {/* Mobile Milestones */}
              <div className="lg:hidden glass-card p-6 rounded-xl">
                <h3 className="font-orbitron text-sm text-zinc-400 mb-4">12 LAWS PROGRESS</h3>
                <div className="flex flex-wrap gap-2">
                  <MilestoneIcons currentHours={currentHours} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Time Travel Modal */}
      <TimeTravelModal
        isOpen={isTimeTravelOpen}
        onClose={() => setIsTimeTravelOpen(false)}
        currentStartTime={activeTransmutation?.start_time}
        onSave={handleTimeTravel}
      />
    </div>
  );
};

export default Dashboard;
