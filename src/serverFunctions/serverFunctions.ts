import { createServerFn } from '@tanstack/react-start';
import { env } from '#/env';

import testData from '../data/testData.json' with { type: 'json' };

export const getViteEnv = createServerFn().handler(async () => {
  return env.VITE_ENV;
});

export const getData = createServerFn().handler(async () => {
  if (env.VITE_ENV === 'testing') return testData;

  // Keep database and Redis dependencies inside the server boundary.
  const { getAllItems } = await import('../db/models');
  return getAllItems();
});
