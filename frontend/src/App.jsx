import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';


import './App.css';

export default function App() {
  const [view, setView] = useState('landing');

  // Page switcher navigation helper
  const handleNavigate = (targetView) => {
    setView(targetView);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AnimatePresence mode="wait">
        
        {view === 'landing' && (
          <motion.div
            key="landing-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <LandingPage onNavigate={handleNavigate} />
          </motion.div>
        )}

        {view === 'login' && (
          <motion.div
            key="login-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <LoginPage onNavigate={handleNavigate} />
          </motion.div>
        )}

        {view === 'signup' && (
          <motion.div
            key="signup-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <SignupPage onNavigate={handleNavigate} />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
