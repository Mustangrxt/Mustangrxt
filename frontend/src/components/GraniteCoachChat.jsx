import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { ScrollArea } from '../components/ui/scroll-area';

const GRANITE_AVATAR = "https://images.unsplash.com/photo-1726486190898-b5f7ea74891d?w=100&h=100&fit=crop";

export const GraniteCoachChat = ({ 
  messages = [], 
  onSendMessage, 
  isLoading = false,
  promptsRemaining = 5,
  isPro = false 
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading && (isPro || promptsRemaining > 0)) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full" data-testid="granite-coach-chat">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b border-zinc-800">
        <div 
          className="w-14 h-14 rounded-lg overflow-hidden"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
          }}
        >
          <img 
            src={GRANITE_AVATAR} 
            alt="Granite Coach" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="font-orbitron text-lg text-cyan-400">The Granite Coach</h2>
          <p className="text-zinc-500 text-sm">Wisdom of Flesh and Spirit</p>
        </div>
        <div className="ml-auto">
          {!isPro && (
            <div className="text-right">
              <div className="text-xs text-zinc-500">Prompts remaining</div>
              <div className={`font-mono font-bold ${promptsRemaining <= 1 ? 'text-red-400' : 'text-cyan-400'}`}>
                {promptsRemaining} / 5
              </div>
            </div>
          )}
          {isPro && (
            <div className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/30">
              PRO - Unlimited
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="space-y-6">
          {/* Welcome message */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-lg overflow-hidden glow-cyan"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                }}
              >
                <img src={GRANITE_AVATAR} alt="Granite Coach" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-orbitron text-xl text-cyan-400 mb-2">Welcome, Pathfinder</h3>
              <p className="text-zinc-400 max-w-md mx-auto">
                I am here to guide you through your transmutation journey. 
                Ask me about the physical and spiritual aspects of your transformation.
              </p>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="chat-bubble-user max-w-[80%] p-4 rounded-xl text-zinc-100">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Flesh Response */}
                    {msg.flesh_response && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 mt-1"
                          style={{
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                          }}
                        >
                          <img src={GRANITE_AVATAR} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1 max-w-[80%]">
                          <div className="text-[10px] font-orbitron text-cyan-400 tracking-widest">
                            THE FLESH
                          </div>
                          <div className="chat-bubble-flesh p-4 rounded-xl text-cyan-100">
                            {msg.flesh_response}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Spirit Response */}
                    {msg.spirit_response && (
                      <div className="flex gap-3 ml-11">
                        <div className="space-y-1 max-w-[80%]">
                          <div className="text-[10px] font-orbitron text-violet-400 tracking-widest">
                            THE SPIRIT
                          </div>
                          <div className="chat-bubble-spirit p-4 rounded-xl text-violet-100">
                            {msg.spirit_response}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading state */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 mt-1"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                }}
              >
                <img src={GRANITE_AVATAR} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="chat-bubble-flesh p-4 rounded-xl">
                <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-6 border-t border-zinc-800">
        {!isPro && promptsRemaining <= 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div>
              <div className="text-red-400 font-medium text-sm">Daily limit reached</div>
              <div className="text-zinc-500 text-xs">Upgrade to Granite Protocol Pro for unlimited access</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the Granite Coach..."
              className="flex-1 bg-zinc-900/50 border-zinc-800 text-zinc-100 resize-none focus:border-cyan-400 focus:ring-cyan-400/20 min-h-[60px]"
              disabled={isLoading}
              data-testid="coach-input"
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="btn-pathfinder h-auto"
              data-testid="coach-send"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default GraniteCoachChat;
