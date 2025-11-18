import { useState } from 'react'
import { useWalletStore } from '../store/walletStore'

interface SwapInterfaceProps {
  platform: 'jupiter' | 'moonshot' | 'pump' | 'birdeye'
  hasZeroFees: boolean
}

export default function SwapInterface({ platform, hasZeroFees }: SwapInterfaceProps) {
  const { balance } = useWalletStore()

  const [fromToken] = useState('SOL')
  const [toToken] = useState('USDC')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [isSwapping, setIsSwapping] = useState(false)

  const feePercentage = hasZeroFees ? 0 : 0.085 // 0.085% if not zero fee holder
  const estimatedFee = fromAmount ? (parseFloat(fromAmount) * feePercentage / 100).toFixed(6) : '0'

  const handleSwap = async () => {
    setIsSwapping(true)

    // TODO: Implement actual swap logic based on platform
    // For now, just simulate
    setTimeout(() => {
      alert(`Swapping ${fromAmount} ${fromToken} to ${toToken} on ${platform}!`)
      setIsSwapping(false)
      setFromAmount('')
      setToAmount('')
    }, 2000)
  }

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    // Simulate price calculation
    if (value && !isNaN(parseFloat(value))) {
      const rate = fromToken === 'SOL' ? 150 : 1 / 150
      setToAmount((parseFloat(value) * rate * 0.998).toFixed(6)) // 0.2% slippage
    } else {
      setToAmount('')
    }
  }

  const setMaxAmount = () => {
    if (fromToken === 'SOL') {
      const maxAmount = Math.max(0, balance - 0.01) // Keep 0.01 SOL for fees
      handleFromAmountChange(maxAmount.toString())
    }
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">
        {platform === 'jupiter' && '🪐 Jupiter Swap'}
        {platform === 'moonshot' && '🌙 Moonshot'}
        {platform === 'pump' && '🚀 Pump.fun'}
        {platform === 'birdeye' && '🐦 Birdeye Trade'}
      </h2>

      {/* From Token */}
      <div className="bg-gray-700/50 rounded-xl p-4 mb-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">From</span>
          <span className="text-sm text-gray-400">
            Balance: {fromToken === 'SOL' ? balance.toFixed(4) : '0.00'}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="number"
            value={fromAmount}
            onChange={(e) => handleFromAmountChange(e.target.value)}
            placeholder="0.00"
            className="flex-1 bg-transparent text-2xl text-white outline-none"
          />
          <button
            onClick={setMaxAmount}
            className="text-xs bg-blink-600 hover:bg-blink-700 text-white px-2 py-1 rounded transition-colors"
          >
            MAX
          </button>
          <button className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg transition-colors">
            <span className="text-xl">◎</span>
            <span className="text-white font-medium">{fromToken}</span>
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center -my-2 relative z-10">
        <button className="bg-gray-800 p-2 rounded-full border-4 border-gray-900 hover:bg-gray-700 transition-colors">
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>

      {/* To Token */}
      <div className="bg-gray-700/50 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">To</span>
          <span className="text-sm text-gray-400">Balance: 0.00</span>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="number"
            value={toAmount}
            readOnly
            placeholder="0.00"
            className="flex-1 bg-transparent text-2xl text-white outline-none"
          />
          <button className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg transition-colors">
            <span className="text-xl">💵</span>
            <span className="text-white font-medium">{toToken}</span>
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Fee Info */}
      <div className="bg-gray-700/30 rounded-lg p-3 mb-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-400">
          <span>Rate</span>
          <span className="text-white">1 SOL ≈ 150 USDC</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Fee</span>
          <span className={hasZeroFees ? 'text-green-400 font-medium' : 'text-white'}>
            {hasZeroFees ? (
              <span>🎉 FREE (Zero fee holder)</span>
            ) : (
              <span>{estimatedFee} SOL ({feePercentage}%)</span>
            )}
          </span>
        </div>
        {!hasZeroFees && (
          <div className="flex justify-between items-center text-gray-400">
            <span>Fee goes to:</span>
            <span className="text-orange-400 text-xs">🔥 $BLINK Buy & Burn</span>
          </div>
        )}
      </div>

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={!fromAmount || parseFloat(fromAmount) <= 0 || isSwapping}
        className="w-full bg-gradient-to-r from-blink-500 to-blink-600 hover:from-blink-600 hover:to-blink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed glow"
      >
        {isSwapping ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Swapping...
          </span>
        ) : (
          'Swap'
        )}
      </button>

      {/* Platform Specific Info */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 text-center">
          {platform === 'jupiter' && 'Powered by Jupiter aggregator - best rates across Solana DEXs'}
          {platform === 'moonshot' && 'Trade new tokens on Moonshot - early access to launches'}
          {platform === 'pump' && 'Pump.fun integration - discover and trade meme coins'}
          {platform === 'birdeye' && 'Real-time analytics from Birdeye - trade with insights'}
        </p>
      </div>
    </div>
  )
}
