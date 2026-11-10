import { generateCode, getCounter, getRemainingMs, type TotpOptions } from './totp'

export interface ClockState {
  code: string | null
  nextCode: string | null
  secondsLeft: number
  progress: number
  isWarning: boolean
  isCritical: boolean
}

export function computeClock(
  secret: string | null,
  options: TotpOptions,
  timestamp: number,
): ClockState {
  const remainingMs = getRemainingMs(timestamp, options.period)
  const secondsLeft = Math.ceil(remainingMs / 1000)
  const counter = getCounter(timestamp, options.period)

  return {
    code: secret
      ? generateCode(secret, options, counter * options.period * 1000)
      : null,
    nextCode: secret
      ? generateCode(secret, options, (counter + 1) * options.period * 1000)
      : null,
    secondsLeft,
    progress: remainingMs / (options.period * 1000),
    isWarning: secondsLeft <= 10,
    isCritical: secondsLeft <= 5,
  }
}
