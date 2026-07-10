import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { getPasswordStrength, getStrengthScore } from '../../lib/validations'

const strengthLevels = [
  { score: 0, label: '', color: '#E5E7EB', barColor: 'bg-gray-200' },
  { score: 1, label: 'Weak', color: '#EF4444', barColor: 'bg-red-500' },
  { score: 2, label: 'Fair', color: '#F59E0B', barColor: 'bg-amber-500' },
  { score: 3, label: 'Good', color: '#3B82F6', barColor: 'bg-blue-500' },
  { score: 4, label: 'Strong', color: '#10B981', barColor: 'bg-green-500' },
]

const rules = [
  { key: 'minLength', label: '8+ characters' },
  { key: 'hasUppercase', label: '1 uppercase letter' },
  { key: 'hasNumber', label: '1 number' },
  { key: 'hasSpecial', label: '1 special character' },
]

export default function PasswordStrengthMeter({ password = '' }) {
  const score = getStrengthScore(password)
  const checks = getPasswordStrength(password)
  const level = strengthLevels[score] || strengthLevels[0]
  const percent = (score / 4) * 100

  if (!password) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-2.5 overflow-hidden"
    >
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">Password strength</span>
          <AnimatePresence mode="wait">
            {level.label && (
              <motion.span
                key={level.label}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="text-xs font-semibold"
                style={{ color: level.color }}
              >
                {level.label}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${level.barColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Rule checklist */}
      <div className="grid grid-cols-2 gap-1.5">
        {rules.map(rule => {
          const passed = checks[rule.key]
          return (
            <motion.div
              key={rule.key}
              className="flex items-center gap-1.5"
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={passed ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                  passed ? 'bg-green-500' : 'bg-gray-200'
                }`}
              >
                <Check className={`h-2.5 w-2.5 ${passed ? 'text-white' : 'text-gray-400'}`} />
              </motion.div>
              <span
                className={`text-xs transition-colors duration-300 ${
                  passed ? 'text-green-700 font-medium' : 'text-gray-500'
                }`}
              >
                {rule.label}
              </span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
