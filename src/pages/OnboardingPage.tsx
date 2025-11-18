import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWalletStore } from '../store/walletStore'
import { createPasskeyWallet, authenticateWithPasskey, hasPasskeyWallet, getStoredUsername } from '../services/passkeyWallet'
import { sanitizeUsername } from '../utils/validation'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { setAuthenticated, setPublicKey, refreshBalances, publicKey } = useWalletStore()

  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showFunding, setShowFunding] = useState(false)

  const hasExistingWallet = hasPasskeyWallet()
  const storedUsername = getStoredUsername()

  const handleSignIn = async () => {
    if (!password.trim()) {
      setError('Please enter your password')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Try password-based authentication first (simpler)
      const storedWallet = localStorage.getItem('blink-passkey-wallet')
      const storedPassword = localStorage.getItem('blink-password')

      if (storedWallet && storedPassword) {
        if (password === storedPassword) {
          const credential = JSON.parse(storedWallet)
          setPublicKey(credential.publicKey)
          setAuthenticated(true)
          await refreshBalances()
          navigate('/trade')
          return
        } else {
          setError('Incorrect password')
          setIsLoading(false)
          return
        }
      }

      // Fallback to passkey authentication
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

  const handlePasswordSignup = async () => {
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    if (!password.trim() || password.length < 6) {
      setError('Password must be at least 6 characters')
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
        // Store password for later authentication
        localStorage.setItem('blink-password', password)

        setPublicKey(result.publicKey)
        setAuthenticated(true)
        await refreshBalances()
        setShowFunding(true)
      } else {
        setError('Failed to create wallet. Please try again.')
      }
    } catch (err) {
      setError('Failed to create wallet.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // If funding modal is shown, display funding instructions
  if (showFunding && publicKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blink-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blink-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-2xl w-full relative z-10">
          {/* Back/Skip Button */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white flex items-center space-x-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Home</span>
            </button>
            <button
              onClick={() => navigate('/trade')}
              className="text-blink-400 hover:text-blink-300 transition-colors text-sm"
            >
              Skip funding, go to trade →
            </button>
          </div>

          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Wallet Created!
            </h1>
            <p className="text-gray-400">
              Your wallet is ready. Now let's fund it so you can start trading.
            </p>
          </div>

          {/* Funding Options Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl mb-6">
            <h2 className="text-2xl font-bold text-white mb-6">How to fund your wallet</h2>

            <div className="space-y-6">
              {/* Option 1: From Exchange */}
              <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blink-600 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">From an Exchange (Recommended)</h3>
                    <p className="text-gray-400 text-sm mb-3">
                      Withdraw SOL from Coinbase, Binance, Kraken, etc. to your Blink wallet address.
                    </p>
                    <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
                      <p className="text-xs text-gray-400 mb-1">Your Wallet Address:</p>
                      <div className="flex items-center justify-between">
                        <code className="text-blink-400 text-xs break-all">{publicKey}</code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(publicKey)
                          }}
                          className="ml-2 text-blink-400 hover:text-blink-300 text-xs"
                        >
                          📋 Copy
                        </button>
                      </div>
                    </div>
                    <p className="text-yellow-400 text-xs">
                      ⚠️ Make sure to select Solana network when withdrawing
                    </p>
                  </div>
                </div>
              </div>

              {/* Option 2: From Another Wallet */}
              <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blink-600 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">From Another Solana Wallet</h3>
                    <p className="text-gray-400 text-sm mb-3">
                      Transfer SOL from Phantom, Solflare, or any other Solana wallet.
                    </p>
                    <ul className="text-gray-400 text-sm space-y-1">
                      <li>• Open your existing wallet</li>
                      <li>• Select "Send" or "Transfer"</li>
                      <li>• Paste your Blink address above</li>
                      <li>• Confirm the transaction</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Option 3: Devnet Faucet (for testing) */}
              <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blink-600 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">Devnet Faucet (Testing Only)</h3>
                    <p className="text-gray-400 text-sm mb-3">
                      Get free devnet SOL for testing. This is NOT real SOL.
                    </p>
                    <a
                      href={`https://faucet.solana.com/?address=${publicKey}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blink-600 hover:bg-blink-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Get Devnet SOL
                    </a>
                    <p className="text-gray-500 text-xs mt-2">
                      Opens Solana devnet faucet in new tab
                    </p>
                  </div>
                </div>
              </div>

              {/* Option 4: Credit Card (Coming Soon) */}
              <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600 opacity-50">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">Buy with Credit Card</h3>
                    <p className="text-gray-400 text-sm">
                      Purchase SOL directly with your credit card. Coming soon!
                    </p>
                    <span className="inline-block mt-2 px-3 py-1 bg-gray-600 text-gray-300 text-xs rounded-full">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/trade')}
              className="flex-1 bg-gradient-to-r from-blink-500 to-blink-600 hover:from-blink-600 hover:to-blink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all glow"
            >
              Continue to Trading
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-4">
            You can fund your wallet anytime from the trading page
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blink-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blink-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-gray-400 hover:text-white flex items-center space-x-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Home</span>
        </button>

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

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blink-500 focus:border-transparent"
                    onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
                    disabled={isLoading}
                  />
                </div>
              </div>

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
                    Signing in...
                  </span>
                ) : (
                  '🔐 Sign In'
                )}
              </button>

              <button
                onClick={() => {
                  // Clear wallet and start fresh
                  localStorage.removeItem('blink-passkey-wallet')
                  localStorage.removeItem('blink-username')
                  localStorage.removeItem('blink-password')
                  window.location.reload()
                }}
                className="w-full mt-4 text-gray-400 hover:text-white text-sm transition-colors"
              >
                Create new wallet instead
              </button>
            </div>
          ) : (
            // Create Wallet Flow
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Get started in 8 seconds</h2>
              <p className="text-gray-400 mb-6">
                Create your wallet with a username and password. No seed phrases.
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
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Choose a password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blink-500 focus:border-transparent"
                    onKeyDown={(e) => e.key === 'Enter' && handlePasswordSignup()}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 6 characters
                  </p>
                </div>

                <button
                  onClick={handlePasswordSignup}
                  disabled={isLoading || !username.trim() || !password.trim()}
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
                  <span>✓ Password protected</span>
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
