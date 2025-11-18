import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useWalletStore } from './store/walletStore'
import OnboardingPage from './pages/OnboardingPage'
import TradingPage from './pages/TradingPage'

function App() {
  const { isAuthenticated } = useWalletStore()

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/trade" /> : <OnboardingPage />}
        />
        <Route
          path="/trade"
          element={isAuthenticated ? <TradingPage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  )
}

export default App
