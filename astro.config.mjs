import { defineConfig } from 'astro/config';
import db from "@astrojs/db";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  integrations: [db(), solidJs(), tailwind(), preact()]
});