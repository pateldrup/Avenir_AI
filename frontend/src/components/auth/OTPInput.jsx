import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

/**
 * OTPInput — 6 individual segmented digit boxes with auto-focus, paste, and shake
 */
export default function OTPInput({ value = '', onChange, hasError = false, length = 6 }) {
  const inputs = useRef([])
  const [shaking, setShaking] = useState(false)

  const digits = Array.from({ length }, (_, i) => value[i] || '')

  const triggerShake = useCallback(() => {
    setShaking(true)
    setTimeout(() => setShaking(false), 500)
  }, [])

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, '')
    if (!val) {
      const newOtp = digits.map((d, i) => (i === index ? '' : d)).join('')
      onChange(newOtp)
      return
    }
    const char = val[val.length - 1]
    const newOtp = digits.map((d, i) => (i === index ? char : d)).join('')
    onChange(newOtp)
    if (index < length - 1) inputs.current[index + 1]?.focus()
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        const newOtp = digits.map((d, i) => (i === index - 1 ? '' : d)).join('')
        onChange(newOtp)
        inputs.current[index - 1]?.focus()
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) inputs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < length - 1) inputs.current[index + 1]?.focus()
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (pasted) {
      onChange(pasted.padEnd(length, '').slice(0, length))
      const nextEmpty = Math.min(pasted.length, length - 1)
      inputs.current[nextEmpty]?.focus()
    }
  }

  return (
    <motion.div
      className="flex items-center justify-center gap-3"
      animate={shaking || hasError ? { x: [-8, 8, -8, 8, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={el => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={digit}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKeyDown(e, i)}
          onPaste={handlePaste}
          onFocus={e => e.target.select()}
          className={`otp-input ${digit ? 'filled' : ''} ${hasError ? 'error' : ''}`}
          aria-label={`Digit ${i + 1}`}
          id={`otp-input-${i}`}
          autoComplete="one-time-code"
        />
      ))}
    </motion.div>
  )
}
