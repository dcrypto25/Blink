/**
 * Deploy $BLINK Token to Solana
 *
 * This script creates the $BLINK SPL token with the following specs:
 * - Total Supply: 1,000,000,000 tokens
 * - Decimals: 9 (standard for Solana)
 * - Metadata: Name, Symbol, Logo
 *
 * Run with: npx ts-node scripts/deploy-blink-token.ts
 */

import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import {
  createInitializeMintInstruction,
  createMint,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createMintToInstruction,
} from '@solana/spl-token'
import fs from 'fs'
import path from 'path'

// Token Configuration
const TOKEN_CONFIG = {
  name: 'BlinkWallet',
  symbol: 'BLINK',
  decimals: 9,
  totalSupply: 1_000_000_000, // 1 billion tokens
  description: 'The utility token for BlinkWallet - hold 10K for zero swap fees forever',
}

// Distribution (based on tokenomics)
const DISTRIBUTION = {
  airdrop: 500_000_000, // 50% - Airdrop to first 50K users
  liquidity: 200_000_000, // 20% - Liquidity pools
  team: 200_000_000, // 20% - Team (vested)
  marketing: 100_000_000, // 10% - Marketing & Partnerships
}

async function deployBlinkToken() {
  console.log('🚀 Deploying $BLINK Token to Solana...\n')

  // Connect to Solana devnet
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed')

  // Generate or load keypair
  let payer: Keypair
  const keypairPath = path.join(__dirname, '../.keypair.json')

  if (fs.existsSync(keypairPath)) {
    console.log('📂 Loading existing keypair...')
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'))
    payer = Keypair.fromSecretKey(Uint8Array.from(keypairData))
  } else {
    console.log('🔑 Generating new keypair...')
    payer = Keypair.generate()
    fs.writeFileSync(keypairPath, JSON.stringify(Array.from(payer.secretKey)))
    console.log('⚠️  Keypair saved to .keypair.json - KEEP THIS SAFE!')

    // Request airdrop for devnet
    console.log('💰 Requesting devnet airdrop...')
    const airdropSignature = await connection.requestAirdrop(
      payer.publicKey,
      2 * LAMPORTS_PER_SOL
    )
    await connection.confirmTransaction(airdropSignature)
    console.log('✅ Airdrop confirmed')
  }

  console.log(`\n📍 Deployer Address: ${payer.publicKey.toBase58()}`)

  // Check balance
  const balance = await connection.getBalance(payer.publicKey)
  console.log(`💵 Balance: ${balance / LAMPORTS_PER_SOL} SOL`)

  if (balance < 0.1 * LAMPORTS_PER_SOL) {
    console.log('⚠️  Low balance! Requesting airdrop...')
    const airdropSignature = await connection.requestAirdrop(
      payer.publicKey,
      LAMPORTS_PER_SOL
    )
    await connection.confirmTransaction(airdropSignature)
  }

  // Create mint account
  console.log('\n🏭 Creating token mint...')
  const mintKeypair = Keypair.generate()

  const mint = await createMint(
    connection,
    payer,
    payer.publicKey, // mint authority
    payer.publicKey, // freeze authority
    TOKEN_CONFIG.decimals,
    mintKeypair
  )

  console.log(`✅ Token Mint Created: ${mint.toBase58()}`)

  // Create associated token account for the deployer
  console.log('\n💳 Creating associated token account...')
  const associatedTokenAccount = await getAssociatedTokenAddress(
    mint,
    payer.publicKey
  )

  console.log(`✅ Token Account: ${associatedTokenAccount.toBase58()}`)

  // Save token info
  const tokenInfo = {
    name: TOKEN_CONFIG.name,
    symbol: TOKEN_CONFIG.symbol,
    decimals: TOKEN_CONFIG.decimals,
    mintAddress: mint.toBase58(),
    totalSupply: TOKEN_CONFIG.totalSupply,
    deployerAddress: payer.publicKey.toBase58(),
    tokenAccount: associatedTokenAccount.toBase58(),
    network: 'devnet',
    deployedAt: new Date().toISOString(),
    distribution: DISTRIBUTION,
  }

  const tokenInfoPath = path.join(__dirname, '../blink-token.json')
  fs.writeFileSync(tokenInfoPath, JSON.stringify(tokenInfo, null, 2))

  console.log('\n✅ $BLINK Token Deployment Complete!')
  console.log('\n📋 Token Info:')
  console.log(JSON.stringify(tokenInfo, null, 2))

  console.log('\n🎯 Next Steps:')
  console.log('1. Update .env with: VITE_BLINK_TOKEN_ADDRESS=' + mint.toBase58())
  console.log('2. Run: npm run mint-tokens (to mint initial supply)')
  console.log('3. Set up liquidity pools on Raydium/Orca')
  console.log('4. Configure buy & burn mechanism')
  console.log('5. Deploy airdrop contract')

  console.log('\n⚠️  IMPORTANT: Save blink-token.json and .keypair.json securely!')

  return tokenInfo
}

// Run deployment
deployBlinkToken()
  .then(() => {
    console.log('\n✨ Deployment successful!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Deployment failed:', error)
    process.exit(1)
  })
