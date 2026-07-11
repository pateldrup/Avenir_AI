import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';


export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Page switcher navigation helper
  const handleNavigate = (targetView) => {
    if (targetView === 'landing') navigate('/');
    else if (targetView === 'login') navigate('/login');
    else if (targetView === 'signup') navigate('/signup');
    else if (targetView === 'dashboard') navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname.split('/')[1] || '/'}>
          <Route path="/" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <LandingPage onNavigate={handleNavigate} />
            </motion.div>
          } />
          
          <Route path="/login" element={
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <LoginPage onNavigate={handleNavigate} />
            </motion.div>
          } />

          <Route path="/signup" element={
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <SignupPage onNavigate={handleNavigate} />
            </motion.div>
          } />

          <Route path="/dashboard/*" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-screen"
            >
              <DashboardPage onNavigate={handleNavigate} />
            </motion.div>
          } />
          
          <Route path="*" element={<Navigate to={localStorage.getItem('token') ? "/dashboard" : "/"} replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
