import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { resetPasswordSchema } from '../lib/validations'
import GlassCard from '../components/auth/GlassCard'
import PasswordInput from '../components/auth/PasswordInput'
import PasswordStrengthMeter from '../components/auth/PasswordStrengthMeter'
import GradientButton from '../components/auth/GradientButton'
import { useToast } from '../context/ToastContext'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const password = watch('password', '')
  const confirmPassword = watch('confirmPassword', '')
  const passwordsMatch = password && confirmPassword && password === confirmPassword

  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 1800))
    toast.success('Password reset! 🔐', 'Your password has been updated successfully.')
    setTimeout(() => navigate('/auth/login'), 1000)
  }

  return (
    <GlassCard>
      {/* Heading */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="h-14 w-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.12))' }}
          >
            <ShieldCheck className="h-7 w-7" style={{ color: '#2563EB' }} />
          </motion.div>
        </div>
        <h1 className="text-[26px] font-bold text-gray-900">Set new password</h1>
        <p className="text-sm text-gray-500 mt-1.5">Must be different from your previous password</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-2">
          <PasswordInput
            id="reset-password"
            label="New password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <AnimatePresence>
            {password && <PasswordStrengthMeter password={password} />}
          </AnimatePresence>
        </div>

        <div className="space-y-1">
          <PasswordInput
            id="reset-confirm-password"
            label="Confirm new password"
            placeholder="Repeat your new password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          {/* Real-time match indicator */}
          <AnimatePresence>
            {confirmPassword && !errors.confirmPassword && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-1.5 overflow-hidden"
              >
                <div
                  className={`h-3.5 w-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    passwordsMatch ? 'bg-green-500' : 'bg-red-400'
                  }`}
                >
                  <span className="text-white text-[8px] font-bold">
                    {passwordsMatch ? '✓' : '✗'}
                  </span>
                </div>
                <p className={`text-xs font-medium ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                  {passwordsMatch ? 'Passwords match' : "Passwords don't match"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <GradientButton
          type="submit"
          isLoading={isSubmitting}
          loadingText="Resetting password..."
          id="reset-submit-btn"
        >
          Reset Password
        </GradientButton>
      </form>
    </GlassCard>
  )
}
