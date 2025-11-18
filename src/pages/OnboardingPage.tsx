import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWalletStore } from '../store/walletStore'
import { createPasskeyWallet, authenticateWithPasskey, hasPasskeyWallet, getStoredUsername } from '../services/passkeyWallet'
import { sanitizeUsername } from '../utils/validation'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { setAuthenticated, setPublicKey, refreshBalances } = useWalletStore()

  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const hasExistingWallet = hasPasskeyWallet()
  const storedUsername = getStoredUsername()

  const handleCreateWallet = async () => {
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    const sanitizedUsername = sanitizeUsername(username)
    if (sanitizedUsername.length < 2) {
      setError('Username must be at least 2 characters')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await createPasskeyWallet(sanitizedUsername)

      if (result.success && result.publicKey) {
        setPublicKey(result.publicKey)
        setAuthenticated(true)
        await refreshBalances()
        navigate('/trade')
      } else {
        setError('Failed to create wallet. Please try again.')
      }
    } catch (err) {
      setError('Failed to create wallet. Make sure your device supports passkeys.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async () => {
    setIsLoading(true)
    setError('')

    try {
      const result = await authenticateWithPasskey()

      if (result.success && result.publicKey) {
        setPublicKey(result.publicKey)
        setAuthenticated(true)
        await refreshBalances()
        navigate('/trade')
      } else {
        setError('Authentication failed. Please try again.')
      }
    } catch (err) {
      setError('Failed to authenticate. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blink-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blink-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4">
            <span className="text-gradient">Blink</span>
          </h1>
          <p className="text-xl text-gray-400">
            The fastest Solana wallet
          </p>
          <p className="text-sm text-gray-500 mt-2">
            No seed phrases. Just trade.
          </p>
          <div className="mt-3">
            <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-semibold rounded-full border border-yellow-500/50">
              🧪 Demo Mode - Instant Wallet Creation
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
          {hasExistingWallet ? (
            // Sign In Flow
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
              <p className="text-gray-400 mb-6">
                Sign in as <span className="text-blink-400">{storedUsername}</span>
              </p>

              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blink-500 to-blink-600 hover:from-blink-600 hover:to-blink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed glow"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  '🔐 Sign In with Passkey'
                )}
              </button>

              <p className="text-center text-gray-500 text-sm mt-4">
                Takes ~3 seconds
              </p>
            </div>
          ) : (
            // Create Wallet Flow
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Get started in 8 seconds</h2>
              <p className="text-gray-400 mb-6">
                Create your wallet with just a username. No seed phrases to write down.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Choose a username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="satoshi"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blink-500 focus:border-transparent"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateWallet()}
                    disabled={isLoading}
                  />
                </div>

                <button
                  onClick={handleCreateWallet}
                  disabled={isLoading || !username.trim()}
                  className="w-full bg-gradient-to-r from-blink-500 to-blink-600 hover:from-blink-600 hover:to-blink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed glow"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating wallet...
                    </span>
                  ) : (
                    '⚡ Create Wallet'
                  )}
                </button>

                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <span>✓ No seed phrases</span>
                  <span>•</span>
                  <span>✓ Biometric security</span>
                  <span>•</span>
                  <span>✓ Social recovery</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-800/30 rounded-lg p-3 hover:bg-gray-800/50 transition-colors">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-xs text-gray-400">8s onboarding</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3 hover:bg-gray-800/50 transition-colors">
            <div className="text-2xl mb-1">💎</div>
            <div className="text-xs text-gray-400">0.05% fees</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3 hover:bg-gray-800/50 transition-colors">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-xs text-gray-400">Buy & burn</div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>🔒 Secured by WebAuthn • 🌐 Open Source • ✅ Audited</p>
        </div>
      </div>
    </div>
  )
}
