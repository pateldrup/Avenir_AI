import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import AuthLayout from './layouts/AuthLayout'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import VerifyEmailPage from './pages/auth/VerifyEmailPage'

// Placeholder Dashboard
function Dashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0B0F19, #1e1b4b)' }}>
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-3">🎉 Dashboard</h1>
        <p className="text-indigo-300 mb-6">You are logged in to CareerAI!</p>
        <a
          href="/auth/login"
          className="px-6 py-3 rounded-xl font-semibold text-white text-sm"
          style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
        >
          ← Back to Login
        </a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Auth routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="verify-email" element={<VerifyEmailPage />} />
          </Route>

          {/* App routes */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}
