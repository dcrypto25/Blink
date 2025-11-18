import { useState, useEffect } from 'react'
import { useWalletStore } from '../store/walletStore'
import SwapInterface from '../components/SwapInterface'
import TokenList from '../components/TokenList'
import WalletHeader from '../components/WalletHeader'

type Platform = 'jupiter' | 'moonshot' | 'pump' | 'birdeye'

export default function TradingPage() {
  const { balance, blinkBalance, hasZeroFees, refreshBalances } = useWalletStore()
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('jupiter')

  useEffect(() => {
    refreshBalances()
    // Refresh balances every 30 seconds
    const interval = setInterval(refreshBalances, 30000)
    return () => clearInterval(interval)
  }, [refreshBalances])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <WalletHeader />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blink-600 to-blink-700 rounded-2xl p-6 mb-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blink-100 text-sm">Total Balance</p>
              <h2 className="text-4xl font-bold text-white">{balance.toFixed(4)} SOL</h2>
              <p className="text-blink-100 text-sm mt-1">
                ≈ ${(balance * 150).toFixed(2)} USD
              </p>
            </div>
            <div className="text-right">
              <p className="text-blink-100 text-sm">$BLINK Balance</p>
              <h3 className="text-2xl font-bold text-white">{blinkBalance.toLocaleString()}</h3>
              {hasZeroFees && (
                <span className="inline-block mt-1 px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-semibold rounded-full border border-yellow-500/50">
                  ⚡ Zero Fees Active
                </span>
              )}
            </div>
          </div>

          {!hasZeroFees && blinkBalance > 0 && (
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-sm text-white">
                💡 Hold {(10000 - blinkBalance).toLocaleString()} more $BLINK to unlock zero swap fees forever!
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trading Interface */}
          <div className="lg:col-span-2">
            {/* Platform Selector */}
            <div className="flex space-x-2 mb-4 overflow-x-auto">
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

            <SwapInterface platform={selectedPlatform} hasZeroFees={hasZeroFees} />
          </div>

          {/* Token List / Trending */}
          <div className="lg:col-span-1">
            <TokenList platform={selectedPlatform} />
          </div>
        </div>
      </div>
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
          ? 'bg-blink-600 text-white shadow-lg glow'
          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
        }
      `}
    >
      <span className="text-xl">{icon}</span>
      <span>{name}</span>
    </button>
  )
}
