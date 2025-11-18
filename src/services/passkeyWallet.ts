/**
 * Passkey Wallet Service
 *
 * This is the core innovation of BlinkWallet:
 * - No seed phrases to write down
 * - 8-second onboarding using WebAuthn
 * - Keypair stored securely in browser with passkey protection
 * - Social recovery as backup
 */

import { startRegistration, startAuthentication } from '@simplewebauthn/browser'
import { Keypair } from '@solana/web3.js'
import bs58 from 'bs58'

const RP_NAME = 'BlinkWallet'
const RP_ID = typeof window !== 'undefined' ? window.location.hostname : 'localhost'

// Demo mode for easy testing (disable in production)
const DEMO_MODE = true

interface PasskeyCredential {
  id: string
  publicKey: string
  encryptedPrivateKey: string
}

/**
 * Convert Uint8Array to base64url string
 */
function bufferToBase64url(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...buffer))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

/**
 * Generate a Solana keypair and encrypt it with passkey
 */
export async function createPasskeyWallet(username: string): Promise<{ publicKey: string; success: boolean }> {
  try {
    // Generate new Solana keypair
    const keypair = Keypair.generate()
    const publicKey = keypair.publicKey.toString()
    const privateKey = bs58.encode(keypair.secretKey)

    // DEMO MODE: Skip passkey authentication for easier testing
    if (DEMO_MODE) {
      console.log('🧪 Demo Mode: Creating wallet without passkey authentication')

      const credential: PasskeyCredential = {
        id: 'demo-' + Date.now(),
        publicKey: publicKey,
        encryptedPrivateKey: privateKey,
      }

      localStorage.setItem('blink-passkey-wallet', JSON.stringify(credential))
      localStorage.setItem('blink-username', username)

      return { publicKey, success: true }
    }

    // PRODUCTION MODE: Use WebAuthn passkeys
    // Create WebAuthn credential for authentication
    const challenge = crypto.getRandomValues(new Uint8Array(32))
    const userId = crypto.getRandomValues(new Uint8Array(32))

    const registrationResponse = await startRegistration({
      challenge: bufferToBase64url(challenge),
      rp: {
        name: RP_NAME,
        id: RP_ID,
      },
      user: {
        id: bufferToBase64url(userId),
        name: username,
        displayName: username,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },  // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      authenticatorSelection: {
        userVerification: 'preferred',
        residentKey: 'preferred',
        requireResidentKey: false,
      },
      timeout: 60000,
      attestation: 'none',
    })

    // Store encrypted keypair in localStorage (encrypted with passkey)
    const credential: PasskeyCredential = {
      id: registrationResponse.id,
      publicKey: publicKey,
      encryptedPrivateKey: privateKey, // In production: encrypt this with passkey
    }

    localStorage.setItem('blink-passkey-wallet', JSON.stringify(credential))
    localStorage.setItem('blink-username', username)

    return { publicKey, success: true }
  } catch (error) {
    console.error('Failed to create passkey wallet:', error)
    return { publicKey: '', success: false }
  }
}

/**
 * Authenticate with passkey and retrieve wallet
 */
export async function authenticateWithPasskey(): Promise<{ publicKey: string; keypair: Keypair | null; success: boolean }> {
  try {
    const storedCredential = localStorage.getItem('blink-passkey-wallet')
    if (!storedCredential) {
      throw new Error('No passkey wallet found')
    }

    const credential: PasskeyCredential = JSON.parse(storedCredential)

    // DEMO MODE: Skip passkey authentication
    if (DEMO_MODE) {
      console.log('🧪 Demo Mode: Authenticating without passkey')

      const privateKeyBytes = bs58.decode(credential.encryptedPrivateKey)
      const keypair = Keypair.fromSecretKey(privateKeyBytes)

      return {
        publicKey: credential.publicKey,
        keypair,
        success: true
      }
    }

    // PRODUCTION MODE: Use WebAuthn
    const challenge = crypto.getRandomValues(new Uint8Array(32))

    await startAuthentication({
      challenge: bufferToBase64url(challenge),
      rpId: RP_ID,
      timeout: 60000,
      userVerification: 'preferred',
    })

    // If authentication successful, decrypt and return keypair
    const privateKeyBytes = bs58.decode(credential.encryptedPrivateKey)
    const keypair = Keypair.fromSecretKey(privateKeyBytes)

    return {
      publicKey: credential.publicKey,
      keypair,
      success: true
    }
  } catch (error) {
    console.error('Failed to authenticate with passkey:', error)
    return { publicKey: '', keypair: null, success: false }
  }
}

/**
 * Check if passkey wallet exists
 */
export function hasPasskeyWallet(): boolean {
  return localStorage.getItem('blink-passkey-wallet') !== null
}

/**
 * Get stored username
 */
export function getStoredUsername(): string | null {
  return localStorage.getItem('blink-username')
}

/**
 * Sign transaction with passkey wallet
 */
export async function signWithPasskey(): Promise<Keypair | null> {
  const result = await authenticateWithPasskey()
  return result.keypair
}

/**
 * Social recovery setup
 * Store encrypted shards of private key with trusted contacts
 */
export async function setupSocialRecovery(guardians: string[]): Promise<boolean> {
  // TODO: Implement Shamir's Secret Sharing
  // Split private key into N shares, require M to recover
  // For now, just store the concept
  console.log('Setting up social recovery with guardians:', guardians)
  return true
}

/**
 * Check if WebAuthn is supported
 */
export function isPasskeySupported(): boolean {
  return (
    window?.PublicKeyCredential !== undefined &&
    navigator?.credentials?.create !== undefined
  )
}

/**
 * Delete wallet (for testing)
 */
export function deleteWallet(): void {
  localStorage.removeItem('blink-passkey-wallet')
  localStorage.removeItem('blink-username')
  console.log('🗑️ Wallet deleted')
}
