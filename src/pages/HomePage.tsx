import { useNavigate } from 'react-router-dom'
import { useWalletStore } from '../store/walletStore'
import Navigation from '../components/Navigation'

export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useWalletStore()

  if (isAuthenticated) {
    navigate('/trade')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blink-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blink-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-6">
            The <span className="text-gradient">fastest</span> way
            <br />
            to trade on Solana
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            No seed phrases. No complex setup. Just create an account and start trading in 8 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/onboard')}
              className="bg-gradient-to-r from-blink-500 to-blink-600 hover:from-blink-600 hover:to-blink-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all glow shadow-2xl"
            >
              Create Wallet in 8s
            </button>
            <button
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all border border-gray-600"
            >
              Learn More
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Secured by WebAuthn</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>0.05% fees or zero with $BLINK</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Audited & Open Source</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-700">
            <div className="text-4xl font-bold text-blink-400 mb-2">8s</div>
            <div className="text-gray-400">Onboarding Time</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-700">
            <div className="text-4xl font-bold text-blink-400 mb-2">0.05%</div>
            <div className="text-gray-400">Trading Fees</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-700">
            <div className="text-4xl font-bold text-blink-400 mb-2">4</div>
            <div className="text-gray-400">DEX Integrations</div>
          </div>
        </div>
      </div>

      {/* Why Blink Section */}
      <div id="features" className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Blink beats the competition
          </h3>
          <p className="text-xl text-gray-400">
            Built for normies, not crypto nerds
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
            <div className="grid grid-cols-3 gap-px bg-gray-700">
              {/* Header */}
              <div className="bg-gray-800 p-6"></div>
              <div className="bg-gray-800 p-6 text-center">
                <div className="text-2xl font-bold text-gradient">Blink</div>
              </div>
              <div className="bg-gray-800 p-6 text-center">
                <div className="text-xl font-semibold text-gray-400">Phantom</div>
              </div>

              {/* Onboarding */}
              <div className="bg-gray-800/50 p-6">
                <div className="font-semibold text-white">Onboarding</div>
              </div>
              <div className="bg-gray-800/50 p-6 text-center">
                <div className="text-green-400 text-2xl mb-1">✓</div>
                <div className="text-sm text-gray-300">8 seconds</div>
              </div>
              <div className="bg-gray-800/50 p-6 text-center">
                <div className="text-yellow-400 text-2xl mb-1">~</div>
                <div className="text-sm text-gray-400">5+ minutes</div>
              </div>

              {/* Seed Phrase */}
              <div className="bg-gray-800/50 p-6">
                <div className="font-semibold text-white">Seed Phrase</div>
              </div>
              <div className="bg-gray-800/50 p-6 text-center">
                <div className="text-green-400 text-2xl mb-1">✓</div>
                <div className="text-sm text-gray-300">No seed phrase</div>
              </div>
              <div className="bg-gray-800/50 p-6 text-center">
                <div className="text-red-400 text-2xl mb-1">✗</div>
                <div className="text-sm text-gray-400">12/24 word phrase</div>
              </div>

              {/* Built-in DEXs */}
              <div className="bg-gray-800/50 p-6">
                <div className="font-semibold text-white">Built-in DEXs</div>
              </div>
              <div className="bg-gray-800/50 p-6 text-center">
                <div className="text-green-400 text-2xl mb-1">✓</div>
                <div className="text-sm text-gray-300">Jupiter, Moonshot, Pump.fun, Birdeye</div>
              </div>
              <div className="bg-gray-800/50 p-6 text-center">
                <div className="text-red-400 text-2xl mb-1">✗</div>
                <div className="text-sm text-gray-400">External only</div>
              </div>

              {/* Trading Fees */}
              <div className="bg-gray-800/50 p-6">
                <div className="font-semibold text-white">Trading Fees</div>
              </div>
              <div className="bg-gray-800/50 p-6 text-center">
                <div className="text-green-400 text-2xl mb-1">✓</div>
                <div className="text-sm text-gray-300">0.05% or FREE</div>
              </div>
              <div className="bg-gray-800/50 p-6 text-center">
                <div className="text-yellow-400 text-2xl mb-1">~</div>
                <div className="text-sm text-gray-400">Variable</div>
              </div>

              {/* Social Recovery */}
              <div className="bg-gray-800/50 p-6">
                <div className="font-semibold text-white">Recovery</div>
              </div>
              <div className="bg-gray-800/50 p-6 text-center">
                <div className="text-green-400 text-2xl mb-1">✓</div>
                <div className="text-sm text-gray-300">Social recovery</div>
              </div>
              <div className="bg-gray-800/50 p-6 text-center">
                <div className="text-yellow-400 text-2xl mb-1">~</div>
                <div className="text-sm text-gray-400">Seed phrase only</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blink-500 transition-all">
            <div className="text-4xl mb-4">⚡</div>
            <h4 className="text-xl font-bold text-white mb-3">8-Second Onboarding</h4>
            <p className="text-gray-400">
              No more writing down seed phrases on paper. Just create a username and use your fingerprint. Done.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blink-500 transition-all">
            <div className="text-4xl mb-4">💎</div>
            <h4 className="text-xl font-bold text-white mb-3">Zero Fees Forever</h4>
            <p className="text-gray-400">
              Hold 10K $BLINK tokens and trade with zero fees. Forever. Our buy & burn mechanism makes this sustainable.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blink-500 transition-all">
            <div className="text-4xl mb-4">🚀</div>
            <h4 className="text-xl font-bold text-white mb-3">All DEXs, One Place</h4>
            <p className="text-gray-400">
              Jupiter for swaps, Moonshot for new launches, Pump.fun for pumps, Birdeye for analytics. No more tab switching.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blink-500 transition-all">
            <div className="text-4xl mb-4">🔐</div>
            <h4 className="text-xl font-bold text-white mb-3">Passkey Security</h4>
            <p className="text-gray-400">
              Your private keys are encrypted with military-grade AES-256. Protected by your device's biometric security.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blink-500 transition-all">
            <div className="text-4xl mb-4">👥</div>
            <h4 className="text-xl font-bold text-white mb-3">Social Recovery</h4>
            <p className="text-gray-400">
              Lost your device? Recover your wallet through trusted friends. No seed phrase stress.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blink-500 transition-all">
            <div className="text-4xl mb-4">🔥</div>
            <h4 className="text-xl font-bold text-white mb-3">Buy & Burn</h4>
            <p className="text-gray-400">
              Every swap burns $BLINK tokens. Deflationary tokenomics that increase value for holders over time.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get started in 3 steps
          </h3>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blink-500 to-blink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-white mb-2">Create your wallet</h4>
                <p className="text-gray-400 text-lg">
                  Choose a username and use your fingerprint or Face ID. Your wallet is created instantly with passkey security.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blink-500 to-blink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-white mb-2">Fund your wallet</h4>
                <p className="text-gray-400 text-lg">
                  Send SOL from an exchange, use a credit card, or transfer from another wallet. Multiple funding options available.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blink-500 to-blink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-white mb-2">Start trading</h4>
                <p className="text-gray-400 text-lg">
                  Access Jupiter, Moonshot, Pump.fun, and Birdeye all in one interface. Find the best trades and execute instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blink-600 to-blink-700 rounded-3xl p-12 text-center max-w-4xl mx-auto border border-blink-500 shadow-2xl">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to trade smarter?
          </h3>
          <p className="text-xl text-blink-100 mb-8">
            Join thousands of traders who chose the fastest Solana wallet
          </p>
          <button
            onClick={() => navigate('/onboard')}
            className="bg-white hover:bg-gray-100 text-blink-600 font-bold py-4 px-12 rounded-xl text-lg transition-all shadow-xl hover:scale-105"
          >
            Create Your Wallet Now
          </button>
          <p className="text-blink-200 text-sm mt-6">
            No credit card required • Takes 8 seconds
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-bold text-gradient mb-4">Blink</h4>
              <p className="text-gray-400 text-sm">
                The fastest Solana wallet for normies
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-3">Product</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-blink-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-blink-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blink-400 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-3">Resources</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-blink-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-blink-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blink-400 transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-3">Community</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="https://twitter.com/BlinkWallet" target="_blank" rel="noopener noreferrer" className="hover:text-blink-400 transition-colors">Twitter</a></li>
                <li><a href="https://discord.gg/blink" target="_blank" rel="noopener noreferrer" className="hover:text-blink-400 transition-colors">Discord</a></li>
                <li><a href="https://github.com/blinkwallet" target="_blank" rel="noopener noreferrer" className="hover:text-blink-400 transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© 2025 Blink. All rights reserved. • <a href="#" className="hover:text-blink-400">Terms</a> • <a href="#" className="hover:text-blink-400">Privacy</a></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
