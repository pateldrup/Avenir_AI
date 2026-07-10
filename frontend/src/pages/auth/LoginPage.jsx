import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { loginSchema } from '../lib/validations'
import GlassCard from '../components/auth/GlassCard'
import AuthInput from '../components/auth/AuthInput'
import PasswordInput from '../components/auth/PasswordInput'
import GradientButton from '../components/auth/GradientButton'
import SocialButton from '../components/auth/SocialButton'
import { useToast } from '../context/ToastContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise(r => setTimeout(r, 1800))

    // Mock: wrong password simulation
    if (data.password === 'wrong') {
      toast.error('Sign in failed', 'Invalid email or password. Please try again.')
      return
    }

    toast.success('Welcome back! 👋', 'You have signed in successfully.')
    setTimeout(() => navigate('/dashboard'), 800)
  }

  const handleSocial = (provider) => {
    toast.success(`${provider} sign-in`, 'Redirecting to provider...')
  }

  return (
    <GlassCard>
      {/* Heading */}
      <div className="text-center mb-6">
        <h1 className="text-[28px] font-bold text-gray-900 leading-tight">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-1.5">Sign in to continue your career journey</p>
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
          id="login-email"
          label="Email address"
          icon={Mail}
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordInput
          id="login-password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        {/* Remember me + Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              id="remember-me"
              className="h-4 w-4 rounded border-gray-300 accent-indigo-600 cursor-pointer"
              {...register('rememberMe')}
            />
            <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
              Remember me
            </span>
          </label>
          <Link
            to="/auth/forgot-password"
            id="forgot-password-link"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <GradientButton
          type="submit"
          isLoading={isSubmitting}
          loadingText="Signing in..."
          id="login-submit-btn"
        >
          Sign In
        </GradientButton>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?{' '}
        <Link
          to="/auth/signup"
          id="goto-signup-link"
          className="font-semibold gradient-text hover:opacity-80 transition-opacity"
        >
          Sign up
        </Link>
      </p>
    </GlassCard>
  )
}
