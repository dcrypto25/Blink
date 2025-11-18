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

  const handleBuy = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      onError('Please enter a valid amount')
      return
    }
    onSuccess(`Bought ${selectedToken} token successfully!`)
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

      {/* You Receive - Token Selector */}
      <div className="bg-gray-700/50 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">You Receive (New Token)</span>
          <span className="text-sm text-purple-400">≈ {fromAmount ? (parseFloat(fromAmount) * 222).toFixed(0) : '0'}</span>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedToken('MOON')}
            className={`flex items-center space-x-2 ${selectedToken === 'MOON' ? 'bg-purple-600' : 'bg-gray-600'} hover:bg-purple-500 px-4 py-2 rounded-lg transition-colors flex-1 mr-2`}
          >
            <span className="text-xl">🚀</span>
            <div className="text-left">
              <p className="text-white font-medium text-sm">MOON</p>
              <p className="text-xs text-gray-300">+234% 🔥</p>
            </div>
          </button>
          <button
            onClick={() => setSelectedToken('ROCKET')}
            className={`flex items-center space-x-2 ${selectedToken === 'ROCKET' ? 'bg-purple-600' : 'bg-gray-600'} hover:bg-purple-500 px-4 py-2 rounded-lg transition-colors flex-1`}
          >
            <span className="text-xl">🌙</span>
            <div className="text-left">
              <p className="text-white font-medium text-sm">ROCKET</p>
              <p className="text-xs text-gray-300">+89% 📈</p>
            </div>
          </button>
        </div>
      </div>

      {/* Token Details */}
      <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 mb-4">
        <div className="grid grid-cols-3 gap-2 text-xs mb-2">
          <div>
            <p className="text-gray-400">Launched</p>
            <p className="text-white font-medium">2h ago</p>
          </div>
          <div>
            <p className="text-gray-400">Market Cap</p>
            <p className="text-white font-medium">$1.2M</p>
          </div>
          <div>
            <p className="text-gray-400">Holders</p>
            <p className="text-white font-medium">1,234</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleBuy}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all"
      >
        Buy {selectedToken} (New Launch)
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
    { symbol: 'PEPE', emoji: '🐸', change: '+312%', strength: 85, volume: '$8.2M' },
    { symbol: 'DOGE2', emoji: '🐕', change: '+156%', strength: 72, volume: '$3.5M' },
    { symbol: 'WIF', emoji: '🐶', change: '+89%', strength: 64, volume: '$2.1M' },
  ]

  const selected = pumpTokens.find(t => t.symbol === selectedPump) || pumpTokens[0]

  const handleJoinPump = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      onError('Please enter a valid amount')
      return
    }
    onSuccess(`Joined the ${selectedPump} pump! 🚀`)
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

      {/* Pump Strength Meter */}
      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mb-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-400">Pump Strength</span>
          <span className="text-green-400 font-bold">
            {selected.strength > 80 ? 'VERY STRONG 🔥🔥' : selected.strength > 65 ? 'STRONG 🔥' : 'MODERATE 📈'}
          </span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 animate-pulse transition-all"
            style={{ width: `${selected.strength}%` }}
          ></div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-gray-400">Volume (1h)</p>
            <p className="text-white font-medium">{selected.volume}</p>
          </div>
          <div>
            <p className="text-gray-400">Buyers/Sellers</p>
            <p className="text-green-400 font-medium">82% / 18%</p>
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

      {/* Social Sentiment */}
      <div className="bg-gray-700/30 rounded-lg p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🚀🚀🚀</span>
            <span className="text-green-400 font-bold text-sm">BULLISH</span>
          </div>
          <span className="text-xs text-gray-500">(2.4K mentions)</span>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center mt-3">
        Discover and trade trending meme coins
      </p>
    </div>
  )
}

// Birdeye Interface - Analytics Focus
function BirdeyeInterface({ onSuccess, onError }: { hasZeroFees: boolean; onSuccess: (msg: string) => void; onError: (msg: string) => void }) {
  const { balance } = useWalletStore()
  const [fromAmount, setFromAmount] = useState('')
  const [fromToken, setFromToken] = useState('SOL')
  const [toToken, setToToken] = useState('USDC')

  const tokens = ['SOL', 'USDC', 'JUP', 'BONK']

  const handleTrade = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      onError('Please enter a valid amount')
      return
    }
    onSuccess(`Traded ${fromAmount} ${fromToken} for ${toToken} with analytics!`)
    setFromAmount('')
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">🐦 Birdeye Analytics</h2>
        <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded border border-cyan-500/50">
          Real-time Data
        </span>
      </div>

      {/* Mini Chart for Selected Pair */}
      <div className="bg-gray-900/50 rounded-xl p-3 mb-4 border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-white font-bold text-sm">{fromToken}/{toToken}</h3>
            <p className="text-lg text-green-400 font-bold">$156.43</p>
          </div>
          <div className="text-right text-xs text-gray-400">
            <p className="text-green-400 font-medium">+5.2%</p>
            <p>24h</p>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="h-20 bg-gradient-to-t from-cyan-500/10 to-transparent rounded relative">
          <svg className="w-full h-full" viewBox="0 0 200 60">
            <polyline
              points="0,45 25,42 50,44 75,35 100,32 125,28 150,22 175,25 200,18"
              fill="none"
              stroke="rgb(34, 211, 238)"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* From Token */}
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
          <select
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors outline-none"
          >
            {tokens.map(token => (
              <option key={token} value={token}>{token}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Swap Arrow */}
      <div className="flex justify-center -my-2 relative z-10">
        <div className="bg-gray-800 p-2 rounded-full border-4 border-gray-900">
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </div>
      </div>

      {/* To Token */}
      <div className="bg-gray-700/50 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">You Receive</span>
          <span className="text-sm text-cyan-400">≈ {fromAmount ? (parseFloat(fromAmount) * 150).toFixed(2) : '0.00'}</span>
        </div>
        <div className="flex items-center justify-between">
          <input
            type="text"
            value={fromAmount ? (parseFloat(fromAmount) * 150).toFixed(2) : ''}
            readOnly
            placeholder="0.00"
            className="flex-1 bg-transparent text-2xl text-white outline-none"
          />
          <select
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors outline-none"
          >
            {tokens.filter(t => t !== fromToken).map(token => (
              <option key={token} value={token}>{token}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Market Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-700/30 rounded-lg p-2">
          <p className="text-xs text-gray-400">24h Volume</p>
          <p className="text-white font-bold text-sm">$2.1B</p>
          <p className="text-xs text-green-400">+12.3%</p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-2">
          <p className="text-xs text-gray-400">Liquidity</p>
          <p className="text-white font-bold text-sm">$456M</p>
          <p className="text-xs text-cyan-400">Healthy</p>
        </div>
      </div>

      {/* AI Insight */}
      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 mb-4">
        <div className="flex items-start space-x-2">
          <span className="text-lg">📊</span>
          <div>
            <p className="text-cyan-300 font-medium text-xs">AI Trading Signal</p>
            <p className="text-xs text-gray-300 mt-1">
              Strong buy. RSI: 42 (Oversold). Volume ↑
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleTrade}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all"
      >
        Trade with Analytics
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">
        Powered by Birdeye - Real-time analytics and insights
      </p>
    </div>
  )
}
