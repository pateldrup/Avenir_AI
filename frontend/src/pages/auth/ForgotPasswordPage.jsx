import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { forgotPasswordSchema } from '../lib/validations'
import GlassCard from '../components/auth/GlassCard'
import AuthInput from '../components/auth/AuthInput'
import GradientButton from '../components/auth/GradientButton'
import { useToast } from '../context/ToastContext'

function EmailSentView({ email, onResend, resendCooldown }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="text-center space-y-5"
    >
      {/* Animated mail icon */}
      <motion.div
        className="flex justify-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }}
      >
        <div
          className="h-20 w-20 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.12))' }}
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <CheckCircle className="h-10 w-10" style={{ color: '#10B981' }} />
          </motion.div>
        </div>
      </motion.div>

      <div>
        <h2 className="text-xl font-bold text-gray-900">Check your email</h2>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          We sent a password reset link to{' '}
          <span className="font-semibold text-gray-700">{email}</span>
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={onResend}
          disabled={resendCooldown > 0}
          className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <RefreshCw className="h-4 w-4" />
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Email'}
        </button>

        <Link
          to="/auth/login"
          id="back-to-login-link"
          className="flex items-center justify-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </div>
    </motion.div>
  )
}

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const startCooldown = () => {
    setResendCooldown(30)
    const timer = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 1800))
    setSubmittedEmail(data.email)
    setSubmitted(true)
    startCooldown()
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Email resent!', `Reset link sent to ${submittedEmail}`)
    startCooldown()
  }

  return (
    <GlassCard>
      <AnimatePresence mode="wait">
        {submitted ? (
          <EmailSentView
            key="sent"
            email={submittedEmail}
            onResend={handleResend}
            resendCooldown={resendCooldown}
          />
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Back link */}
            <Link
              to="/auth/login"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>

            {/* Heading */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-14 w-14 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.12))' }}
                >
                  <Mail className="h-7 w-7" style={{ color: '#2563EB' }} />
                </motion.div>
              </div>
              <h1 className="text-[26px] font-bold text-gray-900">Forgot your password?</h1>
              <p className="text-sm text-gray-500 mt-1.5">
                No worries, we'll send you reset instructions
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <AuthInput
                id="forgot-email"
                label="Email address"
                icon={Mail}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <GradientButton
                type="submit"
                isLoading={isSubmitting}
                loadingText="Sending..."
                id="forgot-submit-btn"
              >
                Send Reset Link
              </GradientButton>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}
