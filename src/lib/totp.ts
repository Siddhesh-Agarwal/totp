import * as OTPAuth from 'otpauth'

export const DIGITS = [6, 7, 8] as const
export type Digits = (typeof DIGITS)[number]

export const PERIODS = [30, 60] as const
export type Period = (typeof PERIODS)[number]

export const ALGORITHMS = ['SHA1', 'SHA256', 'SHA512'] as const
export type Algorithm = (typeof ALGORITHMS)[number]

export interface TotpOptions {
  digits: Digits
  period: Period
  algorithm: Algorithm
}

export const DEFAULT_OPTIONS: TotpOptions = {
  digits: 6,
  period: 30,
  algorithm: 'SHA1',
}

export interface NormalizedSecret {
  normalized: string | null
  error: string | null
}

const BASE32_INPUT = /^[A-Za-z2-7]+$/

export function normalizeSecret(raw: string): NormalizedSecret {
  const compact = raw.replace(/[\s-]/g, '').replace(/=+$/, '')

  if (compact.length === 0) {
    return { normalized: null, error: null }
  }

  if (!BASE32_INPUT.test(compact)) {
    return {
      normalized: null,
      error: 'Use only Base32 characters: letters A–Z and digits 2–7.',
    }
  }

  const normalized = compact.toUpperCase()

  try {
    OTPAuth.Secret.fromBase32(normalized)
  } catch {
    return {
      normalized: null,
      error: 'That secret is not valid Base32. Check it and try again.',
    }
  }

  return { normalized, error: null }
}

export function generateCode(
  secret: string,
  options: TotpOptions,
  timestamp: number = Date.now(),
): string {
  const totp = new OTPAuth.TOTP({
    secret,
    digits: options.digits,
    period: options.period,
    algorithm: options.algorithm,
  })

  return totp.generate({ timestamp })
}

export function getCounter(timestamp: number, period: number): number {
  return Math.floor(timestamp / 1000 / period)
}

export function getRemainingMs(timestamp: number, period: number): number {
  return (getCounter(timestamp, period) + 1) * period * 1000 - timestamp
}

export function formatCode(code: string): string {
  const midpoint = Math.floor(code.length / 2)
  return `${code.slice(0, midpoint)} ${code.slice(midpoint)}`
}
