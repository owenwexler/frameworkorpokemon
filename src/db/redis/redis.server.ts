import Redis from 'ioredis';
import { env } from '#/env';

const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  connectTimeout: 1000,
  commandTimeout: 1000,
  maxRetriesPerRequest: 1,
  retryStrategy: (attempt) => Math.min(attempt * 200, 5000),
});

// ioredis emits connection errors separately from rejected commands. Avoid
// logging connection details (which may contain credentials).
redis.on('error', () => {
  console.warn('Redis connection unavailable; requests will use the database.');
});

export default redis;
