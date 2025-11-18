interface Transaction {
  id: string
  type: 'send' | 'receive' | 'swap'
  amount: string
  token: string
  to?: string
  from?: string
  status: 'success' | 'pending' | 'failed'
  timestamp: Date
  signature?: string
}

export default function TransactionHistory() {
  // Mock data - replace with real transaction data
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'swap',
      amount: '1.5',
      token: 'SOL → USDC',
      status: 'success',
      timestamp: new Date(Date.now() - 3600000),
      signature: 'abc123...',
    },
    {
      id: '2',
      type: 'receive',
      amount: '5.0',
      token: 'SOL',
      from: '7xKX...2jB9',
      status: 'success',
      timestamp: new Date(Date.now() - 86400000),
      signature: 'def456...',
    },
  ]

  if (transactions.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 text-center">
        <div className="text-5xl mb-3">📜</div>
        <h3 className="text-white font-semibold mb-2">No Transactions Yet</h3>
        <p className="text-gray-400 text-sm">
          Your transaction history will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <h3 className="text-lg font-bold text-white mb-4">Recent Transactions</h3>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-gray-700/30 hover:bg-gray-700/50 rounded-lg p-4 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'send'
                      ? 'bg-red-500/20 text-red-400'
                      : tx.type === 'receive'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {tx.type === 'send' && '↑'}
                  {tx.type === 'receive' && '↓'}
                  {tx.type === 'swap' && '⇄'}
                </div>
                <div>
                  <p className="text-white font-medium capitalize">{tx.type}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-white font-medium">
                  {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.token}
                </p>
                <div className="flex items-center justify-end space-x-1">
                  <span
                    className={`text-xs ${
                      tx.status === 'success'
                        ? 'text-green-400'
                        : tx.status === 'pending'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {tx.status}
                  </span>
                  {tx.signature && (
                    <button className="text-gray-400 hover:text-gray-300">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-blink-400 hover:text-blink-300 text-sm font-medium transition-colors">
        View All Transactions →
      </button>
    </div>
  )
}
