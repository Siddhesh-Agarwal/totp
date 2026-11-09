# TOTP Generator

A browser-only time-based one-time password (TOTP) generator, deployed at
[totp.siddhesh.cc](https://totp.siddhesh.cc/).

Paste a Base32 setup key and the current RFC 6238 code appears immediately. The
code refreshes on its own with a visible countdown. Advanced options cover 6, 7,
or 8 digits, 30- or 60-second intervals, and SHA-1, SHA-256, or SHA-512.

Secrets are processed entirely in the browser. They are never sent to a server,
logged, placed in the URL, or saved to storage. Only the advanced display
preferences are persisted in `localStorage`.

## Development

```sh
pnpm install
pnpm dev
```

## Checks

```sh
pnpm test    # RFC 6238 vectors, normalization, time math, preferences
pnpm lint
pnpm build
```

The production build is written to `dist/`.

## Deployment

Cloudflare Pages settings:

- Build command: `pnpm build`
- Build output directory: `dist`
- Custom domain: `totp.siddhesh.cc`

`public/_headers` contains the production security headers (CSP, HSTS, referrer
policy, permissions policy, and asset caching) and is copied into the build
output automatically.

## Structure

- `src/lib/totp.ts` — Base32 normalization, TOTP generation, time math
- `src/lib/clock.ts` — pure countdown/code state calculation
- `src/lib/preferences.ts` — display-option persistence
- `src/hooks/useTotpClock.ts` — 250 ms clock with visibility handling
- `src/components/` — secret input, code display and countdown ring, advanced
  options
- `src/index.css` — Tailwind CSS v4 entry point; component styling lives in the
  JSX as utility classes
