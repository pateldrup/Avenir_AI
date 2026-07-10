import { forwardRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

/**
 * AuthInput — icon-prefixed input with floating focus ring and error shake
 */
const AuthInput = forwardRef(function AuthInput(
  {
    label,
    icon: Icon,
    error,
    id,
    rightElement,
    className = '',
    inputClassName = '',
    ...props
  },
  ref
) {
  const [focused, setFocused] = useState(false)

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <motion.div
        animate={error ? { x: [-8, 8, -8, 8, 0] } : { x: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className={`auth-input-wrapper flex items-center gap-2.5 px-3.5 py-3 rounded-xl border bg-white/80 transition-all duration-200 ${
          error
            ? 'error-state'
            : ''
        }`}
        style={{
          borderColor: error ? '#EF4444' : focused ? '#2563EB' : '#E5E7EB',
          boxShadow: error
            ? '0 0 0 3px rgba(239,68,68,0.10)'
            : focused
            ? '0 0 0 3px rgba(37,99,235,0.12)'
            : 'none',
        }}
      >
        {Icon && (
          <Icon
            className="h-5 w-5 flex-shrink-0 transition-colors duration-200"
            style={{ color: error ? '#EF4444' : focused ? '#2563EB' : '#9CA3AF' }}
          />
        )}
        <input
          ref={ref}
          id={id}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`flex-1 bg-transparent text-sm font-medium text-gray-900 placeholder-gray-400 outline-none min-w-0 ${inputClassName}`}
          {...props}
        />
        {rightElement}
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 overflow-hidden"
          >
            <AlertCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
            <p className="text-xs font-medium text-red-600">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

export default AuthInput
