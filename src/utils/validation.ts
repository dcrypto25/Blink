/**
 * Validation utilities for security
 */

import { PublicKey } from '@solana/web3.js'

/**
 * Validate if a string is a valid Solana address
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address)
    return true
  } catch {
    return false
  }
}

/**
 * Sanitize username input to prevent XSS
 */
export function sanitizeUsername(username: string): string {
  return username
    .trim()
    .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
    .slice(0, 32) // Limit length
}

/**
 * Validate transaction amount
 */
export function isValidAmount(amount: string | number, maxDecimals: number = 9): boolean {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(num) || num <= 0) {
    return false
  }

  // Check decimal places
  const amountStr = typeof amount === 'string' ? amount : amount.toString()
  const decimalPart = amountStr.split('.')[1]
  if (decimalPart && decimalPart.length > maxDecimals) {
    return false
  }

  return true
}

/**
 * Validate slippage tolerance (should be between 0.01% and 50%)
 */
export function isValidSlippage(slippage: number): boolean {
  return slippage >= 0.01 && slippage <= 50
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private lastCall: number = 0
  private minInterval: number

  constructor(minIntervalMs: number) {
    this.minInterval = minIntervalMs
  }

  canProceed(): boolean {
    const now = Date.now()
    if (now - this.lastCall < this.minInterval) {
      return false
    }
    this.lastCall = now
    return true
  }

  reset(): void {
    this.lastCall = 0
  }
}
