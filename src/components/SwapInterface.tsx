import { useState } from 'react'
import { useWalletStore } from '../store/walletStore'

interface SwapInterfaceProps {
  platform: 'jupiter' | 'moonshot' | 'pump' | 'birdeye'
  hasZeroFees: boolean
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export default function SwapInterface({ platform, hasZeroFees, onSuccess, onError }: SwapInterfaceProps) {
  const { balance } = useWalletStore()

  const [fromToken] = useState('SOL')
  const [toToken] = useState('USDC')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [isSwapping, setIsSwapping] = useState(false)

  const feePercentage = hasZeroFees ? 0 : 0.085
  const estimatedFee = fromAmount ? (parseFloat(fromAmount) * feePercentage / 100).toFixed(6) : '0'

  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      onError('Please enter a valid amount')
      return
    }

    if (parseFloat(fromAmount) > balance) {
      onError('Insufficient balance')
      return
    }

    setIsSwapping(true)
    setTimeout(() => {
      onSuccess(`Successfully swapped ${fromAmount} ${fromToken} to ${toToken} on ${platform}!`)
      setIsSwapping(false)
      setFromAmount('')
      setToAmount('')
    }, 2000)
  }

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    if (value && !isNaN(parseFloat(value))) {
      const rate = fromToken === 'SOL' ? 150 : 1 / 150
      setToAmount((parseFloat(value) * rate * 0.998).toFixed(6))
    } else {
      setToAmount('')
    }
  }

  const setMaxAmount = () => {
    if (fromToken === 'SOL') {
      const maxAmount = Math.max(0, balance - 0.01)
      handleFromAmountChange(maxAmount.toString())
    }
  }

  // Platform-specific rendering
  if (platform === 'moonshot') {
    return <MoonshotInterface hasZeroFees={hasZeroFees} onSuccess={onSuccess} onError={onError} />
  }

  if (platform === 'pump') {
    return <PumpFunInterface hasZeroFees={hasZeroFees} onSuccess={onSuccess} onError={onError} />
  }

  if (platform === 'birdeye') {
    return <BirdeyeInterface hasZeroFees={hasZeroFees} onSuccess={onSuccess} onError={onError} />
  }

  // Default Jupiter interface
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">🪐 Jupiter Swap</h2>
        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/50">
          Best Routes
        </span>
      </div>

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

      {/* Route Info */}
      <div className="bg-blue-500/10 rounded-lg p-3 mb-4 border border-blue-500/30">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-blue-300 font-medium">Best Route Found:</span>
          <span className="text-green-400 text-xs">+2.3% better</span>
        </div>
        <div className="text-xs text-gray-400">
          Raydium → Orca → Jupiter Pool
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
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSwapping ? 'Swapping...' : 'Swap on Jupiter'}
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">
        Powered by Jupiter aggregator - best rates across all Solana DEXs
      </p>
    </div>
  )
}

