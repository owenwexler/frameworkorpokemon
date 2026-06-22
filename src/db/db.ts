import { createClient } from '@libsql/client';
import { env } from '#/env';

const dbUrl = env.TURSO_DATABASE_URL;
const authToken = env.TURSO_AUTH_TOKEN;

const turso = createClient({ url: dbUrl, authToken: authToken });
console.log('*** CONNECTED TO TURSO ***');

export {
  turso
}
