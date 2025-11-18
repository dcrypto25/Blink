import { useState } from 'react'
import Modal from './Modal'
import { useWalletStore } from '../store/walletStore'

interface SendModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export default function SendModal({ isOpen, onClose, onSuccess, onError }: SendModalProps) {
  const { balance } = useWalletStore()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!recipient || !amount) {
      onError('Please fill in all fields')
      return
    }

    if (parseFloat(amount) > balance) {
      onError('Insufficient balance')
      return
    }

    setIsSending(true)

    // TODO: Implement actual send transaction
    setTimeout(() => {
      setIsSending(false)
      onSuccess(`Successfully sent ${amount} SOL to ${recipient.slice(0, 8)}...`)
      setRecipient('')
      setAmount('')
      onClose()
    }, 2000)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send SOL">
      <div className="space-y-4">
        {/* Recipient Address */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter Solana address"
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blink-500 focus:border-transparent"
          />
        </div>

        {/* Amount */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-300">
              Amount
            </label>
            <span className="text-xs text-gray-400">
              Balance: {balance.toFixed(4)} SOL
            </span>
          </div>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blink-500 focus:border-transparent"
            />
            <button
              onClick={() => setAmount((balance - 0.01).toString())}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-blink-600 hover:bg-blink-700 text-white px-2 py-1 rounded transition-colors"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Estimated Fee */}
        <div className="bg-gray-700/30 rounded-lg p-3 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Network Fee</span>
            <span className="text-white">≈ 0.000005 SOL</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            onClick={onClose}
            disabled={isSending}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isSending || !recipient || !amount}
            className="flex-1 bg-gradient-to-r from-blink-500 to-blink-600 hover:from-blink-600 hover:to-blink-700 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
