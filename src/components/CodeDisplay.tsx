import { useEffect, useRef, useState } from 'react'
import { formatCode, type Digits } from '../lib/totp'

interface CodeDisplayProps {
  code: string | null
  digits: Digits
  secondsLeft: number
  progress: number
  isWarning: boolean
  isCritical: boolean
}

type CopyStatus = 'idle' | 'copied' | 'failed'

const RING_RADIUS = 24
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

function fallbackCopy(text: string): boolean {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.className = 'fixed left-0 top-0 h-px w-px opacity-0 pointer-events-none'
  textarea.setAttribute('readonly', '')
  document.body.appendChild(textarea)
  textarea.select()

  try {
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    document.body.removeChild(textarea)
  }
}

function CountdownRing({
  secondsLeft,
  progress,
  isWarning,
  isCritical,
  isIdle,
}: {
  secondsLeft: number
  progress: number
  isWarning: boolean
  isCritical: boolean
  isIdle: boolean
}) {
  const offset = isIdle
    ? RING_CIRCUMFERENCE
    : RING_CIRCUMFERENCE * (1 - progress)
  const ringColor = isIdle
    ? 'stroke-neutral-300 dark:stroke-neutral-700'
    : isCritical
      ? 'stroke-red-500 dark:stroke-red-400'
      : isWarning
        ? 'stroke-amber-500 dark:stroke-amber-400'
        : 'stroke-emerald-500 dark:stroke-emerald-400'
  const valueColor = isIdle
    ? 'text-neutral-400 dark:text-neutral-600'
    : isCritical
      ? 'text-red-600 dark:text-red-400'
      : isWarning
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-neutral-900 dark:text-neutral-100'

  return (
    <div className="relative size-14 shrink-0 sm:size-16" aria-hidden="true">
      <svg viewBox="0 0 56 56" className="size-full -rotate-90">
        <circle
          cx="28"
          cy="28"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="3"
          className="stroke-neutral-200 dark:stroke-neutral-800"
        />
        <circle
          cx="28"
          cy="28"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={offset}
          className={`transition-[stroke-dashoffset,stroke] duration-200 ease-linear motion-reduce:transition-none ${ringColor}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span
          className={`font-mono text-sm font-medium tabular-nums ${valueColor}`}
        >
          {isIdle ? '--' : secondsLeft}
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
          sec
        </span>
      </div>
    </div>
  )
}

export function CodeDisplay({
  code,
  digits,
  secondsLeft,
  progress,
  isWarning,
  isCritical,
}: CodeDisplayProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle')
  const resetTimer = useRef<number | null>(null)
  const isIdle = code === null
  const displayCode = code ?? '•'.repeat(digits)

  const statusColor = isIdle
    ? 'text-neutral-400 dark:text-neutral-500'
    : isCritical
      ? 'text-red-600 dark:text-red-400'
      : isWarning
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-neutral-500 dark:text-neutral-400'

  useEffect(
    () => () => {
      if (resetTimer.current !== null) {
        window.clearTimeout(resetTimer.current)
      }
    },
    [],
  )

  const showStatus = (status: CopyStatus) => {
    setCopyStatus(status)
    if (resetTimer.current !== null) {
      window.clearTimeout(resetTimer.current)
    }
    resetTimer.current = window.setTimeout(() => setCopyStatus('idle'), 1_800)
  }

  const copyCode = async () => {
    if (code === null) {
      return
    }

    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API unavailable')
      }
      await navigator.clipboard.writeText(code)
      showStatus('copied')
    } catch {
      showStatus(fallbackCopy(code) ? 'copied' : 'failed')
    }
  }

  return (
    <div className="border-t border-neutral-200 pt-6 dark:border-neutral-800">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
        Current code
      </p>

      <div className="mt-2 flex items-center justify-between gap-4">
        <div
          className="min-w-0"
          role="group"
          aria-label={
            code === null
              ? 'Current code unavailable'
              : `Current code ${code.split('').join(' ')}`
          }
        >
          <span
            className={`block whitespace-nowrap font-mono text-4xl font-medium leading-none tracking-[0.03em] tabular-nums sm:text-6xl ${
              isIdle
                ? 'text-neutral-300 dark:text-neutral-700'
                : 'text-neutral-900 dark:text-neutral-50'
            }`}
            aria-hidden="true"
          >
            {formatCode(displayCode)}
          </span>
          <span className="sr-only">
            {code === null ? 'No code generated yet.' : `Current code: ${code}`}
          </span>
        </div>

        <CountdownRing
          secondsLeft={secondsLeft}
          progress={progress}
          isWarning={isWarning}
          isCritical={isCritical}
          isIdle={isIdle}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-neutral-900 px-3.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300 dark:focus-visible:ring-neutral-100 dark:focus-visible:ring-offset-neutral-950"
          onClick={copyCode}
          disabled={isIdle}
        >
          {copyStatus === 'copied' ? (
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-4 fill-none stroke-current"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12.5l5 5L20 6.5" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-4 fill-none stroke-current"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="8" y="8" width="11" height="11" rx="2" />
              <path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" />
            </svg>
          )}
          {copyStatus === 'copied'
            ? 'Copied'
            : copyStatus === 'failed'
              ? 'Copy failed'
              : 'Copy code'}
        </button>

        <p
          className={`font-mono text-[10px] uppercase tracking-[0.08em] ${statusColor}`}
        >
          {isIdle ? 'Waiting for a secret' : `Refreshes in ${secondsLeft}s`}
        </p>
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        {copyStatus === 'copied'
          ? 'Code copied to clipboard.'
          : copyStatus === 'failed'
            ? 'Copy failed. Select the code and copy it manually.'
            : ''}
      </span>
    </div>
  )
}
