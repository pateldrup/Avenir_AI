import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, User } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { signupSchema } from '../lib/validations'
import GlassCard from '../components/auth/GlassCard'
import AuthInput from '../components/auth/AuthInput'
import PasswordInput from '../components/auth/PasswordInput'
import PasswordStrengthMeter from '../components/auth/PasswordStrengthMeter'
import GradientButton from '../components/auth/GradientButton'
import SocialButton from '../components/auth/SocialButton'
import { useToast } from '../context/ToastContext'

export default function SignupPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [passwordValue, setPasswordValue] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  })

  // Watch password for strength meter
  const watchedPassword = watch('password', '')

  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 2000))
    toast.success('Account created! 🎉', 'Please verify your email to continue.')
    setTimeout(() => navigate('/auth/verify-email'), 800)
  }

  const handleSocial = (provider) => {
    toast.success(`${provider} sign-up`, 'Redirecting to provider...')
  }

  return (
    <GlassCard>
      {/* Heading */}
      <div className="text-center mb-6">
        <h1 className="text-[26px] font-bold text-gray-900 leading-tight">Create your account</h1>
        <p className="text-sm text-gray-500 mt-1.5">Start closing your skill gaps today</p>
      </div>

      {/* Social buttons */}
      <div className="flex gap-3 mb-5">
        <SocialButton provider="google" onClick={() => handleSocial('Google')} />
        <SocialButton provider="github" onClick={() => handleSocial('GitHub')} />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">or continue with email</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <AuthInput
          id="signup-name"
          label="Full name"
          icon={User}
          type="text"
          placeholder="Jane Smith"
          autoComplete="name"
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <AuthInput
          id="signup-email"
          label="Email address"
          icon={Mail}
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="space-y-2">
          <PasswordInput
            id="signup-password"
            label="Password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <AnimatePresence>
            {watchedPassword && (
              <PasswordStrengthMeter password={watchedPassword} />
            )}
          </AnimatePresence>
        </div>

        <PasswordInput
          id="signup-confirm-password"
          label="Confirm password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {/* Terms */}
        <div className="space-y-1">
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              id="agree-terms"
              className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-indigo-600 cursor-pointer flex-shrink-0"
              {...register('agreeTerms')}
            />
            <span className="text-xs text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">
              I agree to the{' '}
              <a href="#" className="text-blue-600 hover:underline font-medium">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-xs text-red-600 font-medium ml-6">{errors.agreeTerms.message}</p>
          )}
        </div>

        <GradientButton
          type="submit"
          isLoading={isSubmitting}
          loadingText="Creating account..."
          id="signup-submit-btn"
        >
          Create Account
        </GradientButton>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link
          to="/auth/login"
          id="goto-login-link"
          className="font-semibold gradient-text hover:opacity-80 transition-opacity"
        >
          Sign in
        </Link>
      </p>
    </GlassCard>
  )
}
