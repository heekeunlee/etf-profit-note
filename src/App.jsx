import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import ErrorBoundary from './components/ErrorBoundary'
import Splash from './components/Splash'
import PasswordScreen from './components/PasswordScreen'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [splashState, setSplashState] = useState('show') // show | fade | hide

  useEffect(() => {
    if (!isAuthenticated) return;

    const fadeTimer = setTimeout(() => setSplashState('fade'), 2700)
    const hideTimer = setTimeout(() => setSplashState('hide'), 3000)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <PasswordScreen onAuthenticated={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-indigo-500 selection:text-white">
      {splashState !== 'hide' ? (
        <Splash isFading={splashState === 'fade'} />
      ) : (
        <ErrorBoundary>
          <Dashboard />
        </ErrorBoundary>
      )}
    </div>
  )
}

export default App
