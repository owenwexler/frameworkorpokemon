import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';

import { tanstackStart } from '@tanstack/react-start/plugin/vite';

import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(), // 1. Must run first to compile router assets & intercept client/server boundaries
    nitro({ rollupConfig: { external: [/^@sentry\//] } }), // 2. Wraps the output into a standalone node-server
    viteReact(),     // 3. Transforms standard React TSX files last
  ],
});

export default config;
