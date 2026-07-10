import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

/**
 * GradientButton — primary CTA with loading spinner and hover/tap animation
 */
export default function GradientButton({
  children,
  isLoading = false,
  loadingText = 'Please wait...',
  type = 'button',
  className = '',
  disabled,
  ...props
}) {
  return (
    <motion.button
      type={type}
      disabled={isLoading || disabled}
      whileHover={!isLoading && !disabled ? { scale: 1.02 } : {}}
      whileTap={!isLoading && !disabled ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      className={`
        w-full flex items-center justify-center gap-2.5
        py-3.5 px-6 rounded-xl
        text-sm font-semibold text-white
        gradient-btn
        disabled:opacity-60 disabled:cursor-not-allowed
        transition-shadow duration-200
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="flex-shrink-0"
          >
            <Loader2 className="h-4 w-4" />
          </motion.span>
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {loadingText}
          </motion.span>
        </>
      ) : (
        <motion.span
          key="idle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {children}
        </motion.span>
      )}
    </motion.button>
  )
}
