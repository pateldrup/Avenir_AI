import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

/** Glassmorphic card wrapper with entrance animation */
export default function GlassCard({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-card w-full max-w-[420px] mx-auto px-10 py-10 ${className}`}
    >
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <Link to="/" className="flex items-center gap-2 mb-1">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
          >
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span
            className="text-2xl font-extrabold tracking-tight gradient-text"
          >
            CareerAI
          </span>
        </Link>
        <p className="text-xs text-gray-400 font-medium tracking-wide">AI Resume Gap Analyzer</p>
      </div>

      {children}
    </motion.div>
  )
}
