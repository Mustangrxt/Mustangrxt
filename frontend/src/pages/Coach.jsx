import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraniteCoachChat } from '../components/GraniteCoachChat';
import { FlowerOfLife } from '../components/FlowerOfLife';
import { Button } from '../components/ui/button';
import { ArrowLeft, Crown } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Coach = ({ user }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promptsRemaining, setPromptsRemaining] = useState(5);

  // Fetch chat history
  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(`${API}/coach/history`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  }, []);

  // Fetch prompts remaining
  const fetchPromptsRemaining = useCallback(async () => {
    try {
      const response = await fetch(`${API}/coach/prompts-remaining`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setPromptsRemaining(data.prompts_remaining);
      }
    } catch (error) {
      console.error('Error fetching prompts remaining:', error);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
    fetchPromptsRemaining();
  }, [fetchHistory, fetchPromptsRemaining]);

  // Send message
  const handleSendMessage = async (message) => {
    setIsLoading(true);
    
    // Optimistically add user message
    const userMsg = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const response = await fetch(`${API}/coach/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add AI response
        const aiMsg = {
          role: 'assistant',
          content: `${data.flesh}\n\n${data.spirit}`,
          flesh_response: data.flesh,
          spirit_response: data.spirit,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMsg]);
        setPromptsRemaining(data.prompts_remaining);
      } else if (response.status === 429) {
        toast.error('Daily prompt limit reached. Upgrade to Pro for unlimited access.');
        // Remove the optimistic user message
        setMessages(prev => prev.slice(0, -1));
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Failed to get response');
        setMessages(prev => prev.slice(0, -1));
      }
    } catch (error) {
      toast.error('Failed to connect to the Granite Coach');
      setMessages(prev => prev.slice(0, -1));
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col">
      <FlowerOfLife />
      <div className="noise-overlay" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 border-b border-zinc-900">
        <div className="flex items-center gap-4">
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
        </div>
        
        {!user?.is_pro && (
          <Button
            onClick={() => navigate('/profile')}
            className="btn-gold text-sm"
            data-testid="upgrade-pro-btn"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        )}
      </header>

      {/* Chat Area */}
      <main className="relative z-10 flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <GraniteCoachChat
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          promptsRemaining={promptsRemaining}
          isPro={user?.is_pro}
        />
      </main>
    </div>
  );
};

export default Coach;
