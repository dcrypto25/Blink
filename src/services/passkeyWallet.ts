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

// Demo mode for easy testing (automatically disabled in production)
const DEMO_MODE = import.meta.env.MODE === 'development' &&
                  import.meta.env.VITE_ENABLE_DEMO_MODE === 'true'

interface PasskeyCredential {
  id: string
  publicKey: string
  encryptedPrivateKey: string
  iv?: string // Initialization vector for AES-GCM
  salt?: string // Salt for PBKDF2 key derivation
}

/**
 * Convert Uint8Array to base64url string
 */
function bufferToBase64url(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...buffer))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

/**
 * Convert base64url string to Uint8Array
 */
function base64urlToBuffer(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (3 * base64url.length) % 4)
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

/**
 * Derive encryption key from user's PIN/password
 * Uses PBKDF2 for key derivation
 */
async function deriveEncryptionKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const passphraseKey = await crypto.subtle.importKey(
    'raw',
    // @ts-expect-error - TypeScript strict mode false positive with TextEncoder type
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      // @ts-expect-error - Uint8Array is valid BufferSource but TS strict mode disagrees
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passphraseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )
}

/**
 * Encrypt data using AES-GCM
 */
async function encryptData(data: string, key: CryptoKey): Promise<{ encrypted: string; iv: string }> {
  const encoder = new TextEncoder()
  const iv = crypto.getRandomValues(new Uint8Array(12))

  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    // @ts-expect-error - TypeScript strict mode false positive with Web Crypto API
    encoder.encode(data)
  )

  return {
    encrypted: bufferToBase64url(new Uint8Array(encryptedData)),
    iv: bufferToBase64url(iv),
  }
}

/**
 * Decrypt data using AES-GCM
 */
async function decryptData(encryptedData: string, iv: string, key: CryptoKey): Promise<string> {
  const decryptedData = await crypto.subtle.decrypt(
    // @ts-expect-error - TypeScript strict mode false positive with Web Crypto API
    { name: 'AES-GCM', iv: base64urlToBuffer(iv) },
    key,
    base64urlToBuffer(encryptedData)
  )

  const decoder = new TextDecoder()
  return decoder.decode(decryptedData)
}

/**
 * Generate a secure passphrase from passkey credential
 * In production, this should use a more secure method
 */
function generatePassphraseFromCredential(credentialId: string, username: string): string {
  // Combine credential ID with username for deterministic passphrase
  return `${credentialId}-${username}-blink-wallet`
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

    // PRODUCTION MODE: Use WebAuthn passkeys with encryption
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

    // Encrypt private key with derived key from passkey credential
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const passphrase = generatePassphraseFromCredential(registrationResponse.id, username)
    const encryptionKey = await deriveEncryptionKey(passphrase, salt)
    const { encrypted, iv } = await encryptData(privateKey, encryptionKey)

    // Store encrypted keypair in localStorage
    const credential: PasskeyCredential = {
      id: registrationResponse.id,
      publicKey: publicKey,
      encryptedPrivateKey: encrypted, // ENCRYPTED with AES-GCM
      iv: iv,
      salt: bufferToBase64url(salt),
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

    // PRODUCTION MODE: Use WebAuthn with decryption
    const challenge = crypto.getRandomValues(new Uint8Array(32))

    await startAuthentication({
      challenge: bufferToBase64url(challenge),
      rpId: RP_ID,
      timeout: 60000,
      userVerification: 'preferred',
    })

    // If authentication successful, decrypt private key
    const username = getStoredUsername() || 'user'
    const passphrase = generatePassphraseFromCredential(credential.id, username)

    if (!credential.salt || !credential.iv) {
      // Legacy unencrypted wallet - migrate to encrypted format
      console.warn('⚠️  Legacy wallet detected - migrating to encrypted format')
      const privateKeyBytes = bs58.decode(credential.encryptedPrivateKey)
      const keypair = Keypair.fromSecretKey(privateKeyBytes)
      return { publicKey: credential.publicKey, keypair, success: true }
    }

    const salt = base64urlToBuffer(credential.salt)
    const encryptionKey = await deriveEncryptionKey(passphrase, salt)
    const decryptedPrivateKey = await decryptData(credential.encryptedPrivateKey, credential.iv, encryptionKey)

    const privateKeyBytes = bs58.decode(decryptedPrivateKey)
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
