import { forwardRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Eye, EyeOff } from 'lucide-react'
import AuthInput from './AuthInput'

/**
 * PasswordInput — extends AuthInput with animated show/hide eye toggle
 */
const PasswordInput = forwardRef(function PasswordInput(
  { label = 'Password', id = 'password', error, ...props },
  ref
) {
  const [show, setShow] = useState(false)

  const eyeToggle = (
    <motion.button
      type="button"
      onClick={() => setShow(s => !s)}
      className="flex-shrink-0 p-0.5 rounded-lg"
      aria-label={show ? 'Hide password' : 'Show password'}
      whileTap={{ scale: 0.85 }}
    >
      <AnimatePresence mode="wait">
        {show ? (
          <motion.span
            key="off"
            initial={{ opacity: 0, rotate: -15 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 15 }}
            transition={{ duration: 0.15 }}
          >
            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
          </motion.span>
        ) : (
          <motion.span
            key="on"
            initial={{ opacity: 0, rotate: 15 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -15 }}
            transition={{ duration: 0.15 }}
          >
            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )

  return (
    <AuthInput
      ref={ref}
      id={id}
      label={label}
      icon={Lock}
      type={show ? 'text' : 'password'}
      error={error}
      rightElement={eyeToggle}
      {...props}
    />
  )
})

export default PasswordInput
