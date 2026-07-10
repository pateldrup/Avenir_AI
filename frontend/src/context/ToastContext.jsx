import { createContext, useContext, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, X, AlertCircle } from 'lucide-react'

const ToastContext = createContext(null)
let toastId = 0

const toastConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-green-50',
    border: 'border-green-200',
    iconColor: 'text-green-500',
    titleColor: 'text-green-800',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconColor: 'text-red-500',
    titleColor: 'text-red-800',
  },
  warning: {
    icon: AlertCircle,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconColor: 'text-amber-500',
    titleColor: 'text-amber-800',
  },
}

function ToastItem({ id, type, title, message, onRemove }) {
  const cfg = toastConfig[type] || toastConfig.success
  const Icon = cfg.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      className={`flex items-start gap-3 p-4 rounded-2xl border shadow-lg min-w-[300px] max-w-[380px] ${cfg.bg} ${cfg.border}`}
    >
      <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${cfg.iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-600 font-semibold ${cfg.titleColor}`}>{title}</p>
        {message && <p className="text-sm text-gray-600 mt-0.5">{message}</p>}
      </div>
      <button
        onClick={() => onRemove(id)}
        className="p-0.5 rounded-lg hover:bg-black/5 transition-colors flex-shrink-0"
      >
        <X className="h-4 w-4 text-gray-400" />
      </button>
    </motion.div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ type = 'success', title, message, duration = 3000 }) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, type, title, message }])
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = {
    success: (title, message, opts) => addToast({ type: 'success', title, message, ...opts }),
    error: (title, message, opts) => addToast({ type: 'error', title, message, ...opts }),
    warning: (title, message, opts) => addToast({ type: 'warning', title, message, ...opts }),
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <div key={t.id} className="pointer-events-auto">
              <ToastItem {...t} onRemove={removeToast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx
}
