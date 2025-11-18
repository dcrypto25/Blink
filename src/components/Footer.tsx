export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800/30 border-t border-gray-700 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">
              <span className="text-gradient">Blink</span>Wallet
            </h3>
            <p className="text-gray-400 text-sm">
              The fastest Solana wallet. No seed phrases, just trade.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-blink-400 transition-colors">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blink-400 transition-colors">Security</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blink-400 transition-colors">Roadmap</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blink-400 transition-colors">$BLINK Token</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-blink-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blink-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blink-400 transition-colors">API</a></li>
              <li><a href="https://github.com/dcrypto25/Blink" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blink-400 transition-colors">GitHub</a></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-white font-semibold mb-3">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://twitter.com/BlinkWallet" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blink-400 transition-colors">Twitter</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blink-400 transition-colors">Discord</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blink-400 transition-colors">Telegram</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blink-400 transition-colors">Blog</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm">
            © {currentYear} BlinkWallet. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-blink-400 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-blink-400 text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-blink-400 text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-xs text-yellow-200/80 text-center">
            ⚠️ BlinkWallet is currently in BETA on Solana devnet. Do not use with real funds. DYOR and understand the risks of DeFi.
          </p>
        </div>
      </div>
    </footer>
  )
}
