# What is Framework Or Pokemon?
Is that name you're looking at the name of a computer programming framework or a Pokemon?  That question is a meme and I made a quiz app out of it.

## Current Tech Stack
* Language: [TypeScript](https://typescriptlang.org)
* Runtime: [Bun](https://bun.sh)
* Framework: [Tanstack Start](https://tanstack.com/start/latest) 
* CSS Library: [Tailwind](https://tailwindcss.com/)
* UI Library: none, all buttons and inputs are custom 
* Database: [Turso](https://turso.tech)
* ORM: none
* Cache: [REDIS](https://redis.io/) for caching quiz data
* Error-handling library: none
* Logging: none
* Environment Variable Validation: [T3-Env](http://env.t3.gg/)
* Linting: [ESLint](http://eslint.org)
* Client state management: [Jotai](https://jotai.org/)
* CI: none
* Deployment target: [Render.com](https://render.com)

## Setup 
1.  Make sure you have [Bun](https://bun.sh/) and [REDIS](https://redis.io/lp/get-started2) installed locally.  In some Linux distributions, REDIS is replaced by Valkey under the hood - this shouldn't cause any problems in development.  Please submit an issue if it does.
2.  Make sure you have a Turso account and API key.  Create a database for Framework or Pokemon.  
3.  Create a ```.env``` file and set up all environment variables according to the ```.env.example``` file.  Fill in your Turso API key.  Leave the REDIS_URL variable blank ('') for local REDIS in development.  SRW_ENV is necessary to determine whether the environment is development or production in client components.  Set DEV_MODE to "offline" before running the tests.   
4.  Install all dependencies by typing ```npm install```.  
5.  Run the development server in offline mode by typing ```npm run dev:offline```.
6.  Run the tests in UI mode by typing ```npm run test:e2e:ui``` or in CLI mode by typing ```npm run test:e2e:run```.  Make sure they all pass.

## Tests
Framework Or Pokemon uses [Playwright](https://playwright.dev/) as its testing framework.  Before running the tests, the app must be set to "testing" mode (found in environment variables) which puts the quiz questions in a static order for predictable testing responses.

## Bun
As of July 2026, Bun replaces Node as the runtime.

## Tanstack Start
As of June 2026, uses Tanstack Start as its framework.  From July 2024-June 2026, Framework Or Pokemon used Astro and Preact, but has now migrated fully to Tanstack Start.  All evergreen Tanstack Start details are included below.

Welcome to your new TanStack Start app! 

# Getting Started

To run this application:

```bash
bun install
bun run dev
```

# Building For Production

To build this application for production:

```bash
bun run build
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

### Removing Tailwind CSS
# DO NOT REMOVE TAILWIND CSS FROM THIS PROJECT
If you prefer not to use Tailwind CSS:

1. Remove the demo pages in `src/routes/demo/`
2. Replace the Tailwind import in `src/styles.css` with your own styles
3. Remove `tailwindcss()` from the plugins array in `vite.config.ts`
4. Uninstall the packages: `npm install @tailwindcss/vite tailwindcss -D`

## Linting & Formatting


This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
npm run lint
npm run format
npm run check
```


## Deploy with Nitro

This project uses Nitro as a generic server adapter, so it can run on any Node-compatible host.

```bash
npm run build
node dist/server/index.mjs
```

The build output is a self-contained Node server. To deploy, push the `dist/` directory to your host (Render, Fly.io, your own VPS, etc.) and run the server command above.

For host-specific presets (Vercel, Netlify, Cloudflare, AWS Lambda, etc.) and tuning, see https://v3.nitro.build/deploy.



## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you render `{children}` in the `shellComponent`.

Here is an example layout that includes a header:

```tsx
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My App' },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  ),
})
```

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Server Functions

TanStack Start provides server functions that allow you to write server-side code that seamlessly integrates with your client components.

```tsx
import { createServerFn } from '@tanstack/react-start'

const getServerTime = createServerFn({
  method: 'GET',
}).handler(async () => {
  return new Date().toISOString()
})

// Use in a component
function MyComponent() {
  const [time, setTime] = useState('')
  
  useEffect(() => {
    getServerTime().then(setTime)
  }, [])
  
  return <div>Server time: {time}</div>
}
```

## API Routes

You can create API routes by using the `server` property in your route definitions:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: () => json({ message: 'Hello, World!' }),
    },
  },
})
```

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/people')({
  loader: async () => {
    const response = await fetch('https://swapi.dev/api/people')
    return response.json()
  },
  component: PeopleComponent,
})

function PeopleComponent() {
  const data = Route.useLoaderData()
  return (
    <ul>
      {data.results.map((person) => (
        <li key={person.name}>{person.name}</li>
      ))}
    </ul>
  )
}
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).
