import { useId, useRef, useState } from 'react'

interface SecretInputProps {
  value: string
  onChange: (value: string) => void
  error: string | null
}

const iconButtonClasses =
  'grid size-11 shrink-0 place-items-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 dark:focus-visible:ring-neutral-100'

export function SecretInput({ value, onChange, error }: SecretInputProps) {
  const inputId = useId()
  const descriptionId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label
          htmlFor={inputId}
          className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400"
        >
          Secret key
        </label>
        <span className="hidden font-mono text-[10px] tracking-[0.04em] text-neutral-400 sm:inline dark:text-neutral-500">
          Base32
        </span>
      </div>

      <div
        className={`mt-2 flex items-center gap-1 rounded-lg border bg-white px-2 py-1 transition focus-within:ring-2 dark:bg-neutral-900 ${
          error
            ? 'border-red-500 focus-within:ring-red-500/10 dark:border-red-500'
            : 'border-neutral-300 focus-within:border-neutral-900 focus-within:ring-neutral-900/10 dark:border-neutral-700 dark:focus-within:border-neutral-100 dark:focus-within:ring-neutral-100/10'
        }`}
      >
        <input
          ref={inputRef}
          id={inputId}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="JBSWY3DPEHPK3PXP"
          autoComplete="off"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={descriptionId}
          className="min-w-0 flex-1 bg-transparent px-2 py-2.5 font-mono text-sm tracking-[0.06em] text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-600"
        />

        {value.length > 0 && (
          <button
            type="button"
            className={iconButtonClasses}
            onClick={() => {
              onChange('')
              inputRef.current?.focus()
            }}
            aria-label="Clear secret key"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-4 fill-none stroke-current"
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}

        <button
          type="button"
          className={iconButtonClasses}
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide secret key' : 'Show secret key'}
          aria-pressed={visible}
        >
          {visible ? (
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-4 fill-none stroke-current"
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3l18 18M10.6 10.7a2 2 0 002.8 2.8M9.9 5.2A10.8 10.8 0 0112 5c5.5 0 9 7 9 7a16.4 16.4 0 01-3 3.9M6.5 6.7C4.1 8.4 3 12 3 12s3.5 7 9 7a9.7 9.7 0 004.2-1" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-4 fill-none stroke-current"
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z" />
              <circle cx="12" cy="12" r="2.6" />
            </svg>
          )}
        </button>
      </div>

      <p
        id={descriptionId}
        className={`mt-2 text-xs ${
          error
            ? 'text-red-600 dark:text-red-400'
            : 'text-neutral-500 dark:text-neutral-400'
        }`}
        role={error ? 'alert' : undefined}
      >
        {error ?? 'Use the setup key from your provider’s two-factor settings.'}
      </p>
    </div>
  )
}
