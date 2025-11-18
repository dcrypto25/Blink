import Modal from './Modal'
import { useWalletStore } from '../store/walletStore'

interface FundingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FundingModal({ isOpen, onClose }: FundingModalProps) {
  const { publicKey } = useWalletStore()

  if (!publicKey) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Fund Your Wallet">
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
                    className="ml-2 text-blink-400 hover:text-blink-300 text-xs whitespace-nowrap"
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

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-xs text-blue-200/80">
          💡 Tip: You need SOL to pay for transaction fees on the Solana network, even for swaps.
        </p>
      </div>
    </Modal>
  )
}
