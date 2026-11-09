import {
  ALGORITHMS,
  DEFAULT_OPTIONS,
  DIGITS,
  PERIODS,
  type Algorithm,
  type Digits,
  type Period,
  type TotpOptions,
} from './totp'

export const OPTIONS_STORAGE_KEY = 'totp-generator:options'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isDigits = (value: unknown): value is Digits =>
  DIGITS.includes(value as Digits)

const isPeriod = (value: unknown): value is Period =>
  PERIODS.includes(value as Period)

const isAlgorithm = (value: unknown): value is Algorithm =>
  ALGORITHMS.includes(value as Algorithm)

export function parseStoredOptions(raw: string | null): TotpOptions {
  if (raw === null) {
    return DEFAULT_OPTIONS
  }

  try {
    const parsed: unknown = JSON.parse(raw)

    if (!isRecord(parsed)) {
      return DEFAULT_OPTIONS
    }

    return {
      digits: isDigits(parsed.digits) ? parsed.digits : DEFAULT_OPTIONS.digits,
      period: isPeriod(parsed.period) ? parsed.period : DEFAULT_OPTIONS.period,
      algorithm: isAlgorithm(parsed.algorithm)
        ? parsed.algorithm
        : DEFAULT_OPTIONS.algorithm,
    }
  } catch {
    return DEFAULT_OPTIONS
  }
}

export function loadStoredOptions(): TotpOptions {
  try {
    return parseStoredOptions(localStorage.getItem(OPTIONS_STORAGE_KEY))
  } catch {
    return DEFAULT_OPTIONS
  }
}

export function saveStoredOptions(options: TotpOptions): void {
  try {
    localStorage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(options))
  } catch {
    // Storage can be blocked in private browsing; options simply won't persist.
  }
}
