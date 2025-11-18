import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWalletStore } from '../store/walletStore'
import FundingModal from './FundingModal'

export default function Navigation() {
  const navigate = useNavigate()
  const { isAuthenticated, publicKey, logout } = useWalletStore()
  const [showFundingModal, setShowFundingModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = () => {
    logout()
    setShowMenu(false)
    navigate('/')
  }

  const shortAddress = publicKey
    ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`
    : ''

  return (
    <>
      <FundingModal
        isOpen={showFundingModal}
        onClose={() => setShowFundingModal(false)}
      />

      <nav className="relative z-50 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-gradient">Blink</h1>
              <span className="text-xs bg-blink-500/20 text-blink-300 px-2 py-1 rounded-full border border-blink-500/50">
                Beta
              </span>
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => {
                  setShowFundingModal(true)
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blink-600/10 hover:bg-blink-600/20 border border-blink-500/30 hover:border-blink-500/50 text-blink-300 hover:text-blink-200 rounded-lg transition-all font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Fund Wallet</span>
              </button>

              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate('/trade')}
                    className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
                  >
                    Trade
                  </button>
                  <div className="h-6 w-px bg-gray-700"></div>
                  <div className="flex items-center space-x-3 bg-gray-700/50 rounded-lg px-4 py-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blink-400 to-blink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {shortAddress.charAt(0)}
                    </div>
                    <span className="text-white font-mono text-sm">{shortAddress}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700/50 rounded-lg transition-all"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/onboard')}
                  className="bg-gradient-to-r from-blink-500 to-blink-600 hover:from-blink-600 hover:to-blink-700 text-white font-semibold py-2 px-6 rounded-lg transition-all glow"
                >
                  Get Started
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {showMenu && (
            <div className="md:hidden mt-4 pb-4 space-y-2">
              <button
                onClick={() => {
                  setShowFundingModal(true)
                  setShowMenu(false)
                }}
                className="w-full flex items-center space-x-2 px-4 py-3 bg-blink-600/10 hover:bg-blink-600/20 border border-blink-500/30 hover:border-blink-500/50 text-blink-300 hover:text-blink-200 rounded-lg transition-all font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Fund Wallet</span>
              </button>

              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      navigate('/trade')
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
                  >
                    Trade
                  </button>
                  <div className="px-4 py-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blink-400 to-blink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {shortAddress.charAt(0)}
                      </div>
                      <span className="text-white font-mono text-sm">{shortAddress}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-gray-700/50 rounded-lg transition-all"
                  >
                    🚪 Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    navigate('/onboard')
                    setShowMenu(false)
                  }}
                  className="w-full bg-gradient-to-r from-blink-500 to-blink-600 hover:from-blink-600 hover:to-blink-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                >
                  Get Started
                </button>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
