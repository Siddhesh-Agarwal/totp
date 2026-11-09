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
          <a href="https://github.com/Siddhesh-Agarwal/totp" target="_blank" rel="noopener noreferrer">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              <span
                className="size-1.5 rounded-full bg-emerald-500"
                aria-hidden="true"
              />
              GitHub
            </span>
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
