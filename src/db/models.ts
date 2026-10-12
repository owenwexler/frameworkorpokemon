import { database } from './db';
import type Redis from 'ioredis';
import type { Item } from '../typedefs/Item';

import type { ItemDBResponse } from '../typedefs/ItemDBResponse';

const CACHE_KEY = 'fop::data';

const processItem = (item: ItemDBResponse): Item => {
  const { item_id, item_name, item_type } = item;

  return {
    id: Number(item_id),
    name: item_name,
    type: item_type,
  };
};

const processItems = (items: ItemDBResponse[]): Item[] => {
  if (items.length <= 0) {
    return [] as Item[];
  }

  return items.map((item) => {
    return processItem(item);
  });
};

const isItems = (value: unknown): value is Item[] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      item !== null &&
      typeof item === 'object' &&
      Number.isFinite(item.id) &&
      typeof item.name === 'string' &&
      (item.type === 'framework' || item.type === 'pokemon'),
  );

const getAllItems = async (): Promise<Item[]> => {
  let redis: Redis | undefined;
  try {
    // Keep initialization inside the fallback boundary as well as commands.
    redis = (await import('./redis/redis.server')).default;
    const cached = await redis.get(CACHE_KEY);
    if (cached !== null) {
      const items: unknown = JSON.parse(cached);
      if (!isItems(items)) throw new Error('Invalid cached questions');
      return items;
    }
  } catch {
    console.warn('Question cache read failed; using the database.');
  }

  // Database failures must still reach the caller.
  const response = await database.execute('SELECT * FROM items;');
  const result = processItems(response.rows as unknown as ItemDBResponse[]);

  if (redis) {
    try {
      await redis.set(CACHE_KEY, JSON.stringify(result), 'EX', 60 * 60 * 60);
    } catch {
      console.warn('Question cache write failed; returning database results.');
    }
  }
  return result;
};

export { getAllItems };
