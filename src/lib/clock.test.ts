import { describe, expect, it } from 'vitest'
import * as OTPAuth from 'otpauth'
import { computeClock } from './clock'
import { DEFAULT_OPTIONS } from './totp'

const secret = OTPAuth.Secret.fromUTF8('12345678901234567890').base32

describe('computeClock', () => {
  it('returns an idle code without a secret but keeps the countdown', () => {
    const clock = computeClock(null, DEFAULT_OPTIONS, 59_000)

    expect(clock.code).toBeNull()
    expect(clock.nextCode).toBeNull()
    expect(clock.secondsLeft).toBe(1)
    expect(clock.progress).toBeCloseTo(1 / 30)
  })

  it('exposes the code for the next time step', () => {
    const before = computeClock(secret, DEFAULT_OPTIONS, 59_500)
    const after = computeClock(secret, DEFAULT_OPTIONS, 60_000)

    expect(before.nextCode).toBe(after.code)
    expect(before.nextCode).not.toBe(before.code)
    expect(after.nextCode).not.toBe(after.code)
  })

  it('rolls to the next code exactly at the 30-second boundary', () => {
    const before = computeClock(secret, DEFAULT_OPTIONS, 59_500)
    const after = computeClock(secret, DEFAULT_OPTIONS, 60_000)

    expect(before.secondsLeft).toBe(1)
    expect(before.isWarning).toBe(true)
    expect(before.isCritical).toBe(true)
    expect(after.code).not.toBe(before.code)
    expect(after.secondsLeft).toBe(30)
    expect(after.progress).toBe(1)
    expect(after.isWarning).toBe(false)
    expect(after.isCritical).toBe(false)
  })

  it('uses the configured 60-second period', () => {
    const clock = computeClock(secret, { ...DEFAULT_OPTIONS, period: 60 }, 59_500)

    expect(clock.secondsLeft).toBe(1)
    expect(clock.progress).toBeCloseTo(0.5 / 60)
  })
})
