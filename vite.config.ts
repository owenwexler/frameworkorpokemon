import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';

import { tanstackStart } from '@tanstack/react-start/plugin/vite';

import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';

const config = defineConfig({
  server: {
    // 💡 This forces the underlying Nitro/H3 server engine 
    // to use the native Bun preset instead of defaulting to Node
    preset: 'bun' 
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(), // 1. Must run first to compile router assets & intercept client/server boundaries
    nitro({ rollupConfig: { external: [/^@sentry\//] } }), // 2. Wraps the output into a standalone node-server
    viteReact(),     // 3. Transforms standard React TSX files last
  ],
  // this prevents dep errors when RedisClient is imported from bun
  optimizeDeps: {
    exclude: ['bun', 'bun:test', 'bun:sqlite']
  },
  ssr: {
    noExternal: [],
    external: ['bun']
  }
});

export default config;
