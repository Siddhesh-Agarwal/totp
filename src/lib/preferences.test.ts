import { afterEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_OPTIONS } from './totp'
import {
  OPTIONS_STORAGE_KEY,
  loadStoredOptions,
  parseStoredOptions,
  saveStoredOptions,
} from './preferences'

const createStorage = () => {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value)
    },
    removeItem: (key: string) => {
      values.delete(key)
    },
    clear: () => values.clear(),
    key: (index: number) => [...values.keys()][index] ?? null,
    get length() {
      return values.size
    },
  } satisfies Storage
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('parseStoredOptions', () => {
  it('returns defaults for missing or malformed values', () => {
    expect(parseStoredOptions(null)).toEqual(DEFAULT_OPTIONS)
    expect(parseStoredOptions('not json')).toEqual(DEFAULT_OPTIONS)
    expect(parseStoredOptions('[]')).toEqual(DEFAULT_OPTIONS)
  })

  it('restores a valid saved option set', () => {
    expect(
      parseStoredOptions(JSON.stringify({ digits: 8, period: 60, algorithm: 'SHA512' })),
    ).toEqual({ digits: 8, period: 60, algorithm: 'SHA512' })
  })

  it('falls back per field for out-of-range values', () => {
    expect(
      parseStoredOptions(JSON.stringify({ digits: 5, period: 15, algorithm: 'MD5' })),
    ).toEqual(DEFAULT_OPTIONS)
    expect(
      parseStoredOptions(JSON.stringify({ digits: 7, period: 15, algorithm: 'SHA256' })),
    ).toEqual({ digits: 7, period: 30, algorithm: 'SHA256' })
  })
})

describe('localStorage access', () => {
  it('round-trips options through storage', () => {
    vi.stubGlobal('localStorage', createStorage())

    saveStoredOptions({ digits: 7, period: 60, algorithm: 'SHA256' })

    expect(localStorage.getItem(OPTIONS_STORAGE_KEY)).toContain('SHA256')
    expect(loadStoredOptions()).toEqual({ digits: 7, period: 60, algorithm: 'SHA256' })
  })

  it('returns defaults instead of throwing when storage is unavailable', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
    })

    expect(loadStoredOptions()).toEqual(DEFAULT_OPTIONS)
    expect(() => saveStoredOptions(DEFAULT_OPTIONS)).not.toThrow()
  })
})
