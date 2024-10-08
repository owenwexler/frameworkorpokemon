import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), preact()],
  server: {
    port: 3000,
    host: true
  },
  output: "server",
  adapter: node({
    mode: "standalone"
  })
});