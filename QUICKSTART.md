# BlinkWallet - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Visit http://localhost:5173 and create your first passkey wallet in 8 seconds!

### 3. Deploy $BLINK Token (Optional)

```bash
# Deploy token to Solana devnet
npm run deploy-token

# Mint initial supply
npm run mint-tokens

# Update .env with token address from blink-token.json
echo "VITE_BLINK_TOKEN_ADDRESS=<your-token-address>" > .env
```

## 🏗️ Project Structure

```
blink/
├── src/
│   ├── components/          # React components
│   │   ├── SwapInterface.tsx     # Trading interface
│   │   ├── TokenList.tsx         # Token list/trending
│   │   └── WalletHeader.tsx      # Header with wallet info
│   ├── pages/               # Route pages
│   │   ├── OnboardingPage.tsx    # 8-second onboarding
│   │   └── TradingPage.tsx       # Main trading interface
│   ├── services/            # Core services
│   │   └── passkeyWallet.ts      # Passkey authentication
│   ├── store/               # State management
│   │   └── walletStore.ts        # Wallet state (Zustand)
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── scripts/                 # Deployment scripts
│   ├── deploy-blink-token.ts     # Deploy $BLINK token
│   └── mint-tokens.ts            # Mint token supply
├── index.html               # HTML entry
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
└── tsconfig.json            # TypeScript config
```

## ✨ Key Features

### 1. Passkey Wallet (No Seed Phrases!)
- Uses WebAuthn for authentication
- Biometric security (Face ID, Touch ID, Windows Hello)
- No 12-word phrases to write down
- Social recovery as backup

### 2. Unified Trading Interface
- **Jupiter**: Best rates across all Solana DEXs
- **Moonshot**: Early access to new token launches
- **Pump.fun**: Discover and trade meme coins
- **Birdeye**: Real-time analytics and trading

### 3. $BLINK Token Benefits
- Hold 10K+ $BLINK = **zero swap fees forever**
- All platform fees buy & burn $BLINK
- Lower fees than Phantom (0.05-0.1% vs 0.85%)

## 🛠️ Development

### Run Tests (when added)
```bash
npm run test
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Build
npm run build

# Deploy dist/ folder via Netlify UI
```

### Deploy to Cloudflare Pages
```bash
# Build command: npm run build
# Build output directory: dist
```

## 🔧 Environment Variables

Create a `.env` file in the root:

```env
# Solana RPC URL (devnet for development)
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com

# $BLINK Token Address (from deploy-blink-token.ts)
VITE_BLINK_TOKEN_ADDRESS=

# Optional: Use premium RPC for better performance
# VITE_SOLANA_RPC_URL=https://rpc.helius.xyz/?api-key=YOUR_KEY
```

## 📱 Testing Passkeys

### Requirements:
- **Chrome 67+** (recommended)
- **Modern device** with biometric authentication
- **HTTPS** (or localhost for development)

### Supported Platforms:
- ✅ macOS (Touch ID / Face ID)
- ✅ Windows (Windows Hello)
- ✅ iOS (Face ID / Touch ID)
- ✅ Android (Fingerprint / Face Unlock)

## 🎯 Next Steps

1. **Integrate Real APIs**
   - Jupiter aggregator API
   - Moonshot API
   - Pump.fun API
   - Birdeye API

2. **Deploy $BLINK Token**
   - Run `npm run deploy-token`
   - Set up liquidity pools
   - Enable buy & burn mechanism

3. **Add Social Recovery**
   - Implement Shamir Secret Sharing
   - Allow users to add trusted guardians
   - Enable recovery flow

4. **Launch Airdrop**
   - Airdrop to first 50K users
   - Track Twitter followers
   - Distribute tokens

5. **Expand Platform**
   - Build browser extension
   - Create mobile app (React Native)
   - Add NFT support

## 🐛 Troubleshooting

### Passkey Creation Fails
- Make sure you're on HTTPS or localhost
- Check browser compatibility
- Enable biometrics in system settings

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### Solana Connection Issues
- Check RPC URL in .env
- Try different RPC provider (Helius, Alchemy)
- Verify network status

## 💡 Tips

1. **Use Devnet First**: Test everything on Solana devnet before mainnet
2. **Get Devnet SOL**: Use https://faucet.solana.com for test SOL
3. **Monitor Performance**: Use Lighthouse for PWA optimization
4. **Security**: Never commit .keypair.json or sensitive files

## 📚 Resources

- [Solana Docs](https://docs.solana.com)
- [WebAuthn Guide](https://webauthn.guide)
- [Jupiter API](https://docs.jup.ag)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)

## 🆘 Need Help?

- 📖 Check the [full README](README.md)
- 🐦 Follow [@BlinkWallet](https://twitter.com/BlinkWallet)
- 💬 Join our Discord (coming soon)
- 🐛 Report issues on GitHub

---

**Built with ⚡ speed in mind**

Happy building! 🚀
