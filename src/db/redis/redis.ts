import Redis from 'ioredis';
import { env } from '#/env';

const redisConnection = env.REDIS_CONNECTION;

export default redisConnection && redisConnection !== '' ? new Redis(redisConnection) : new Redis();
