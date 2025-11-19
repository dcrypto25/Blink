import { useState } from 'react'
import { useWalletStore } from '../store/walletStore'
import { useNavigate } from 'react-router-dom'
import FundingModal from './FundingModal'

interface WalletHeaderProps {
  onOpenSettings: () => void
}

export default function WalletHeader({ onOpenSettings }: WalletHeaderProps) {
  const { publicKey, logout } = useWalletStore()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showFundingModal, setShowFundingModal] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleHomeClick = () => {
    logout()
    navigate('/')
  }

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey)
      // Toast will be shown by parent component
    }
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

      <header className="relative z-50 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleHomeClick}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <h1 className="text-2xl font-bold text-gradient">Blink</h1>
                <span className="text-xs bg-blink-500/20 text-blink-300 px-2 py-1 rounded-full border border-blink-500/50">
                  Beta
                </span>
              </button>
            </div>

            {/* Center - Fund Wallet Button */}
            <div className="flex-1 flex justify-center">
              <button
                onClick={() => setShowFundingModal(true)}
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-blink-600/10 hover:bg-blink-600/20 border border-blink-500/30 hover:border-blink-500/50 text-blink-300 hover:text-blink-200 rounded-lg transition-all font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Fund Wallet</span>
              </button>
            </div>

            {/* Wallet Info */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg px-4 py-2 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blink-400 to-blink-600 rounded-full flex items-center justify-center text-white font-bold">
                  {shortAddress.charAt(0)}
                </div>
                <span className="text-white font-mono">{shortAddress}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 overflow-hidden z-[100]">
                  <div className="p-4 border-b border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">Your Address</p>
                    <p className="text-white font-mono text-xs break-all">{publicKey}</p>
                    <button
                      onClick={copyAddress}
                      className="mt-2 w-full text-xs bg-blink-600 hover:bg-blink-700 text-white py-1 px-3 rounded transition-colors"
                    >
                      📋 Copy Address
                    </button>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowFundingModal(true)
                        setShowDropdown(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded transition-colors"
                    >
                      💰 Fund Wallet
                    </button>
                    <button
                      onClick={() => {
                        onOpenSettings()
                        setShowDropdown(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded transition-colors"
                    >
                      ⚙️ Settings
                    </button>
                    <button
                      onClick={() => {
                        handleHomeClick()
                        setShowDropdown(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded transition-colors"
                    >
                      🏠 Home
                    </button>
                    <button
                      onClick={() => {
                        // TODO: Implement social recovery
                        setShowDropdown(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded transition-colors"
                    >
                      🔐 Social Recovery
                    </button>
                    <button
                      onClick={() => {
                        window.open(`https://explorer.solana.com/address/${publicKey}?cluster=devnet`, '_blank')
                        setShowDropdown(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded transition-colors"
                    >
                      🔍 View on Explorer
                    </button>
                    <button
                      onClick={() => {
                        window.open('https://twitter.com/BlinkWallet', '_blank')
                        setShowDropdown(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded transition-colors"
                    >
                      🐦 Follow on Twitter
                    </button>
                    <hr className="my-2 border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded transition-colors"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
