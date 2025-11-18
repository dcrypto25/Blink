import { useState, useEffect } from 'react'
import { useWalletStore } from '../store/walletStore'
import SwapInterface from '../components/SwapInterface'
import TokenList from '../components/TokenList'
import WalletHeader from '../components/WalletHeader'
import TransactionHistory from '../components/TransactionHistory'
import SendModal from '../components/SendModal'
import ReceiveModal from '../components/ReceiveModal'
import SettingsModal from '../components/SettingsModal'
import Footer from '../components/Footer'
import { useToast } from '../hooks/useToast'

type Platform = 'jupiter' | 'moonshot' | 'pump' | 'birdeye'

export default function TradingPage() {
  const { balance, blinkBalance, hasZeroFees, refreshBalances } = useWalletStore()
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('jupiter')
  const [sendModalOpen, setSendModalOpen] = useState(false)
  const [receiveModalOpen, setReceiveModalOpen] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)

  const toast = useToast()

  useEffect(() => {
    refreshBalances()
    const interval = setInterval(refreshBalances, 30000)
    return () => clearInterval(interval)
  }, [refreshBalances])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Toast Notifications */}
      <toast.ToastContainer />

      {/* Modals */}
      <SendModal
        isOpen={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
        onSuccess={toast.success}
        onError={toast.error}
      />
      <ReceiveModal
        isOpen={receiveModalOpen}
        onClose={() => setReceiveModalOpen(false)}
        onCopy={toast.success}
      />
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        onSuccess={toast.success}
      />

      {/* Header */}
      <WalletHeader onOpenSettings={() => setSettingsModalOpen(true)} />

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blink-600 to-blink-700 rounded-2xl p-6 mb-6 shadow-2xl animate-fade-in">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <p className="text-blink-100 text-sm">Total Balance</p>
              <h2 className="text-4xl font-bold text-white">{balance.toFixed(4)} SOL</h2>
              <p className="text-blink-100 text-sm mt-1">
                ≈ ${(balance * 150).toFixed(2)} USD
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={() => setSendModalOpen(true)}
                className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl transition-all border border-white/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Send</span>
              </button>
              <button
                onClick={() => setReceiveModalOpen(true)}
                className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl transition-all border border-white/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0l-4-4m4 4l4-4" />
                </svg>
                <span>Receive</span>
              </button>
            </div>
          </div>

          {/* BLINK Balance */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <div>
              <p className="text-blink-100 text-sm">$BLINK Balance</p>
              <h3 className="text-2xl font-bold text-white">{blinkBalance.toLocaleString()}</h3>
            </div>
            {hasZeroFees && (
              <span className="inline-block px-4 py-2 bg-yellow-500/20 text-yellow-300 text-sm font-semibold rounded-full border border-yellow-500/50 animate-pulse">
                ⚡ Zero Fees Active
              </span>
            )}
          </div>

          {!hasZeroFees && blinkBalance > 0 && (
            <div className="mt-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white">
                  💡 Hold {(10000 - blinkBalance).toLocaleString()} more $BLINK for zero fees
                </p>
                <div className="h-2 bg-white/20 rounded-full w-32 overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${(blinkBalance / 10000) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trading Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Platform Selector */}
            <div className="flex flex-wrap gap-2">
              <PlatformTab
                icon="🪐"
                name="Jupiter"
                platform="jupiter"
                selected={selectedPlatform === 'jupiter'}
                onClick={() => setSelectedPlatform('jupiter')}
              />
              <PlatformTab
                icon="🌙"
                name="Moonshot"
                platform="moonshot"
                selected={selectedPlatform === 'moonshot'}
                onClick={() => setSelectedPlatform('moonshot')}
              />
              <PlatformTab
                icon="🚀"
                name="Pump.fun"
                platform="pump"
                selected={selectedPlatform === 'pump'}
                onClick={() => setSelectedPlatform('pump')}
              />
              <PlatformTab
                icon="🐦"
                name="Birdeye"
                platform="birdeye"
                selected={selectedPlatform === 'birdeye'}
                onClick={() => setSelectedPlatform('birdeye')}
              />
            </div>

            <SwapInterface
              platform={selectedPlatform}
              hasZeroFees={hasZeroFees}
              onSuccess={toast.success}
              onError={toast.error}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <TokenList platform={selectedPlatform} />
            <TransactionHistory />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

interface PlatformTabProps {
  icon: string
  name: string
  platform: Platform
  selected: boolean
  onClick: () => void
}

function PlatformTab({ icon, name, selected, onClick }: PlatformTabProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap
        ${selected
          ? 'bg-blink-600 text-white shadow-lg glow scale-105'
          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 hover:scale-102'
        }
      `}
    >
      <span className="text-xl">{icon}</span>
      <span>{name}</span>
    </button>
  )
}
