import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import FloatingBackground from '../components/auth/FloatingBackground'

export default function AuthLayout() {
  const location = useLocation()

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <FloatingBackground />
      <div className="relative z-10 w-full">
        <AnimatePresence mode="wait" initial={false}>
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </div>
    </div>
  )
}
