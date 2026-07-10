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

export default function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Basic verification
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      alert(`Logged in successfully with email: ${email}`);
      onNavigate('landing');
    }, 1500);
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
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => alert('OAuth Google...')}
            className="flex items-center justify-center gap-2.5 py-2.5 bg-white hover:bg-[#F8FAFC] border border-[#E5E7EB] rounded-[12px] text-xs font-bold text-[#111827] shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.186 4.114-3.41 0-6.19-2.78-6.19-6.19a6.197 6.197 0 0 1 6.19-6.19c1.47 0 2.82.52 3.88 1.52l3.1-3.1C18.84 2.29 15.75 1 12.24 1 6.04 1 1 6.04 1 12.24s5.04 11.24 11.24 11.24c5.96 0 10.96-4.29 10.96-11.24 0-.64-.06-1.28-.18-1.96H12.24z"/>
            </svg>
            <span>Google</span>
          </button>

          <button 
            onClick={() => alert('OAuth GitHub...')}
            className="flex items-center justify-center gap-2.5 py-2.5 bg-white hover:bg-[#F8FAFC] border border-[#E5E7EB] rounded-[12px] text-xs font-bold text-[#111827] shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            <span>GitHub</span>
          </button>
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