// Moonshot Interface - New Token Launches
function MoonshotInterface({ onSuccess, onError }: { hasZeroFees: boolean; onSuccess: (msg: string) => void; onError: (msg: string) => void }) {
  const { balance } = useWalletStore()
  const [fromAmount, setFromAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState('MOON')

  const newTokens = [
    {
      symbol: 'MOON',
      name: 'MoonShot Token',
      emoji: '🚀',
      price: 0.0045,
      change: 234,
      marketCap: '$1.2M',
      holders: 1234,
      launchedAgo: '2 hours ago',
      description: 'The next 100x gem on Solana'
    },
    {
      symbol: 'ROCKET',
      name: 'Rocket to Mars',
      emoji: '🌙',
      price: 0.012,
      change: 89,
      marketCap: '$890K',
      holders: 856,
      launchedAgo: '5 hours ago',
      description: 'Community-driven moon mission'
    },
    {
      symbol: 'GEM',
      name: 'Hidden Gem',
      emoji: '💎',
      price: 0.0089,
      change: 156,
      marketCap: '$2.5M',
      holders: 2103,
      launchedAgo: '1 hour ago',
      description: 'Early access diamond hands only'
    },
  ]

  const selected = newTokens.find(t => t.symbol === selectedToken) || newTokens[0]

  const handleBuy = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      onError('Please enter a valid amount')
      return
    }
    onSuccess(`Bought ${selected.name} successfully! 🚀`)
    setFromAmount('')
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">🌙 Moonshot</h2>
        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/50">
          New Launches
        </span>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
        <div className="flex items-start space-x-2">
          <span className="text-lg">⚠️</span>
          <p className="text-xs text-yellow-200/90">
            New tokens are highly volatile. Only invest what you can afford to lose.
          </p>
        </div>
      </div>

      {/* Pay With */}
      <div className="bg-gray-700/50 rounded-xl p-4 mb-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">You Pay</span>
          <span className="text-sm text-gray-400">Balance: {balance.toFixed(4)}</span>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 bg-transparent text-2xl text-white outline-none"
          />
          <button className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded transition-colors">
            MAX
          </button>
          <button className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg transition-colors">
            <span className="text-xl">◎</span>
            <span className="text-white font-medium">SOL</span>
          </button>
        </div>
      </div>

      {/* Swap Arrow */}
      <div className="flex justify-center -my-2 relative z-10">
        <div className="bg-gray-800 p-2 rounded-full border-4 border-gray-900">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Token Selector Grid */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Select New Launch</p>
        <div className="grid grid-cols-3 gap-2">
          {newTokens.map((token) => (
            <button
              key={token.symbol}
              onClick={() => setSelectedToken(token.symbol)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedToken === token.symbol
                  ? 'bg-purple-600 border-purple-500 scale-105'
                  : 'bg-gray-700/50 border-transparent hover:bg-gray-600'
              }`}
            >
              <div className="text-2xl mb-1">{token.emoji}</div>
              <div className="text-white font-bold text-xs">{token.symbol}</div>
              <div className="text-green-400 text-xs font-medium">+{token.change}%</div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Token Info */}
      <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-xl p-4 mb-4 border border-purple-500/30 transition-all duration-300">
        <div className="flex items-center space-x-3 mb-3">
          <div className="text-4xl">{selected.emoji}</div>
          <div className="flex-1">
            <h3 className="text-white font-bold">{selected.name}</h3>
            <p className="text-xs text-gray-400">{selected.description}</p>
          </div>
          <div className="text-right">
            <p className="text-green-400 font-bold text-lg">+{selected.change}%</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-gray-900/50 rounded p-2">
            <p className="text-gray-400">Price</p>
            <p className="text-white font-medium">${selected.price}</p>
          </div>
          <div className="bg-gray-900/50 rounded p-2">
            <p className="text-gray-400">Market Cap</p>
            <p className="text-white font-medium">{selected.marketCap}</p>
          </div>
          <div className="bg-gray-900/50 rounded p-2">
            <p className="text-gray-400">Holders</p>
            <p className="text-white font-medium">{selected.holders.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-purple-500/20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Launched:</span>
            <span className="text-purple-300 font-medium">{selected.launchedAgo}</span>
          </div>
        </div>
      </div>

      {/* Amount to Receive */}
      <div className="bg-gray-700/30 rounded-lg p-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">You'll Receive</span>
          <span className="text-lg text-purple-400 font-bold">
            ≈ {fromAmount ? (parseFloat(fromAmount) / selected.price).toFixed(0) : '0'} {selected.symbol}
          </span>
        </div>
      </div>

      <button
        onClick={handleBuy}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all"
      >
        {selected.emoji} Buy {selected.symbol} - New Launch!
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">
        🌙 Early access to new token launches on Solana
      </p>
    </div>
  )
}

// Pump.fun Interface - Meme Coin Trading
function PumpFunInterface({ onSuccess, onError }: { hasZeroFees: boolean; onSuccess: (msg: string) => void; onError: (msg: string) => void }) {
  const { balance } = useWalletStore()
  const [fromAmount, setFromAmount] = useState('')
  const [selectedPump, setSelectedPump] = useState('PEPE')

  const pumpTokens = [
    {
      symbol: 'PEPE',
      name: 'Pepe 2.0',
      emoji: '🐸',
      change: 312,
      strength: 85,
      volume: '$8.2M',
      volumeChange: '+24%',
      buyersSellers: '82% / 18%',
      buyersRatio: 82,
      sentiment: 'VERY BULLISH',
      mentions: '12.4K',
      price: 0.000045,
      holders: 45600
    },
    {
      symbol: 'DOGE2',
      name: 'Doge Return',
      emoji: '🐕',
      change: 156,
      strength: 72,
      volume: '$3.5M',
      volumeChange: '+18%',
      buyersSellers: '76% / 24%',
      buyersRatio: 76,
      sentiment: 'BULLISH',
      mentions: '5.2K',
      price: 0.000032,
      holders: 28900
    },
    {
      symbol: 'WIF',
      name: 'Dogwifhat 2',
      emoji: '🐶',
      change: 89,
      strength: 64,
      volume: '$2.1M',
      volumeChange: '+12%',
      buyersSellers: '68% / 32%',
      buyersRatio: 68,
      sentiment: 'MODERATE',
      mentions: '2.8K',
      price: 0.000028,
      holders: 15200
    },
  ]

  const selected = pumpTokens.find(t => t.symbol === selectedPump) || pumpTokens[0]

  const handleJoinPump = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      onError('Please enter a valid amount')
      return
    }
    onSuccess(`Joined the ${selected.name} pump! 🚀`)
    setFromAmount('')
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">🚀 Pump.fun</h2>
        <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded border border-green-500/50 animate-pulse">
          🔥 PUMPING
        </span>
      </div>

      {/* Select Pumping Token */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Select Pumping Token</p>
        <div className="grid grid-cols-3 gap-2">
          {pumpTokens.map((token) => (
            <button
              key={token.symbol}
              onClick={() => setSelectedPump(token.symbol)}
              className={`p-3 rounded-lg border transition-all ${
                selectedPump === token.symbol
                  ? 'bg-green-600 border-green-500'
                  : 'bg-gray-700/50 border-gray-600 hover:bg-gray-600'
              }`}
            >
              <div className="text-2xl mb-1">{token.emoji}</div>
              <div className="text-white font-bold text-sm">{token.symbol}</div>
              <div className="text-green-400 text-xs font-medium">{token.change}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Token Info Card */}
      <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 rounded-xl p-4 mb-4 border border-green-500/30 transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{selected.emoji}</span>
            <div>
              <h3 className="text-white font-bold">{selected.name}</h3>
              <p className="text-xs text-gray-400">Currently Pumping!</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-green-400 font-bold text-xl">+{selected.change}%</p>
            <p className="text-xs text-green-300 animate-pulse">▲ Live</p>
          </div>
        </div>

        {/* Pump Strength Meter */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-400">Pump Strength</span>
            <span className="text-green-400 font-bold">
              {selected.strength > 80 ? 'VERY STRONG 🔥🔥' : selected.strength > 65 ? 'STRONG 🔥' : 'MODERATE 📈'}
            </span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 animate-pulse transition-all duration-500"
              style={{ width: `${selected.strength}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-900/50 rounded p-2">
            <p className="text-gray-400">Volume (1h)</p>
            <p className="text-white font-medium">{selected.volume}</p>
            <p className="text-green-400 text-xs">{selected.volumeChange}</p>
          </div>
          <div className="bg-gray-900/50 rounded p-2">
            <p className="text-gray-400">Buyers/Sellers</p>
            <p className="text-green-400 font-medium">{selected.buyersSellers}</p>
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${selected.buyersRatio}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-gray-900/50 rounded p-2">
            <p className="text-gray-400">Price</p>
            <p className="text-white font-medium">${selected.price}</p>
          </div>
          <div className="bg-gray-900/50 rounded p-2">
            <p className="text-gray-400">Holders</p>
            <p className="text-white font-medium">{selected.holders.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Amount Input */}
      <div className="bg-gray-700/50 rounded-xl p-4 mb-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">You Pay</span>
          <span className="text-sm text-gray-400">Balance: {balance.toFixed(4)}</span>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 bg-transparent text-2xl text-white outline-none"
          />
          <button className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition-colors">
            MAX
          </button>
          <div className="flex items-center space-x-2 bg-gray-600 px-4 py-2 rounded-lg">
            <span className="text-xl">◎</span>
            <span className="text-white font-medium">SOL</span>
          </div>
        </div>
      </div>

      {/* Swap Arrow */}
      <div className="flex justify-center -my-2 relative z-10">
        <div className="bg-gray-800 p-2 rounded-full border-4 border-gray-900">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* You Receive */}
      <div className="bg-gray-700/50 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">You Receive</span>
          <span className="text-sm text-green-400">≈ {fromAmount ? (parseFloat(fromAmount) * 1000000).toLocaleString() : '0'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-3xl">{selected.emoji}</span>
          <div>
            <p className="text-white font-bold">{selectedPump}</p>
            <p className="text-xs text-green-400 animate-pulse">▲ Live Pumping</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleJoinPump}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl transition-all mb-3"
      >
        🚀 Join the Pump
      </button>

      {/* Social Sentiment - Dynamic */}
      <div className="bg-gray-700/30 rounded-lg p-3">
        <p className="text-xs text-gray-400 mb-2">Community Sentiment</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">
              {selected.strength > 80 ? '🚀🚀🚀' : selected.strength > 65 ? '🚀🚀' : '🚀'}
            </span>
            <span className={`font-bold text-sm ${
              selected.strength > 80 ? 'text-green-400' :
              selected.strength > 65 ? 'text-yellow-400' :
              'text-gray-400'
            }`}>
              {selected.sentiment}
            </span>
          </div>
          <span className="text-xs text-gray-500">({selected.mentions} mentions)</span>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center mt-3">
        Discover and trade trending meme coins
      </p>
    </div>
  )
}

// Birdeye Interface - Analytics Dashboard
function BirdeyeInterface({ onSuccess }: { hasZeroFees: boolean; onSuccess: (msg: string) => void; onError: (msg: string) => void }) {
  const [selectedToken, setSelectedToken] = useState('SOL')
  const [timeframe, setTimeframe] = useState('24H')

  const tokens = [
    {
      symbol: 'SOL',
      price: 156.43,
      change: 5.2,
      volume: '$2.1B',
      liquidity: '$456M',
      holders: '2.8M',
      marketCap: '$28.4B',
      rank: '#5',
      rsi: 42,
      macd: 'Bullish ↑',
      macdColor: 'text-green-400',
      // Different chart data for different timeframes
      chartData: {
        '1H': '0,75 15,72 30,78 45,70 60,68 75,65 90,62 105,60 120,58 135,55 150,52 165,48 180,45 195,47 210,44 225,42 240,38 255,35 270,32 285,28 300,25',
        '24H': '0,65 30,62 60,68 90,55 120,52 150,45 180,38 210,42 240,35 270,28 300,25',
        '7D': '0,80 50,75 100,70 150,65 200,55 250,45 300,35',
        '30D': '0,85 75,80 150,70 225,50 300,30',
        '1Y': '0,95 60,85 120,75 180,60 240,40 300,20'
      }
    },
    {
      symbol: 'JUP',
      price: 0.89,
      change: 12.4,
      volume: '$85M',
      liquidity: '$42M',
      holders: '156K',
      marketCap: '$1.2B',
      rank: '#23',
      rsi: 68,
      macd: 'Bullish ↑↑',
      macdColor: 'text-green-500',
      chartData: {
        '1H': '0,85 15,82 30,80 45,78 60,75 75,72 90,68 105,65 120,60 135,55 150,48 165,42 180,35 195,30 210,28 225,25 240,22 255,20 270,18 285,15 300,12',
        '24H': '0,90 30,85 60,80 90,70 120,60 150,50 180,40 210,35 240,30 270,20 300,15',
        '7D': '0,95 50,90 100,80 150,65 200,50 250,35 300,20',
        '30D': '0,98 75,92 150,85 225,70 300,55',
        '1Y': '0,99 60,95 120,90 180,80 240,70 300,60'
      }
    },
    {
      symbol: 'BONK',
      price: 0.000023,
      change: -3.2,
      volume: '$45M',
      liquidity: '$28M',
      holders: '892K',
      marketCap: '$892M',
      rank: '#31',
      rsi: 35,
      macd: 'Bearish ↓',
      macdColor: 'text-red-400',
      chartData: {
        '1H': '0,45 15,48 30,50 45,52 60,55 75,58 90,60 105,62 120,65 135,67 150,70 165,68 180,66 195,64 210,62 225,65 240,68 255,70 270,72 285,75 300,78',
        '24H': '0,35 30,38 60,42 90,45 120,50 150,55 180,60 210,62 240,65 270,70 300,72',
        '7D': '0,25 50,30 100,40 150,50 200,60 250,65 300,70',
        '30D': '0,20 75,30 150,45 225,60 300,75',
        '1Y': '0,10 60,25 120,40 180,55 240,70 300,80'
      }
    },
  ]

  const selected = tokens.find(t => t.symbol === selectedToken) || tokens[0]
  const chartPoints = selected.chartData[timeframe as keyof typeof selected.chartData]

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">🐦 Birdeye Analytics</h2>
        <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded border border-cyan-500/50 animate-pulse">
          Live Data
        </span>
      </div>

      {/* Token Selector */}
      <div className="flex space-x-2">
        {tokens.map((token) => (
          <button
            key={token.symbol}
            onClick={() => setSelectedToken(token.symbol)}
            className={`flex-1 p-3 rounded-lg transition-all ${
              selectedToken === token.symbol
                ? 'bg-cyan-600 border-2 border-cyan-500'
                : 'bg-gray-700/50 border-2 border-transparent hover:bg-gray-600'
            }`}
          >
            <div className="text-white font-bold text-sm">{token.symbol}</div>
            <div className={`text-xs font-medium ${token.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {token.change >= 0 ? '+' : ''}{token.change}%
            </div>
          </button>
        ))}
      </div>

      {/* Price Chart */}
      <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-gray-400 text-xs font-medium">{selected.symbol}/USD</h3>
            <p className="text-3xl text-white font-bold mt-1">${selected.price.toFixed(selected.price < 1 ? 6 : 2)}</p>
            <p className={`text-sm font-medium mt-1 ${selected.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {selected.change >= 0 ? '+' : ''}{selected.change}% ({timeframe})
            </p>
          </div>
          <div className="text-right text-xs text-gray-400">
            <p>High: ${(selected.price * 1.05).toFixed(2)}</p>
            <p>Low: ${(selected.price * 0.95).toFixed(2)}</p>
            <p className="text-cyan-400 mt-1">Vol: {selected.volume}</p>
          </div>
        </div>

        {/* Enhanced Chart Visualization */}
        <div className="h-40 bg-gradient-to-t from-cyan-500/10 to-transparent rounded relative mb-3 transition-all duration-500">
          <svg className="w-full h-full" viewBox="0 0 300 100" key={`${selectedToken}-${timeframe}`}>
            {/* Grid lines */}
            <line x1="0" y1="25" x2="300" y2="25" stroke="rgb(75, 85, 99)" strokeWidth="0.5" opacity="0.3" />
            <line x1="0" y1="50" x2="300" y2="50" stroke="rgb(75, 85, 99)" strokeWidth="0.5" opacity="0.3" />
            <line x1="0" y1="75" x2="300" y2="75" stroke="rgb(75, 85, 99)" strokeWidth="0.5" opacity="0.3" />

            {/* Price line - Dynamic based on selected token and timeframe */}
            <polyline
              points={chartPoints}
              fill="none"
              stroke={selected.change >= 0 ? "rgb(34, 211, 238)" : "rgb(248, 113, 113)"}
              strokeWidth="2.5"
              className="animate-fade-in"
            />

            {/* Gradient fill - Dynamic color based on price change */}
            <defs>
              <linearGradient id={`chartGradient-${selectedToken}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={selected.change >= 0 ? "rgb(34, 211, 238)" : "rgb(248, 113, 113)"} stopOpacity="0.3" />
                <stop offset="100%" stopColor={selected.change >= 0 ? "rgb(34, 211, 238)" : "rgb(248, 113, 113)"} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon
              points={`${chartPoints} 300,100 0,100`}
              fill={`url(#chartGradient-${selectedToken})`}
              className="animate-fade-in"
            />
          </svg>
        </div>

        {/* Timeframe Selector */}
        <div className="flex justify-center space-x-2">
          {['1H', '24H', '7D', '30D', '1Y'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                timeframe === tf
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Market Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-700/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-400">24h Volume</p>
            <span className="text-green-400 text-xs">↑ 12.3%</span>
          </div>
          <p className="text-white font-bold text-lg">{selected.volume}</p>
        </div>

        <div className="bg-gray-700/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-400">Liquidity</p>
            <span className="text-cyan-400 text-xs">Healthy</span>
          </div>
          <p className="text-white font-bold text-lg">{selected.liquidity}</p>
        </div>

        <div className="bg-gray-700/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-400">Holders</p>
            <span className="text-blue-400 text-xs">+2.1%</span>
          </div>
          <p className="text-white font-bold text-lg">{selected.holders}</p>
        </div>

        <div className="bg-gray-700/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-400">Market Cap</p>
            <span className="text-purple-400 text-xs">{selected.rank}</span>
          </div>
          <p className="text-white font-bold text-lg">{selected.marketCap}</p>
        </div>
      </div>

      {/* Technical Indicators - Dynamic */}
      <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
        <h4 className="text-white font-semibold text-sm mb-3">📈 Technical Indicators</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">RSI (14)</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    selected.rsi < 30 ? 'bg-red-500' :
                    selected.rsi > 70 ? 'bg-green-500' :
                    'bg-yellow-500'
                  }`}
                  style={{ width: `${selected.rsi}%` }}
                ></div>
              </div>
              <span className={`text-xs font-medium ${
                selected.rsi < 30 ? 'text-red-400' :
                selected.rsi > 70 ? 'text-green-400' :
                'text-yellow-400'
              }`}>
                {selected.rsi}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">MACD</span>
            <span className={`${selected.macdColor} text-xs font-medium`}>{selected.macd}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Bollinger Bands</span>
            <span className="text-cyan-400 text-xs font-medium">Mid-range</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Moving Avg (50)</span>
            <span className="text-blue-400 text-xs font-medium">Above</span>
          </div>
        </div>
      </div>

      {/* AI-Powered Insights - Dynamic based on token */}
      <div className={`bg-gradient-to-r border rounded-lg p-4 transition-all duration-500 ${
        selected.rsi < 40
          ? 'from-green-900/40 to-emerald-900/40 border-green-500/30'
          : selected.rsi > 60
          ? 'from-red-900/40 to-orange-900/40 border-red-500/30'
          : 'from-cyan-900/40 to-blue-900/40 border-cyan-500/30'
      }`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
            <span className="text-lg">🤖</span>
          </div>
          <div className="flex-1">
            <h4 className="text-cyan-300 font-semibold text-sm mb-1">AI Market Analysis - {selected.symbol}</h4>
            <p className="text-xs text-gray-300 leading-relaxed mb-2">
              {selected.rsi < 40 ? (
                <>Strong accumulation detected. RSI shows oversold conditions at {selected.rsi} with increasing volume.
                Whale wallets increased {selected.symbol} holdings by {(Math.random() * 10 + 5).toFixed(1)}% in last 24h.</>
              ) : selected.rsi > 60 ? (
                <>Overbought territory detected. RSI at {selected.rsi} suggests potential correction incoming.
                Consider taking profits. Smart money taking positions out.</>
              ) : (
                <>Neutral momentum. RSI at {selected.rsi} indicates balanced market.
                Volume trending {selected.change > 0 ? 'up' : 'down'}. Monitor for breakout signals.</>
              )}
            </p>
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <span className={`text-xs px-2 py-1 rounded border ${
                selected.rsi < 40
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : selected.rsi > 60
                  ? 'bg-red-500/20 text-red-400 border-red-500/30'
                  : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
              }`}>
                {selected.rsi < 40 ? '✓ Buy Signal' : selected.rsi > 60 ? '⚠ Sell Signal' : '⊙ Hold'}
              </span>
              <span className="text-xs text-gray-400">
                Confidence: {selected.rsi < 40 ? '78%' : selected.rsi > 60 ? '65%' : '52%'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <button
        onClick={() => onSuccess('Analytics reviewed! Switch to Jupiter to trade.')}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center space-x-2"
      >
        <span>📊</span>
        <span>View Full Analytics Dashboard</span>
      </button>

      <p className="text-xs text-gray-500 text-center">
        Powered by Birdeye API • Real-time on-chain analytics
      </p>
    </div>
  )
}
