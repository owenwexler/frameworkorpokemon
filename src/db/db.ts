import { createClient } from '@libsql/client';
import { env } from '#/env';

const database = createClient(
  env.VITE_ENV === 'production'
    ? { url: env.TURSO_DATABASE_URL!, authToken: env.TURSO_AUTH_TOKEN }
    : { url: env.SQLITE_DATABASE_URL },
);

export { database };
