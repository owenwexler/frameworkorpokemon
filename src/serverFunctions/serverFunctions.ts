import { getAllItems } from '#/db/models';
import { createServerFn } from '@tanstack/react-start';
import { env } from '#/env';

import testData from '../data/testData.json' assert { type: 'json' };

export const getViteEnv = createServerFn().handler(async () => {
  return env.VITE_ENV;
});

export const getData = createServerFn().handler(async () => {
  const viteEnv = env.VITE_ENV;
  
  const result = viteEnv === 'testing' ? testData : await getAllItems();

  return result;
});
