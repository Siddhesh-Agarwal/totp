import { useEffect, useState } from 'react'
import { AdvancedOptions } from './components/AdvancedOptions'
import { CodeDisplay } from './components/CodeDisplay'
import { SecretInput } from './components/SecretInput'
import { useTotpClock } from './hooks/useTotpClock'
import { loadStoredOptions, saveStoredOptions } from './lib/preferences'
import { normalizeSecret, type TotpOptions } from './lib/totp'

function App() {
  const [secretInput, setSecretInput] = useState('')
  const [options, setOptions] = useState<TotpOptions>(loadStoredOptions)
  const secret = normalizeSecret(secretInput)
  const clock = useTotpClock(secret.normalized, options)

  useEffect(() => {
    saveStoredOptions(options)
  }, [options])

  return (
    <div className="min-h-svh bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto flex min-h-svh w-full max-w-xl flex-col px-5 py-6 sm:px-6 sm:py-10">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-5 dark:border-neutral-800">
          <h1 className="font-mono text-sm font-semibold uppercase tracking-[0.18em]">
            TOTP Generator
          </h1>
          <a
            href="https://github.com/Siddhesh-Agarwal/totp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View the source on GitHub"
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-100 dark:focus-visible:ring-neutral-100"
          >
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="size-3.5 fill-current"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </a>
        </header>

        <main className="flex-1 py-10 sm:py-14">
          <p className="max-w-md text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            Paste a Base32 setup key. The current code refreshes on its own.
          </p>

          <section aria-label="TOTP generator" className="mt-8 space-y-8">
            <SecretInput
              value={secretInput}
              onChange={setSecretInput}
              error={secret.error}
            />

            {secretInput !== "" && (
              <CodeDisplay
                code={clock.code}
                nextCode={clock.nextCode}
                digits={options.digits}
                secondsLeft={clock.secondsLeft}
                progress={clock.progress}
                isWarning={clock.isWarning}
                isCritical={clock.isCritical}
              />
            )}

            <AdvancedOptions options={options} onChange={setOptions} />
          </section>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 pt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-400 dark:border-neutral-800 dark:text-neutral-500">
          <p>RFC 6238</p>
          <p>Secrets stay in this tab</p>
        </footer>
      </div>
    </div>
  )
}

export default App
