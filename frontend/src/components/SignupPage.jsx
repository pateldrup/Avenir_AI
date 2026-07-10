import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  Cpu, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export default function SignupPage({ onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'Weak', color: 'bg-red-400' });

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, label: 'None', color: 'bg-gray-200' });
      return;
    }
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let label = 'Weak';
    let color = 'bg-red-400';
    if (score === 2) {
      label = 'Fair';
      color = 'bg-amber-400';
    } else if (score === 3) {
      label = 'Good';
      color = 'bg-blue-400';
    } else if (score === 4) {
      label = 'Strong';
      color = 'bg-emerald-500';
    }

    setPasswordStrength({ score, label, color });
  }, [password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service & Privacy Policy.');
      return;
    }

    setLoading(true);
    // Simulate API registration
    setTimeout(() => {
      setLoading(false);
      onNavigate('dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-[#111827] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      
      {/* Decorative blurred gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-[#2563EB]/10 to-[#7C3AED]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#4F46E5]/10 to-[#10B981]/5 rounded-full blur-[120px] pointer-events-none" />

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
        className="w-full max-w-md bg-white/80 border border-[#E5E7EB] rounded-[16px] shadow-card hover:shadow-hover p-8 backdrop-blur-xl transition-shadow duration-300 relative z-10 my-8"
      >
        {/* Brand/Heading */}
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-md mb-4">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight">
            Create an Account
          </h2>
          <p className="text-sm text-[#6B7280] mt-1 font-medium">
            Start optimizing your resume for ATS score
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

          {/* Name Input */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-[#6B7280] absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] focus:border-[#2563EB] focus:bg-white rounded-[12px] text-sm text-[#111827] font-medium outline-none transition-all"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-[#6B7280] absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] focus:border-[#2563EB] focus:bg-white rounded-[12px] text-sm text-[#111827] font-medium outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Password
            </label>
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

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-[#6B7280] font-semibold">Password Strength:</span>
                  <span className="text-[10px] font-bold text-[#111827]">{passwordStrength.label}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden flex gap-0.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div 
                      key={step} 
                      className={`h-full flex-grow transition-all duration-300 ${
                        step <= passwordStrength.score ? passwordStrength.color : 'bg-gray-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-[#6B7280] absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 bg-[#F8FAFC] border border-[#E5E7EB] focus:border-[#2563EB] focus:bg-white rounded-[12px] text-sm text-[#111827] font-medium outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <label className="flex items-start gap-2.5 mt-2 text-left cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded accent-[#2563EB]"
            />
            <span className="text-[11px] text-[#6B7280] font-medium leading-relaxed select-none">
              I agree to the{' '}
              <a href="#terms" className="font-bold text-[#2563EB] hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#privacy" className="font-bold text-[#2563EB] hover:underline">Privacy Policy</a>.
            </span>
          </label>

          {/* Submit Button - Disabled until user checks agreeTerms */}
          <motion.button
            type="submit"
            disabled={!agreeTerms || loading}
            whileHover={agreeTerms ? { scale: 1.02 } : {}}
            whileTap={agreeTerms ? { scale: 0.98 } : {}}
            className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED] hover:from-[#3B82F6] hover:to-[#8B5CF6] rounded-[12px] shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </motion.button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-grow border-b border-[#E5E7EB]" />
          <span className="text-[10px] font-extrabold text-[#6B7280] uppercase tracking-wider">
            or sign up with
          </span>
          <div className="flex-grow border-b border-[#E5E7EB]" />
        </div>

        {/* Social Logins */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => alert('Google Signup...')}
            className="flex items-center justify-center gap-2.5 py-3 bg-white hover:bg-[#F8FAFC] border border-[#E5E7EB] rounded-[12px] text-xs font-bold text-[#111827] shadow-sm hover:shadow transition-all cursor-pointer w-full"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.186 4.114-3.41 0-6.19-2.78-6.19-6.19a6.197 6.197 0 0 1 6.19-6.19c1.47 0 2.82.52 3.88 1.52l3.1-3.1C18.84 2.29 15.75 1 12.24 1 6.04 1 1 6.04 1 12.24s5.04 11.24 11.24 11.24c5.96 0 10.96-4.29 10.96-11.24 0-.64-.06-1.28-.18-1.96H12.24z"/>
            </svg>
            <span>Sign up with Google</span>
          </button>
        </div>

        {/* Redirect link */}
        <p className="text-xs text-[#6B7280] font-medium mt-6 text-center">
          Already have an account?{' '}
          <button 
            type="button" 
            onClick={() => onNavigate('login')} 
            className="font-bold text-[#2563EB] hover:underline cursor-pointer"
          >
            Sign in instead
          </button>
        </p>

      </motion.div>
    </div>
  );
}
