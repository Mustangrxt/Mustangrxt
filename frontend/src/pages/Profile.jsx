import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FlowerOfLife } from '../components/FlowerOfLife';
import { Button } from '../components/ui/button';
import { 
  ArrowLeft, 
  Crown, 
  User, 
  History, 
  Award,
  Check,
  Loader2,
  Calendar
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Profile = ({ user, onRefreshUser }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Fetch history
  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(`${API}/transmutations/history`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
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

  // Check payment status
  const checkPaymentStatus = useCallback(async (sessionId, attempts = 0) => {
    const maxAttempts = 5;
    const pollInterval = 2000;

    if (attempts >= maxAttempts) {
      toast.error('Payment verification timed out. Please check your email for confirmation.');
      setIsCheckingPayment(false);
      return;
    }

    try {
      const response = await fetch(`${API}/subscription/status/${sessionId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.payment_status === 'paid') {
          toast.success('Welcome to Pathfinder Pro! Your journey is now unlimited.');
          onRefreshUser();
          setIsCheckingPayment(false);
          // Clear the session_id from URL
          window.history.replaceState({}, '', '/profile');
          return;
        } else if (data.status === 'expired') {
          toast.error('Payment session expired. Please try again.');
          setIsCheckingPayment(false);
          return;
        }
      }

      // Continue polling
      setTimeout(() => checkPaymentStatus(sessionId, attempts + 1), pollInterval);
    } catch (error) {
      console.error('Error checking payment status:', error);
      setTimeout(() => checkPaymentStatus(sessionId, attempts + 1), pollInterval);
    }
  }, [onRefreshUser]);

  useEffect(() => {
    fetchHistory();
    fetchStats();

    // Check for payment return
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      setIsCheckingPayment(true);
      checkPaymentStatus(sessionId);
    }
  }, [fetchHistory, fetchStats, searchParams, checkPaymentStatus]);

  // Handle subscription purchase
  const handleSubscribe = async (plan) => {
    setIsProcessingPayment(true);
    try {
      const response = await fetch(`${API}/subscription/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          plan,
          origin_url: window.location.origin
        })
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Failed to create checkout session');
      }
    } catch (error) {
      toast.error('Failed to process subscription');
    }
    setIsProcessingPayment(false);
  };

  const getStageColor = (hours) => {
    if (hours >= 72) return 'text-yellow-400';
    if (hours >= 24) return 'text-violet-400';
    return 'text-cyan-400';
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <FlowerOfLife />
      <div className="noise-overlay" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 border-b border-zinc-900">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="text-zinc-400 hover:text-cyan-400"
          data-testid="back-to-dashboard"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
      </header>

      {/* Payment checking overlay */}
      {isCheckingPayment && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="glass p-8 rounded-xl text-center">
            <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto mb-4" />
            <h3 className="font-orbitron text-lg text-cyan-400">Verifying Payment</h3>
            <p className="text-zinc-500 text-sm mt-2">Please wait while we confirm your subscription...</p>
          </div>
        </div>
      )}

      <main className="relative z-10 p-6 md:p-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Section */}
          <div className="space-y-6">
            {/* User Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-xl"
            >
              <div className="flex items-center gap-4 mb-6">
                {user?.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name}
                    className="w-16 h-16 rounded-full border-2 border-zinc-800"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
                    <User className="w-8 h-8 text-zinc-500" />
                  </div>
                )}
                <div>
                  <div className="font-orbitron font-bold text-zinc-100">{user?.name}</div>
                  <div className="text-zinc-500 text-sm">{user?.email}</div>
                </div>
              </div>

              {user?.golden_badge && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 mb-4">
                  <Award className="w-8 h-8 text-yellow-400" />
                  <div>
                    <div className="text-yellow-400 font-orbitron text-sm">Golden Solar Flare</div>
                    <div className="text-zinc-500 text-xs">100+ Hours Achieved</div>
                  </div>
                </div>
              )}

              {user?.is_pro ? (
                <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-5 h-5 text-violet-400" />
                    <span className="text-violet-400 font-orbitron text-sm">GRANITE PROTOCOL PRO</span>
                  </div>
                  <div className="text-zinc-500 text-xs">
                    {user.pro_plan === 'yearly' ? 'Annual' : 'Monthly'} Plan
                  </div>
                </div>
              ) : (
                <div className="text-zinc-500 text-sm">Free Plan</div>
              )}
            </motion.div>

            {/* Stats Card */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6 rounded-xl"
              >
                <h3 className="font-orbitron text-sm text-zinc-400 mb-4">Lifetime Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Total Hours</span>
                    <span className="font-mono text-cyan-400">{stats.total_hours.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Sessions</span>
                    <span className="font-mono text-violet-400">{stats.total_transmutations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Completed</span>
                    <span className="font-mono text-green-400">{stats.completed_transmutations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Longest Session</span>
                    <span className="font-mono text-yellow-400">{stats.longest_session_hours.toFixed(1)}h</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Subscription Section */}
          {!user?.is_pro && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-8 rounded-xl border-violet-500/50 glow-violet"
            >
              <div className="text-center mb-6">
                <Crown className="w-12 h-12 text-violet-400 mx-auto mb-4" />
                <h2 className="font-orbitron text-2xl text-violet-400 mb-2">Granite Protocol Pro</h2>
                <p className="text-zinc-500">Unlock your full potential</p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited AI Coach Prompts',
                  'Advanced Analytics',
                  'Priority Support',
                  'Early Access Features',
                  'Exclusive Content'
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-zinc-300">
                    <Check className="w-4 h-4 text-violet-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="space-y-4">
                <Button
                  onClick={() => handleSubscribe('monthly')}
                  disabled={isProcessingPayment}
                  className="w-full btn-pathfinder py-6"
                  data-testid="subscribe-monthly-btn"
                >
                  {isProcessingPayment ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>$9.99 / month</>
                  )}
                </Button>
                <Button
                  onClick={() => handleSubscribe('yearly')}
                  disabled={isProcessingPayment}
                  className="w-full btn-gold py-6"
                  data-testid="subscribe-yearly-btn"
                >
                  {isProcessingPayment ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>$69.99 / year <span className="text-xs ml-2 opacity-70">(Save 40%)</span></>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* History Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: user?.is_pro ? 0.2 : 0.3 }}
            className={`glass-card p-6 rounded-xl ${user?.is_pro ? 'lg:col-span-2' : ''}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <History className="w-5 h-5 text-cyan-400" />
              <h3 className="font-orbitron text-lg text-zinc-100">Transmutation History</h3>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No completed transmutations yet</p>
                <p className="text-sm mt-2">Your journey awaits</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {history.map((item, index) => (
                  <motion.div
                    key={item.transmutation_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className={`font-mono text-2xl font-bold ${getStageColor(item.total_hours)}`}>
                          {item.total_hours.toFixed(1)}h
                        </div>
                        <div className="text-zinc-500 text-xs">
                          Goal: {item.goal_hours}h
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-zinc-400 text-sm">
                          {format(parseISO(item.start_time), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-zinc-600 text-xs">
                          {format(parseISO(item.start_time), 'HH:mm')} - {item.end_time ? format(parseISO(item.end_time), 'HH:mm') : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.laws_unlocked.slice(0, 6).map((law) => (
                        <span 
                          key={law}
                          className="px-2 py-0.5 text-[10px] rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20"
                        >
                          {law}
                        </span>
                      ))}
                      {item.laws_unlocked.length > 6 && (
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-zinc-800 text-zinc-500">
                          +{item.laws_unlocked.length - 6} more
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
