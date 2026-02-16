import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AuthCallback = () => {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      // Get session_id from URL hash
      const hash = window.location.hash;
      const sessionIdMatch = hash.match(/session_id=([^&]+)/);
      
      if (!sessionIdMatch) {
        console.error('No session_id found in URL');
        navigate('/');
        return;
      }

      const sessionId = sessionIdMatch[1];

      try {
        // Exchange session_id for session token
        const response = await fetch(`${API}/auth/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ session_id: sessionId })
        });

        if (response.ok) {
          const user = await response.json();
          // Navigate to dashboard with user data
          navigate('/dashboard', { state: { user } });
        } else {
          console.error('Auth failed:', response.status);
          navigate('/');
        }
      } catch (error) {
        console.error('Auth error:', error);
        navigate('/');
      }
    };

    processAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto mb-4" />
        <h2 className="font-orbitron text-xl text-cyan-400">Authenticating</h2>
        <p className="text-zinc-500 text-sm mt-2">Preparing your journey...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
