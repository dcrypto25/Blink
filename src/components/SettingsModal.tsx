import { useState } from 'react'
import Modal from './Modal'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (message: string) => void
}

export default function SettingsModal({ isOpen, onClose, onSuccess }: SettingsModalProps) {
  const [slippage, setSlippage] = useState('1.0')
  const [customSlippage, setCustomSlippage] = useState('')
  const [autoApprove, setAutoApprove] = useState(false)
  const [priorityFee, setPriorityFee] = useState('normal')

  const handleSave = () => {
    localStorage.setItem('blink-settings', JSON.stringify({
      slippage: customSlippage || slippage,
      autoApprove,
      priorityFee,
    }))
    onSuccess('Settings saved successfully!')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="⚙️ Settings" maxWidth="lg">
      <div className="space-y-6">
        {/* Slippage Tolerance */}
        <div>
          <h4 className="text-white font-semibold mb-3">Slippage Tolerance</h4>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {['0.5', '1.0', '2.0', '3.0'].map((value) => (
              <button
                key={value}
                onClick={() => {
                  setSlippage(value)
                  setCustomSlippage('')
                }}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  slippage === value && !customSlippage
                    ? 'bg-blink-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {value}%
              </button>
            ))}
          </div>
          <input
            type="number"
            value={customSlippage}
            onChange={(e) => setCustomSlippage(e.target.value)}
            placeholder="Custom %"
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blink-500"
          />
          <p className="text-xs text-gray-400 mt-2">
            Your transaction will revert if the price changes unfavorably by more than this percentage.
          </p>
        </div>

        {/* Priority Fee */}
        <div>
          <h4 className="text-white font-semibold mb-3">Transaction Priority</h4>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'normal', label: 'Normal', desc: 'Standard fee' },
              { value: 'fast', label: 'Fast', desc: '+0.0001 SOL' },
              { value: 'turbo', label: 'Turbo', desc: '+0.0005 SOL' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setPriorityFee(option.value)}
                className={`p-3 rounded-lg transition-colors ${
                  priorityFee === option.value
                    ? 'bg-blink-600 text-white border-2 border-blink-500'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-2 border-transparent'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs opacity-80">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Auto Approve */}
        <div>
          <div className="flex items-center justify-between bg-gray-700/30 rounded-lg p-4">
            <div>
              <h4 className="text-white font-semibold">Auto Approve Transactions</h4>
              <p className="text-xs text-gray-400 mt-1">
                Skip confirmation for transactions under 0.1 SOL
              </p>
            </div>
            <button
              onClick={() => setAutoApprove(!autoApprove)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoApprove ? 'bg-blink-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoApprove ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* RPC Endpoint */}
        <div>
          <h4 className="text-white font-semibold mb-3">RPC Endpoint</h4>
          <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blink-500">
            <option>Solana Devnet (Default)</option>
            <option>Helius RPC</option>
            <option>Alchemy RPC</option>
            <option>Custom RPC</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-blink-500 to-blink-600 hover:from-blink-600 hover:to-blink-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
          >
            Save Settings
          </button>
        </div>
      </div>
    </Modal>
  )
}
