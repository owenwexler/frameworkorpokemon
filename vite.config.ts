import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(), // 1. Must run first to compile router assets & intercept client/server boundaries
    nitro({ preset: 'bun', rollupConfig: { external: [/^@sentry\//] } }), // 2. Wraps the output into a standalone Bun server
    viteReact(), // 3. Transforms standard React TSX files last
  ],
  // this prevents dep errors when RedisClient is imported from bun
  optimizeDeps: {
    exclude: ['bun', 'bun:test', 'bun:sqlite'],
  },
  ssr: {
    noExternal: [],
    external: ['bun'],
  },
})

export default config
