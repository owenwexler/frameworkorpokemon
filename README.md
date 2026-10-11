# Framework Or Pokemon

Is that name a programming framework or a Pokemon? Pick an answer, find out whether you were right, and try the next name.

The quiz tracks correct answers, wrong answers, and your percentage correct. Each question accepts one answer before showing **NEXT >>>**. Scores live in React component state and reset on refresh; there are no accounts or saved scores. Development and production select random questions, which can repeat. Testing mode uses a fixed fixture order.

Created by Owen Wexler.

## Stack

- Bun runtime and package manager, including its built-in Redis client.
- TypeScript, React 19, TanStack Start, and TanStack Router with file-based routes.
- Vite and Nitro for development and server builds.
- Tailwind CSS 4 and custom UI components.
- Turso/libSQL for questions, with Redis caching and no ORM.
- T3 Env and Zod for environment validation.
- TanStack Query with router SSR integration; the quiz currently uses route-loader data and React state.
- Playwright for browser tests; ESLint and Prettier for code checks.
- Docker deployment configured for Render.

## Local setup

Use Bun; Node alone cannot run the current database layer because it uses `Bun.RedisClient`. The Dockerfile pins Bun `1.3.14`. For normal development, you also need a Turso database and a reachable Redis instance.

```sh
bun install --frozen-lockfile
cp .env.example .env
```

Edit `.env` before starting the app. Every variable below is required by `src/env.ts`, including in testing mode. The example file contains placeholders: replace `development | testing | production` with one value.

| Variable | Purpose / local value |
| --- | --- |
| `TURSO_DATABASE_URL` | Your database URL, such as `libsql://your-database.turso.io`. |
| `TURSO_AUTH_TOKEN` | Authentication token for that database. |
| `REDIS_URL` | Redis connection URL, such as `redis://localhost:6379`. |
| `PORT` | Use `3000` locally; the development script also explicitly selects port 3000. |
| `VITE_ENV` | `development`, `testing`, or `production`; controls quiz data and question selection. |
| `NODE_VERSION` | Still required by validation; `.env.example` supplies `24.5.1`, although the app runs on Bun. |
| `NITRO_PRESET` | Use `bun` for a local Bun build or `render_com` for the configured Render target. See `src/env.ts` for accepted values. |

Keep credentials in `.env` or your host's environment configuration. `.env` is ignored by Git. `VITE_ENV` is an application setting, separate from Vite's build mode; never put secrets in `VITE_` variables.

### Prepare the question database

Run this table definition against your selected Turso database, then execute `src/db/sql/inserts.sql` once to seed it:

```sql
CREATE TABLE IF NOT EXISTS items (
  item_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  item_name TEXT,
  item_type TEXT
);
```

The checked-in `src/db/sql/schema.sql` also contains `CREATE DATABASE` and `USE` statements, which are not SQLite/libSQL syntax. Use only its `CREATE TABLE` statement as shown above. There is no migration or seed package script. Re-running the inserts adds duplicate rows.

Start Redis, then start the app:

```sh
bun run dev
```

Open `http://localhost:3000`.

## Commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the development server on port 3000. |
| `bun run generate-routes` | Regenerate the TanStack route tree. |
| `bun run build` | Build the application with Vite/Nitro. |
| `bun run start` | Run `.output/server/index.mjs` using Bun after building. |
| `bun run preview` | Run Vite's preview command. |
| `bun run lint` | Run ESLint. |
| `bun run check` | Check Prettier formatting; this is not a type check. |
| `bun run format` | Format the entire repository and apply ESLint fixes. |
| `bunx tsc --noEmit` | Check TypeScript using the installed compiler; no dedicated package script. |
| `bun run test:e2e:run` | Run Playwright tests. |
| `bun run test:e2e:ui` | Open Playwright's test UI. |
| `bun run test:report` | Open the Playwright HTML report. |
| `bun run test:codegen` | Record browser interactions against localhost:3000. |

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

Testing mode returns `src/data/testData.json` instead of querying the question database. It still imports the database models first, initializing the Turso and Bun Redis clients, so it still requires Bun and valid environment configuration. It is not a fully isolated offline mode, and there is no `dev:offline` script.

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
  db/                      Turso client, models, Redis client, and SQL
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

The home route loader calls `getData()` and `getViteEnv()`, then passes their results to `Quiz`. The data server function dynamically imports the database models to keep Bun-specific code out of the client bundle.

Outside testing mode, `getAllItems()` checks Redis key `fop::data`, then queries `SELECT * FROM items` on a cache miss. Database rows are mapped to `{ id, name, type }` and cached for 216,000 seconds (60 hours). Redis errors are rethrown; there is no database fallback on a Redis failure. After changing database questions, invalidate that cache key in the relevant environment or wait for expiry. Editing `src/data/data.ts` does not update the live database.

## Production

```sh
bun run build
bun run start
```

Supply the required environment variables and use `VITE_ENV=production`. The start script uses `.output/server/index.mjs`; do not substitute the old `dist/server` path or a Node-only runtime.

`Dockerfile` installs from `bun.lock`, builds the app, exposes port 3000, and runs `bun run start`. `render.yml` declares a Docker web service deploying the `production` branch. Configure credentials, Redis access, and the remaining environment variables on the host; the Render file does not provision databases or declare those values. There is currently no `.dockerignore`, so exclude local `.env` files and other private files from the Docker build context before building an image.
