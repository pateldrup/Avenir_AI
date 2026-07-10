import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  ArrowLeft,
  Cpu,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic verification
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('avenir_user_name', res.data.name);
      localStorage.setItem('avenir_user_email', res.data.email);
      onNavigate('dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google`, {
        token: credentialResponse.credential,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('avenir_user_name', res.data.name);
      localStorage.setItem('avenir_user_email', res.data.email);
      onNavigate('dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-[#111827] flex flex-col justify-center items-center px-4 relative overflow-hidden">

      {/* Decorative blurred gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-[#2563EB]/10 to-[#7C3AED]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#4F46E5]/10 to-[#10B981]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Back button */}
      <button
        onClick={() => onNavigate('landing')}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-bold text-[#6B7280] hover:text-[#111827] bg-white border border-[#E5E7EB] px-4 py-2 rounded-full shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white/80 border border-[#E5E7EB] rounded-[16px] shadow-card hover:shadow-hover p-8 backdrop-blur-xl transition-shadow duration-300 relative z-10"
      >
        {/* Brand/Heading */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-md mb-4">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-[#6B7280] mt-1 font-medium">
            Sign in to analyze your resume gaps
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-[12px] p-3.5 flex items-start gap-2.5 text-xs text-red-700 font-medium"
            >
              <AlertCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Email Input */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-[#6B7280] absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] focus:border-[#2563EB] focus:bg-white rounded-[12px] text-sm text-[#111827] font-medium outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                Password
              </label>
              <a href="#forgot" className="text-xs font-bold text-[#2563EB] hover:underline">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-[#6B7280] absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 bg-[#F8FAFC] border border-[#E5E7EB] focus:border-[#2563EB] focus:bg-white rounded-[12px] text-sm text-[#111827] font-medium outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED] hover:from-[#3B82F6] hover:to-[#8B5CF6] rounded-[12px] shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-grow border-b border-[#E5E7EB]" />
          <span className="text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">
            or continue with
          </span>
          <div className="flex-grow border-b border-[#E5E7EB]" />
        </div>

        {/* Social Logins */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-center w-full [&>div]:w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google authentication failed')}
              text="continue_with"
              size="large"
              shape="rectangular"
              width="100%"
            />
          </div>
        </div>

        {/* Redirect link */}
        <p className="text-xs text-[#6B7280] font-medium mt-8 text-center">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            className="font-bold text-[#2563EB] hover:underline cursor-pointer"
          >
            Create one free
          </button>
        </p>

      </motion.div>
    </div>
  );
}
