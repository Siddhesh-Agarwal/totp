import { useId } from "react";
import {
  ALGORITHMS,
  type Algorithm,
  DEFAULT_OPTIONS,
  DIGITS,
  PERIODS,
  type TotpOptions,
} from "../lib/totp";

const ALGORITHM_LABELS: Record<Algorithm, string> = {
  SHA1: "SHA-1",
  SHA256: "SHA-256",
  SHA512: "SHA-512",
};

interface AdvancedOptionsProps {
  options: TotpOptions;
  onChange: (options: TotpOptions) => void;
}

export function AdvancedOptions({ options, onChange }: AdvancedOptionsProps) {
  const groupPrefix = useId();

  const update = <Key extends keyof TotpOptions>(
    key: Key,
    value: TotpOptions[Key],
  ) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <details className="group border-t border-neutral-200 pt-4 dark:border-neutral-800">
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-2 gap-y-1 rounded-sm py-2 text-sm font-medium text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:text-neutral-300 dark:focus-visible:ring-neutral-100 [&::-webkit-details-marker]:hidden">
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="size-4 shrink-0 fill-none stroke-current text-neutral-400 transition-transform group-open:rotate-180 dark:text-neutral-500"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
        <span>Advanced options</span>
        <span className="ml-auto whitespace-nowrap font-mono text-[10px] font-normal tracking-[0.04em] text-neutral-400 dark:text-neutral-500">
          {options.digits} digits · {options.period}s ·{" "}
          {ALGORITHM_LABELS[options.algorithm]}
        </span>
      </summary>

      <div className="pt-4">
        <div className="grid gap-5 sm:grid-cols-2">
          <fieldset className="min-w-0">
            <legend className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              Digits
            </legend>
            <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-900">
              {DIGITS.map((digits) => (
                <label key={digits} className="relative flex-1">
                  <input
                    type="radio"
                    name={`${groupPrefix}-digits`}
                    value={digits}
                    checked={options.digits === digits}
                    onChange={() => update("digits", digits)}
                    className="peer sr-only"
                  />
                  <span className="flex min-h-11 cursor-pointer items-center justify-center rounded-md px-2 font-mono text-xs text-neutral-600 transition-colors peer-checked:bg-white peer-checked:text-neutral-900 peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-neutral-900 dark:text-neutral-400 dark:peer-checked:bg-neutral-800 dark:peer-checked:text-neutral-100 dark:peer-focus-visible:ring-neutral-100">
                    {digits}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              Time interval
            </legend>
            <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-900">
              {PERIODS.map((period) => (
                <label key={period} className="relative flex-1">
                  <input
                    type="radio"
                    name={`${groupPrefix}-period`}
                    value={period}
                    checked={options.period === period}
                    onChange={() => update("period", period)}
                    className="peer sr-only"
                  />
                  <span className="flex min-h-11 cursor-pointer items-center justify-center rounded-md px-2 font-mono text-xs text-neutral-600 transition-colors peer-checked:bg-white peer-checked:text-neutral-900 peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-neutral-900 dark:text-neutral-400 dark:peer-checked:bg-neutral-800 dark:peer-checked:text-neutral-100 dark:peer-focus-visible:ring-neutral-100">
                    {period} sec
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="min-w-0 sm:col-span-2">
            <legend className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
              Algorithm
            </legend>
            <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-900">
              {ALGORITHMS.map((algorithm) => (
                <label key={algorithm} className="relative flex-1">
                  <input
                    type="radio"
                    name={`${groupPrefix}-algorithm`}
                    value={algorithm}
                    checked={options.algorithm === algorithm}
                    onChange={() => update("algorithm", algorithm)}
                    className="peer sr-only"
                  />
                  <span className="flex min-h-11 cursor-pointer items-center justify-center rounded-md px-2 font-mono text-xs text-neutral-600 transition-colors peer-checked:bg-white peer-checked:text-neutral-900 peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-neutral-900 dark:text-neutral-400 dark:peer-checked:bg-neutral-800 dark:peer-checked:text-neutral-100 dark:peer-focus-visible:ring-neutral-100">
                    {ALGORITHM_LABELS[algorithm]}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-neutral-200 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
          <p className="max-w-md text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            Most services use the defaults. Change these only if your service
            specifies different values.
          </p>
          <button
            type="button"
            className="inline-flex min-h-11 shrink-0 items-center self-start whitespace-nowrap text-xs font-medium text-neutral-500 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 sm:self-auto dark:text-neutral-400 dark:decoration-neutral-700 dark:hover:text-neutral-100 dark:focus-visible:ring-neutral-100"
            onClick={() => onChange(DEFAULT_OPTIONS)}
          >
            Reset to defaults
          </button>
        </div>
      </div>
    </details>
  );
}
