import React, { useState, useEffect, useCallback } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { FloatingCoach } from "@/components/FloatingCoach";

// Pages
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Coach from "@/pages/Coach";
import Profile from "@/pages/Profile";
import AuthCallback from "@/pages/AuthCallback";
import FoodPyramidPreview from "@/pages/FoodPyramidPreview";
import Initiation from "@/pages/Initiation";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Protected Route wrapper
const ProtectedRoute = ({ children, user, isLoading }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user data was passed from AuthCallback, skip auth check
    if (location.state?.user) return;
    
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [user, isLoading, navigate, location.state]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !location.state?.user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// App Router component to handle session_id detection
const AppRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch(`${API}/auth/me`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
    setIsLoading(false);
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch(`${API}/auth/me`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Refresh user failed:', error);
    }
  }, []);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await fetch(`${API}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    navigate('/');
  }, [navigate]);

  // Set user from AuthCallback
  const handleAuthSuccess = useCallback((userData) => {
    setUser(userData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Check URL fragment for session_id (returning from auth)
    if (location.hash?.includes('session_id=')) {
      // Don't check auth, let AuthCallback handle it
      setIsLoading(false);
      return;
    }
    
    checkAuth();
  }, [location.hash, checkAuth]);

  // Detect session_id in URL hash and render AuthCallback
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" replace /> : <Landing />} 
        />
        <Route 
          path="/initiation" 
          element={
            <ProtectedRoute user={user} isLoading={isLoading}>
              <Initiation />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute user={user} isLoading={isLoading}>
              <Dashboard user={user || location.state?.user} onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/coach" 
          element={
            <ProtectedRoute user={user} isLoading={isLoading}>
              <Coach user={user || location.state?.user} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute user={user} isLoading={isLoading}>
              <Profile user={user || location.state?.user} onRefreshUser={refreshUser} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/food-pyramid" 
          element={<FoodPyramidPreview />} 
        />
        <Route 
          path="/initiation-preview" 
          element={<Initiation />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Floating Coach - Available throughout the app */}
      <FloatingCoach user={user} />
    </>
  );
};

function App() {
  return (
    <div className="App dark">
      <BrowserRouter>
        <AppRouter />
        <Toaster 
          theme="dark" 
          position="top-right"
          toastOptions={{
            style: {
              background: '#0A0A0A',
              border: '1px solid #27272A',
              color: '#EDEDED'
            }
          }}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
