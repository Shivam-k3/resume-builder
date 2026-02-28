import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import { useUIStore } from './store/uiStore'
import Login from './components/auth/Login'
import Dashboard from './components/resume/Dashboard'

function App() {
  const { isAuthenticated, initializeAuth } = useAuthStore()
  const { darkMode, setDarkMode } = useUIStore()

  // Initialize Firebase Auth and dark mode on mount
  useEffect(() => {
    // Initialize auth from Firebase
    initializeAuth()

    // Initialize dark mode from localStorage
    const stored = localStorage.getItem('app-dark-mode')
    if (stored !== null) {
      const isDark = stored === 'true'
      setDarkMode(isDark)
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(prefersDark)
      if (prefersDark) {
        document.documentElement.classList.add('dark')
      }
    }
  }, [initializeAuth, setDarkMode])

  // Sync dark mode to DOM whenever it changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <>
      {isAuthenticated ? <Dashboard /> : <Login />}
    </>
  )
}

export default App
