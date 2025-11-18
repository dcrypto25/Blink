import Modal from './Modal'
import { useWalletStore } from '../store/walletStore'
import { useState } from 'react'

interface ReceiveModalProps {
  isOpen: boolean
  onClose: () => void
  onCopy: (message: string) => void
}

export default function ReceiveModal({ isOpen, onClose, onCopy }: ReceiveModalProps) {
  const { publicKey } = useWalletStore()
  const [showQR, setShowQR] = useState(false)

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey)
      onCopy('Address copied to clipboard!')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Receive SOL">
      <div className="space-y-4">
        <p className="text-gray-400 text-sm">
          Send SOL to your wallet address below
        </p>

        {/* QR Code Placeholder */}
        {showQR && (
          <div className="bg-white rounded-lg p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                <span className="text-gray-500 text-sm">QR Code</span>
              </div>
              <p className="text-xs text-gray-600">Scan to send SOL</p>
            </div>
          </div>
        )}

        {/* Address Display */}
        <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">Your Wallet Address</p>
          <p className="text-white font-mono text-sm break-all mb-3">
            {publicKey}
          </p>
          <button
            onClick={copyAddress}
            className="w-full bg-blink-600 hover:bg-blink-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            📋 Copy Address
          </button>
        </div>

        {/* QR Toggle */}
        <button
          onClick={() => setShowQR(!showQR)}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
        >
          {showQR ? 'Hide' : 'Show'} QR Code
        </button>

        {/* Warning */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-400">⚠️</span>
            <p className="text-xs text-yellow-200/90">
              Only send SOL to this address. Sending other tokens may result in loss of funds.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  )
}
