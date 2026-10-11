# Dependency maintenance

Use Bun **1.3.14**, pinned in `package.json` and `Dockerfile`. Keep
`@types/bun` at **1.3.14** so types match the deployed runtime.

Install reproducibly with `bun install --frozen-lockfile`. After upgrading,
run `bun audit` against the entire lockfile, including development tooling.
An audit reports known advisories; it cannot guarantee the absence of all
security vulnerabilities.

## Compatibility choices

- `@typescript/native` aliases the latest TypeScript 7 compiler, providing
  `tsc`. `typescript` aliases Microsoft's TypeScript 6 compatibility package
  because typescript-eslint still needs its compiler API. This follows
  [Microsoft's side-by-side setup](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0).
  Preserve the `npm:` aliases when updating with Bun 1.3.
- Nitro retains the project's `nitro-nightly` release channel and Bun preset.
- `postcss-selector-parser` is overridden to `^7.1.6` because
  `@tailwindcss/typography@0.5.20` pins vulnerable `6.0.10`.
  Remove the override once Typography requires a patched parser.

## Updating

`bun update --latest --force` on Bun 1.3.14 can retain older nested packages.
If the audit still flags them, inspect their parents and version constraints.
Regenerate `bun.lock` from `package.json` when necessary, retaining the old
lockfile in version control for review. Use overrides only where an upstream
constraint prevents a patched resolution, and verify compatibility.

Validate with `bun run lint`, `bunx tsc --noEmit`, `bun run build`, and the
Playwright suite against the testing-mode server. Run `bun audit` again and
confirm `bun install --frozen-lockfile` leaves the lockfile unchanged.
