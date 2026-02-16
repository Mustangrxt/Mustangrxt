import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Info, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Navigation keywords and their routes
const navigationMap = {
  'welcome': '/initiation-preview',
  'onboarding': '/initiation-preview',
  'initiation': '/initiation-preview',
  'start': '/initiation-preview',
  'begin': '/initiation-preview',
  'dashboard': '/dashboard',
  'home': '/dashboard',
  'main': '/dashboard',
  'timer': '/dashboard',
  'coach': '/coach',
  'chat': '/coach',
  'ask': '/coach',
  'profile': '/profile',
  'account': '/profile',
  'settings': '/profile',
  'subscription': '/profile',
  'history': '/profile',
  'food': '/food-pyramid',
  'pyramid': '/food-pyramid',
  'eating': '/food-pyramid',
  'hydration': '/dashboard',
  'water': '/dashboard',
  'landing': '/',
  'logout': '/'
};

const FloatingCoach = ({ user }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [promptsRemaining, setPromptsRemaining] = useState(5);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && user) {
      fetchPromptsRemaining();
    }
  }, [isOpen, user]);

  const fetchPromptsRemaining = async () => {
    try {
      const response = await fetch(`${API}/coach/prompts-remaining`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setPromptsRemaining(data.prompts_remaining);
      }
    } catch (error) {
      console.error('Error fetching prompts:', error);
    }
  };

  // Check for navigation intent
  const checkNavigation = (message) => {
    const lowerMsg = message.toLowerCase();
    const navKeywords = ['where', 'take me', 'go to', 'navigate', 'show me', 'open', 'find'];
    const hasNavIntent = navKeywords.some(kw => lowerMsg.includes(kw));
    
    if (hasNavIntent) {
      for (const [keyword, route] of Object.entries(navigationMap)) {
        if (lowerMsg.includes(keyword)) {
          return { route, keyword };
        }
      }
    }
    return null;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !user) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Check for navigation intent first
    const navIntent = checkNavigation(userMessage);
    if (navIntent) {
      setMessages(prev => [...prev, {
        role: 'navigation',
        content: `Taking you to the ${navIntent.keyword} page...`,
        route: navIntent.route
      }]);
      setTimeout(() => {
        navigate(navIntent.route);
        setIsOpen(false);
      }, 1000);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API}/coach/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: userMessage })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response || data.flesh,
          flesh: data.flesh,
          spirit: data.spirit
        }]);
        setPromptsRemaining(data.prompts_remaining);
      } else {
        const error = await response.json();
        setMessages(prev => [...prev, {
          role: 'error',
          content: error.detail || 'Failed to get response'
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'error',
        content: 'Connection error. Please try again.'
      }]);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg ${isOpen ? 'hidden' : ''}`}
        style={{
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.4), 0 4px 15px rgba(0, 0, 0, 0.3)'
        }}
        data-testid="floating-coach-btn"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[500px] glass rounded-2xl border border-zinc-800 flex flex-col overflow-hidden"
            style={{
              boxShadow: '0 0 30px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 255, 255, 0.1)'
            }}
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-zinc-100 font-bold text-sm">The Granite Coach</h3>
                  <p className="text-zinc-500 text-xs">{promptsRemaining} prompts remaining</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
                data-testid="close-coach-panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-cyan-400/10 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-cyan-400" />
                  </div>
                  <p className="text-zinc-400 text-sm">Ask the Granite Coach anything.</p>
                  <p className="text-zinc-600 text-xs mt-2">Fasting, navigation, or any question.</p>
                  <div className="mt-4 text-left space-y-1">
                    <p className="text-zinc-600 text-xs">Try: "Take me to the welcome page"</p>
                    <p className="text-zinc-600 text-xs">Try: "What happens at hour 16?"</p>
                    <p className="text-zinc-600 text-xs">Try: "How do I stay hydrated?"</p>
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx}>
                  {msg.role === 'user' && (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] p-3 rounded-xl bg-zinc-800 text-zinc-200 text-sm">
                        {msg.content}
                      </div>
                    </div>
                  )}

                  {msg.role === 'navigation' && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-emerald-400" />
                      <p className="text-emerald-400 text-sm">{msg.content}</p>
                    </div>
                  )}

                  {msg.role === 'assistant' && (
                    <div className="space-y-2">
                      {/* Check if it's a dual response or single */}
                      {msg.flesh && msg.spirit ? (
                        <>
                          {/* The Flesh */}
                          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                            <div className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">The Flesh</div>
                            <p className="text-zinc-300 text-sm">{msg.flesh}</p>
                          </div>
                          {/* The Spirit */}
                          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30">
                            <div className="text-violet-400 text-xs font-bold uppercase tracking-wider mb-1">The Spirit</div>
                            <p className="text-zinc-300 text-sm">{msg.spirit}</p>
                          </div>
                        </>
                      ) : (
                        <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700">
                          <p className="text-zinc-300 text-sm">{msg.content || msg.flesh}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {msg.role === 'error' && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                      {msg.content}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-zinc-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">The Coach is contemplating...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Info Bar */}
            <div className="px-4 py-2 bg-zinc-900/50 border-t border-zinc-800 flex items-center gap-2">
              <Info className="w-3 h-3 text-zinc-600" />
              <span className="text-zinc-600 text-[10px]">Prompts reset on a rolling 24-hour cycle</span>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-zinc-800 bg-zinc-900/80">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask the Coach..."
                  disabled={isLoading || promptsRemaining <= 0}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                  data-testid="coach-input"
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim() || promptsRemaining <= 0}
                  className="btn-pathfinder px-3"
                  data-testid="coach-send-btn"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {promptsRemaining <= 0 && (
                <p className="text-red-400 text-xs mt-2">No prompts remaining. Resets in 24 hours.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export { FloatingCoach };
