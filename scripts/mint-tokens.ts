/**
 * Mint $BLINK Tokens
 *
 * Mints the initial supply according to tokenomics
 * Run after deploy-blink-token.ts
 *
 * Run with: npx ts-node scripts/mint-tokens.ts
 */

import {
  Connection,
  Keypair,
  PublicKey,
} from '@solana/web3.js'
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  mintTo,
  getAccount,
} from '@solana/spl-token'
import fs from 'fs'
import path from 'path'

async function mintBlinkTokens() {
  console.log('🏭 Minting $BLINK tokens...\n')

  // Load token info
  const tokenInfoPath = path.join(__dirname, '../blink-token.json')
  if (!fs.existsSync(tokenInfoPath)) {
    throw new Error('Token not deployed! Run deploy-blink-token.ts first')
  }

  const tokenInfo = JSON.parse(fs.readFileSync(tokenInfoPath, 'utf-8'))

  // Load deployer keypair
  const keypairPath = path.join(__dirname, '../.keypair.json')
  if (!fs.existsSync(keypairPath)) {
    throw new Error('Deployer keypair not found!')
  }

  const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'))
  const payer = Keypair.fromSecretKey(Uint8Array.from(keypairData))

  // Connect to Solana
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed')

  const mint = new PublicKey(tokenInfo.mintAddress)
  const tokenAccount = new PublicKey(tokenInfo.tokenAccount)

  console.log(`🪙 Mint Address: ${mint.toBase58()}`)
  console.log(`💳 Token Account: ${tokenAccount.toBase58()}`)

  // Check if token account exists, create if not
  try {
    await getAccount(connection, tokenAccount)
    console.log('✅ Token account exists')
  } catch {
    console.log('Creating associated token account...')
    const createAtaIx = createAssociatedTokenAccountInstruction(
      payer.publicKey,
      tokenAccount,
      payer.publicKey,
      mint
    )
    // Would need to send transaction here
  }

  // Mint total supply
  const totalSupply = tokenInfo.totalSupply * Math.pow(10, tokenInfo.decimals)

  console.log(`\n💰 Minting ${tokenInfo.totalSupply.toLocaleString()} $BLINK tokens...`)

  try {
    const signature = await mintTo(
      connection,
      payer,
      mint,
      tokenAccount,
      payer, // mint authority
      totalSupply
    )

    console.log(`✅ Minted! Transaction: ${signature}`)

    // Verify balance
    const accountInfo = await getAccount(connection, tokenAccount)
    const balance = Number(accountInfo.amount) / Math.pow(10, tokenInfo.decimals)

    console.log(`\n📊 Token Account Balance: ${balance.toLocaleString()} $BLINK`)

    console.log('\n🎯 Distribution Plan:')
    console.log(`   - Airdrop (50%): ${tokenInfo.distribution.airdrop.toLocaleString()} $BLINK`)
    console.log(`   - Liquidity (20%): ${tokenInfo.distribution.liquidity.toLocaleString()} $BLINK`)
    console.log(`   - Team (20%): ${tokenInfo.distribution.team.toLocaleString()} $BLINK`)
    console.log(`   - Marketing (10%): ${tokenInfo.distribution.marketing.toLocaleString()} $BLINK`)

    console.log('\n📝 Next Steps:')
    console.log('1. Transfer tokens to distribution wallets')
    console.log('2. Create liquidity pools (Raydium/Orca)')
    console.log('3. Set up vesting contract for team tokens')
    console.log('4. Deploy airdrop contract')
    console.log('5. Update app with token address')

  } catch (error) {
    console.error('❌ Minting failed:', error)
    throw error
  }
}

mintBlinkTokens()
  .then(() => {
    console.log('\n✨ Minting complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
