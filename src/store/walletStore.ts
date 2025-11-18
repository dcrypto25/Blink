import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

interface WalletState {
  isAuthenticated: boolean
  publicKey: string | null
  balance: number
  blinkBalance: number
  hasZeroFees: boolean // Has 10K+ $BLINK

  // Actions
  setAuthenticated: (value: boolean) => void
  setPublicKey: (key: string | null) => void
  setBalance: (balance: number) => void
  setBlinkBalance: (balance: number) => void
  logout: () => void
  refreshBalances: () => Promise<void>
}

// Solana connection (devnet for now)
const connection = new Connection('https://api.devnet.solana.com', 'confirmed')

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      publicKey: null,
      balance: 0,
      blinkBalance: 0,
      hasZeroFees: false,

      setAuthenticated: (value) => set({ isAuthenticated: value }),

      setPublicKey: (key) => set({ publicKey: key }),

      setBalance: (balance) => set({ balance }),

      setBlinkBalance: (balance) => {
        const hasZeroFees = balance >= 10000
        set({ blinkBalance: balance, hasZeroFees })
      },

      logout: () => set({
        isAuthenticated: false,
        publicKey: null,
        balance: 0,
        blinkBalance: 0,
        hasZeroFees: false
      }),

      refreshBalances: async () => {
        const { publicKey } = get()
        if (!publicKey) return

        try {
          const pubKey = new PublicKey(publicKey)
          const balance = await connection.getBalance(pubKey)
          set({ balance: balance / LAMPORTS_PER_SOL })

          // TODO: Fetch $BLINK token balance when token is deployed
          // For now, set to 0
          set({ blinkBalance: 0, hasZeroFees: false })
        } catch (error) {
          console.error('Failed to refresh balances:', error)
        }
      },
    }),
    {
      name: 'blink-wallet-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        publicKey: state.publicKey,
      }),
    }
  )
)
