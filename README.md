# Framework Or Pokemon

Is that name a programming framework or a Pokemon? Pick an answer, find out whether you were right, and try the next name.

The quiz tracks correct answers, wrong answers, and your percentage correct. Each question accepts one answer before showing **NEXT >>>**. Scores live in React component state and reset on refresh; there are no accounts or saved scores. Development and production select random questions, which can repeat. Testing mode uses a fixed fixture order.

Created by Owen Wexler.

## Stack

- Bun runtime and package manager, with ioredis for Redis access.
- TypeScript, React 19, TanStack Start, and TanStack Router with file-based routes.
- Vite and Nitro for development and server builds.
- Tailwind CSS 4 and custom UI components.
- Turso/libSQL in production and local SQLite in development, with Redis caching and no ORM.
- T3 Env and Zod for environment validation.
- TanStack Query with router SSR integration; the quiz currently uses route-loader data and React state.
- Playwright for browser tests; ESLint and Prettier for code checks.
- Docker deployment configured for Render.

## Local setup

Use Bun for the configured scripts and server runtime. The Dockerfile pins Bun `1.3.14`. For development, run a local Redis instance; question data lives in a local SQLite file.

```sh
bun install --frozen-lockfile
cp .env.example .env
```

The example environment is ready for development. Start local Redis at `redis://localhost:6379`, then initialize SQLite and start the app:

```sh
bun run db:setup
bun run dev
```

Open `http://localhost:3000`.

| Variable              | Purpose / local value                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `VITE_ENV`            | `development`, `testing`, or `production`; selects database and quiz behavior.                                     |
| `SQLITE_DATABASE_URL` | Local SQLite URL, defaults to `file:local.db` relative to the project root. Parent directories must already exist. |
| `REDIS_URL`           | Defaults to `redis://localhost:6379` outside production; explicitly required in production.                        |
| `TURSO_DATABASE_URL`  | Required only in production: a remote `libsql://` or `https://` Turso URL.                                         |
| `TURSO_AUTH_TOKEN`    | Required only in production.                                                                                       |
| `PORT`                | Use `3000` locally.                                                                                                |
| `NODE_VERSION`        | Still required by validation; the example supplies `24.5.1`. The app runs on Bun.                                  |
| `NITRO_PRESET`        | The example uses `bun`, matching the configured build preset.                                                      |

`bun run db:setup` creates the SQLite table and seeds it from `src/db/sql/inserts.sql` only when empty. Re-running it preserves existing questions. It refuses to run outside development and never connects to Turso or Redis. Local database files are excluded from Git and Docker builds. Existing `.env` files should set `VITE_ENV=development` and point `REDIS_URL` at local Redis.

Production databases must be provisioned separately using `src/db/sql/schema.sql` and, once, `src/db/sql/inserts.sql`. Running the seed SQL directly more than once adds duplicates.

Keep credentials in `.env` or your host's environment configuration. `VITE_ENV` is separate from Vite's build mode; never put secrets in `VITE_` variables.

## Commands

| Command                   | Purpose                                                                     |
| ------------------------- | --------------------------------------------------------------------------- |
| `bun run db:setup`        | Create and seed the local development SQLite database if empty.             |
| `bun run test:db`         | Test database selection, local setup, and production validation.            |
| `bun run dev`             | Start the development server on port 3000.                                  |
| `bun run generate-routes` | Regenerate the TanStack route tree.                                         |
| `bun run build`           | Build the application with Vite/Nitro.                                      |
| `bun run start`           | Run `.output/server/index.mjs` using Bun after building.                    |
| `bun run preview`         | Run Vite's preview command.                                                 |
| `bun run lint`            | Run ESLint.                                                                 |
| `bun run check`           | Check Prettier formatting; this is not a type check.                        |
| `bun run format`          | Format the entire repository and apply ESLint fixes.                        |
| `bunx tsc --noEmit`       | Check TypeScript using the installed compiler; no dedicated package script. |
| `bun run test:e2e:run`    | Run Playwright tests.                                                       |
| `bun run test:e2e:ui`     | Open Playwright's test UI.                                                  |
| `bun run test:report`     | Open the Playwright HTML report.                                            |
| `bun run test:codegen`    | Record browser interactions against localhost:3000.                         |

## Browser tests

Install Playwright's browsers after installing dependencies:

```sh
bunx playwright install
```

Start a development server in testing mode:

```sh
VITE_ENV=testing bun run dev
```

In another terminal:

```sh
bun run test:e2e:run
```

Playwright targets `http://localhost:3000` and runs Chromium, Firefox, and WebKit. Its automatic `webServer` setup is commented out, so start the server yourself. Restart any existing development server in testing mode before running the tests.

Testing mode returns `src/data/testData.json` before importing database clients, so browser tests do not connect to SQLite, Turso, or Redis. The non-production environment settings still require valid values; copying `.env.example` supplies them.

The tests cover static page elements and seven consecutive quiz rounds, including correct/incorrect feedback, scores, and percentages. They depend on fixture order, element IDs, button text, and specific colors. The ten-item fixture's end-of-list behavior is not covered; the current next-question indexing can exceed its bounds.

## Code layout and data flow

```text
src/
  routes/                  Root document and home route
  router.tsx               Router creation and Query SSR integration
  routeTree.gen.ts         Generated route tree; do not edit manually
  components/              Quiz state, scoreboard, and feedback
    style/                 Custom buttons, signs, scorecards, and spinner
  serverFunctions/         Server functions for questions and app mode
  db/                      SQLite/Turso client, models, Redis client, and SQL
  data/testData.json       Deterministic browser-test questions
  data/data.ts             Static source lists; not used by the live loader
  integrations/            TanStack Query context and devtools
  typedefs/                Question and database-row types
  helper/                  Formatting and quiz helpers
  env.ts                   Environment validation
  styles.css               Tailwind entry point
tests/                     Playwright specs and shared helpers
public/                    Logo, icons, and other static assets
```

The home route loader calls `getData()` and `getViteEnv()`, then passes their results to `Quiz`. The data server function dynamically imports the database models to keep database and Redis code out of the client bundle.

Development uses SQLite and local Redis; production uses Turso and the configured Redis service. Outside testing mode, `getAllItems()` checks Redis key `fop::data`, then queries `SELECT * FROM items` on a cache miss. Database rows are mapped to `{ id, name, type }` and cached for 216,000 seconds (60 hours). Redis reads are cache-first. Connection errors, command timeouts, and invalid cached data fall back to the database; failed cache writes still return database results. Redis connections and commands have one-second timeouts, with bounded per-command retries and background reconnection. Database errors still propagate. After changing database questions, invalidate that cache key in the relevant environment or wait for expiry. Editing `src/data/data.ts` does not update the live database.

## Production

```sh
bun run build
bun run start
```

Supply the required environment variables and use `VITE_ENV=production`. The start script uses `.output/server/index.mjs`; do not substitute the old `dist/server` path or a Node-only runtime.

`Dockerfile` installs from `bun.lock`, builds the app, exposes port 3000, and runs `bun run start`. `render.yml` declares a Docker web service deploying the `production` branch. Configure credentials, Redis access, and the remaining environment variables on the host; the Render file does not provision databases or declare those values. `.dockerignore` excludes local environment files, SQLite databases, and build artifacts from the image context.
