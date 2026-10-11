# Agent guidance

## Scope and reuse

This file applies throughout this repository. The TanStack Start conventions below are reusable; when adapting this file to another app, verify its package scripts, runtime, paths, adapter, and testing setup, then replace the project-specific section. Treat checked-in code and configuration as the source of truth for installed behavior.

## TanStack Start conventions

### Inspect before changing

- Read `package.json`, the lockfile, `vite.config.ts`, `tsconfig.json`, and relevant routes before choosing commands or patterns.
- Use the repository's package manager and preserve its lockfile. Do not switch runtimes or upgrade dependencies as a side effect of another task.
- Keep changes focused. Avoid repository-wide formatting or unrelated fixes.

### Routing and rendering

- Define file-based routes in `src/routes/` using the existing `createFileRoute` pattern. Use TanStack Router `Link` for internal navigation.
- Keep the root document, metadata, stylesheet links, `HeadContent`, and `Scripts` in `src/routes/__root.tsx`.
- Use route loaders for data needed before rendering and consume results through `Route.useLoaderData()`.
- Treat `src/routeTree.gen.ts` as generated output. Regenerate it through the configured tooling when routes change; do not hand-edit it.
- Preserve router context and SSR integration in `src/router.tsx`. Keep Query clients scoped to router creation rather than introducing a shared server singleton.
- Keep render paths safe for SSR. Access browser-only APIs in effects or otherwise guard them, and avoid server/client initial-render differences.
- Follow React's hook rules: call hooks unconditionally and represent mutable component state with hooks rather than render-local variables.

### Server boundaries and environment

- Put privileged operations behind `createServerFn` or the app's established server handlers. Validate untrusted inputs before using them.
- Keep database clients, runtime-specific modules, and secrets out of browser code. Preserve server-only import boundaries; do not move server dependencies to client-reachable module scope for convenience.
- Return only the data a client needs, using serializable values. Never return environment objects or credentials.
- Update the environment schema and `.env.example` together when configuration changes. Do not commit secrets or expose them through client environment prefixes.
- Do not assume that changing a Nitro preset makes runtime-specific dependencies portable. Check the adapter, runtime, build output, and start command together.
- Preserve the configured Vite plugin ordering and runtime externalization unless the task requires changing them.

### TypeScript and UI

- Respect strict TypeScript settings. Prefer explicit domain types, type-only imports, and existing aliases over new `any` casts or suppression comments.
- Reuse existing components and styling conventions. Preserve semantic controls, accessible names, and responsive behavior.
- Handle loading, failures, and empty data at the appropriate route or component boundary. A loader failure occurs before its page component renders.
- Match the checked-in formatter and lint configuration. Format changed files rather than rewriting unrelated code.

### Validation and handoff

- Run checks appropriate to the change using the repository's actual scripts. Formatting checks, linting, type checks, builds, and browser tests serve different purposes.
- For route or server-boundary changes, include a production build when the environment permits. For user-visible behavior changes, exercise the relevant browser tests.
- Add or update tests for changed behavior; do not add tests that merely restate an implementation or require unrelated infrastructure.
- Report what changed, which checks ran, and any failures or missing prerequisites. Distinguish existing failures from regressions; do not claim an unrun check passed.
- Avoid changing generated reports, build artifacts, credentials, or unrelated files. Review the final diff.

## Framework Or Pokemon specifics

### Tools and commands

- Use Bun and `bun.lock`. Install with `bun install --frozen-lockfile`. The Dockerfile currently pins Bun `1.3.14`.
- Development: `bun run dev` on port 3000.
- Routes: `bun run generate-routes`.
- Build and serve: `bun run build`, then `bun run start` (Bun executes `.output/server/index.mjs`).
- Lint: `bun run lint`. Formatting check: `bun run check`. Type check: `bunx tsc --noEmit`.
- `bun run format` rewrites the whole repository and runs ESLint fixes; avoid it for narrowly scoped changes. Prettier specifies no semicolons, single quotes, and trailing commas.
- Browser tests: `bun run test:e2e:run`; interactive mode: `bun run test:e2e:ui`; report: `bun run test:report`.
- There is no configured unit-test script, `dev:offline` script, migration script, or CI workflow.
- Both `#/*` and `@/*` resolve to `src/*` in TypeScript. Prefer the commonly used `#/` alias for new cross-directory imports.

### Architecture and behavior

- `src/routes/index.tsx` loads questions and app mode through `src/serverFunctions/serverFunctions.ts`.
- Keep the dynamic import of `../db/models` inside the server handler: it prevents Bun Redis code from entering the browser bundle.
- `src/components/Quiz.tsx` owns question selection, answer state, and scores using React state. There is no Jotai store or score persistence.
- Preserve one scored answer per question, correct/wrong feedback, and next-question navigation. Percentage correct is displayed after the first answer with two decimal places.
- `src/components/style/` contains the custom UI primitives. Keep Tailwind CSS and the existing component approach unless the task explicitly changes them.
- TanStack Query's SSR integration is present, but the home page currently uses route-loader data directly. Do not add a second fetching or state layer without a concrete need.

### Data and configuration

- `src/env.ts` validates all required variables listed in `.env.example`, even in testing mode. `VITE_ENV` accepts exactly `development`, `testing`, or `production`.
- Normal question data comes from Turso/libSQL via `src/db/models.ts`. Redis is implemented with `Bun.RedisClient` and requires the Bun runtime.
- Redis key `fop::data` caches mapped questions for 60 hours. Redis failures propagate rather than falling back to Turso. Consider cache invalidation when changing question data or its shape.
- Stored rows use `item_id`, `item_name`, and `item_type`; UI items use `id`, `name`, and `type`. Quiz categories are `framework` and `pokemon`, although the current type declarations use `string`.
- SQL seed data lives in `src/db/sql/inserts.sql`. The `CREATE DATABASE` and `USE` lines in `schema.sql` are incompatible with SQLite/libSQL; use its table definition only. Seeds are not idempotent.
- `src/data/data.ts` is not wired into the live loader and contains a stale helper import. Do not assume changing those lists seeds or updates the database.
- Never run seeds or invalidate shared caches merely to validate a code change.

### Browser test contract and known limits

- Start the app separately with `VITE_ENV=testing bun run dev`; Playwright's `webServer` configuration is disabled. Its base URL is `http://localhost:3000`.
- Install browsers with `bunx playwright install` when needed. Projects cover Chromium, Firefox, and WebKit.
- Testing uses `src/data/testData.json` in a fixed order. Models are imported before fixture selection, so clients still initialize; do not describe testing as infrastructure-free.
- The core spec plays seven rounds in one page session because refreshing resets scores. Preserve fixture order unless updating the tests deliberately.
- Shared helpers in `tests/globalTestFunctions/globalTestFunctions.ts` assert IDs, visible text, colors, scores, and percentages. Update those assertions alongside intentional UI changes.
- Current random selection does not reliably prevent repeats, and testing-mode next-question indexing can run beyond the ten-item fixture. Do not promise exhaustive unique rounds or safe fixture wraparound; address these separately when in scope.
- The home route passes fixed `false` loading/error props to `Quiz`. Do not assume its spinner/error branches handle route-loader failures.

### Deployment

- `render.yml` targets Docker on the `production` branch. `Dockerfile` builds and starts the app with Bun.
- Preserve the `.output/server/index.mjs` start path and the Bun runtime requirement.
- Environment values and backing services must be supplied separately from `render.yml`. There is no `.dockerignore`; ensure private local files are excluded from image build contexts.
