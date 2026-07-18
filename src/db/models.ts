import { turso } from './db';
import type { Item } from '../typedefs/Item';

import redis from './redis/redis.server';
import type { ItemDBResponse } from '../typedefs/ItemDBResponse';

const CACHE_KEY = 'fop::data';

const processItem = (item: ItemDBResponse): Item => {
  const {
    item_id,
    item_name,
    item_type
  } = item;

  return {
    id: Number(item_id),
    name: item_name,
    type: item_type
  }
}

const processItems = (items: ItemDBResponse[]): Item[] => {
  if (items.length <= 0) {
    return [] as Item[];
  }

  return items.map(item => {
    return processItem(item);
  });
}


const getAllItems = async (): Promise<Item[]> => {
  try {
    const cacheResponse = await redis.get(CACHE_KEY);

    if (cacheResponse && !cacheResponse.hasOwnProperty('error')) {
      return JSON.parse(cacheResponse) as Item[];
    } else {
      const response = await turso.execute('SELECT * FROM items;');
      const result = processItems(response.rows as unknown as ItemDBResponse[]);
      redis.set(CACHE_KEY, JSON.stringify(result), 'EX', 60 * 60 * 60);
      return result as Item[];
    }
  } catch(err) {
    console.error(err);
    throw err;
  }
}

export {
  getAllItems
}
