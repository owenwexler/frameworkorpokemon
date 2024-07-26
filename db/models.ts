import { db } from "./db";
import type { Item } from "../typedefs/Item";
import { items } from "./schema";

import redis from './redis/redis';

const CACHE_KEY = 'fop::data';

const getAllItems = async (): Promise<Item[]> => {
  try {
    const cacheResponse = await redis.get(CACHE_KEY);

    if (cacheResponse && !cacheResponse.hasOwnProperty('error')) {
      return JSON.parse(cacheResponse) as Item[];
    } else {
      const result = await db.select().from(items);
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