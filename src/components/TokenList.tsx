import { useState, useEffect } from 'react'

interface Token {
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: string
  icon: string
}

interface TokenListProps {
  platform: 'jupiter' | 'moonshot' | 'pump' | 'birdeye'
}

export default function TokenList({ platform }: TokenListProps) {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch real data from APIs
    // For now, use mock data
    setLoading(true)
    setTimeout(() => {
      setTokens(getMockTokens(platform))
      setLoading(false)
    }, 500)
  }, [platform])

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <h3 className="text-lg font-bold text-white mb-4">
        {platform === 'jupiter' && '🔥 Trending'}
        {platform === 'moonshot' && '🌙 New Launches'}
        {platform === 'pump' && '🚀 Trending Pumps'}
        {platform === 'birdeye' && '📊 Top Gainers'}
      </h3>

      <div className="space-y-2">
        {tokens.map((token) => (
          <div
            key={token.symbol}
            className="bg-gray-700/30 hover:bg-gray-700/50 rounded-lg p-3 cursor-pointer transition-colors group"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{token.icon}</span>
                <div>
                  <p className="text-white font-medium text-sm">{token.symbol}</p>
                  <p className="text-gray-400 text-xs">{token.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-medium text-sm">
                  ${token.price.toFixed(token.price < 1 ? 4 : 2)}
                </p>
                <p
                  className={`text-xs font-medium ${
                    token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {token.change24h >= 0 ? '+' : ''}
                  {token.change24h.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Vol: {token.volume24h}</span>
              <span className="text-blink-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Trade →
              </span>
            </div>
          </div>
        ))}
      </div>

      {platform === 'moonshot' && (
        <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
          <p className="text-xs text-yellow-300">
            💡 New token launches appear here first. DYOR before trading!
          </p>
        </div>
      )}
    </div>
  )
}

function getMockTokens(platform: string): Token[] {
  const baseTokens = [
    { symbol: 'SOL', name: 'Solana', price: 156.43, change24h: 5.2, volume24h: '$2.1B', icon: '◎' },
    { symbol: 'USDC', name: 'USD Coin', price: 1.00, change24h: 0.01, volume24h: '$4.5B', icon: '💵' },
    { symbol: 'JUP', name: 'Jupiter', price: 0.89, change24h: 12.4, volume24h: '$85M', icon: '🪐' },
    { symbol: 'BONK', name: 'Bonk', price: 0.000023, change24h: -3.2, volume24h: '$45M', icon: '🐕' },
    { symbol: 'WIF', name: 'dogwifhat', price: 2.34, change24h: 8.7, volume24h: '$120M', icon: '🐶' },
  ]

  if (platform === 'moonshot') {
    return [
      { symbol: 'MOON', name: 'MoonShot', price: 0.0045, change24h: 145.2, volume24h: '$5M', icon: '🌙' },
      { symbol: 'ROCKET', name: 'Rocket Token', price: 0.012, change24h: 89.4, volume24h: '$2M', icon: '🚀' },
      { symbol: 'GEM', name: 'Hidden Gem', price: 0.0089, change24h: 234.1, volume24h: '$1.2M', icon: '💎' },
      ...baseTokens.slice(0, 2),
    ]
  }

  if (platform === 'pump') {
    return [
      { symbol: 'PUMP', name: 'Pump Coin', price: 0.0067, change24h: 312.5, volume24h: '$8M', icon: '💪' },
      { symbol: 'MEME', name: 'Meme Lord', price: 0.0023, change24h: 156.8, volume24h: '$3.5M', icon: '😂' },
      ...baseTokens.slice(2),
    ]
  }

  return baseTokens
}
