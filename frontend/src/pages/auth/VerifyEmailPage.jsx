import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, RefreshCw, CheckCircle } from 'lucide-react'
import GlassCard from '../components/auth/GlassCard'
import OTPInput from '../components/auth/OTPInput'
import GradientButton from '../components/auth/GradientButton'
import { useToast } from '../context/ToastContext'

// Confetti particle burst on success
function ConfettiParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    angle: (i / 12) * 360,
    color: ['#2563EB', '#4F46E5', '#7C3AED', '#10B981', '#F59E0B'][i % 5],
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180
        const x = Math.cos(rad) * 60
        const y = Math.sin(rad) * 60
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full"
            style={{ background: p.color, marginLeft: -5, marginTop: -5 }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x, y, scale: [0, 1.2, 0.6], opacity: [1, 1, 0] }}
            transition={{ duration: 0.8, delay: i * 0.03, ease: 'easeOut' }}
          />
        )
      })}
    </div>
  )
}

const MOCK_EMAIL = 'jane@example.com'
const CORRECT_OTP = '123456'

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState('')
  const [hasError, setHasError] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(30)
  const { toast } = useToast()
  const navigate = useNavigate()

  // Initial cooldown on mount
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const startCooldown = () => {
    setResendCooldown(30)
  }

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Invalid code', 'Please enter all 6 digits.')
      return
    }
    setIsVerifying(true)
    await new Promise(r => setTimeout(r, 1500))

    if (otp !== CORRECT_OTP) {
      setHasError(true)
      setIsVerifying(false)
      toast.error('Wrong code', 'The verification code is incorrect. Try again.')
      setTimeout(() => setHasError(false), 600)
      return
    }

    setVerified(true)
    setIsVerifying(false)
    toast.success('Email verified! ✅', 'Redirecting to your dashboard...')
    setTimeout(() => navigate('/dashboard'), 2500)
  }

  const handleResend = () => {
    if (resendCooldown > 0) return
    toast.success('Code resent!', `New code sent to ${MOCK_EMAIL}`)
    startCooldown()
  }

  return (
    <GlassCard>
      <AnimatePresence mode="wait">
        {verified ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 280, damping: 22 }}
            className="text-center py-4 relative"
          >
            <div className="relative flex justify-center mb-4">
              <ConfettiParticles />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
                className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center"
              >
                <CheckCircle className="h-10 w-10 text-green-500" />
              </motion.div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-sm text-gray-500">Redirecting you to the dashboard...</p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="h-16 w-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.12))' }}
              >
                <Mail className="h-8 w-8" style={{ color: '#2563EB' }} />
              </motion.div>
            </div>

            {/* Heading */}
            <div className="text-center mb-6">
              <h1 className="text-[24px] font-bold text-gray-900">Verify your email</h1>
              <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                We've sent a 6-digit code to{' '}
                <span className="font-semibold text-gray-700">{MOCK_EMAIL}</span>
              </p>
              <p className="text-xs text-blue-500 mt-1 font-medium">(Hint: enter 123456 to demo)</p>
            </div>

            {/* OTP Input */}
            <div className="mb-5">
              <OTPInput
                value={otp}
                onChange={setOtp}
                hasError={hasError}
                length={6}
              />
            </div>

            <GradientButton
              type="button"
              onClick={handleVerify}
              isLoading={isVerifying}
              loadingText="Verifying..."
              id="verify-submit-btn"
            >
              Verify Email
            </GradientButton>

            {/* Resend */}
            <div className="text-center mt-5">
              <p className="text-sm text-gray-500">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="font-semibold gradient-text disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-opacity"
                  id="resend-otp-btn"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend'}
                </button>
              </p>
            </div>

            <div className="text-center mt-3">
              <Link
                to="/auth/login"
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                ← Back to login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}
