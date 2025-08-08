import { createClient } from '@libsql/client';

const dbUrl = import.meta.env.TURSO_DATABASE_URL;
const authToken = import.meta.env.TURSO_AUTH_TOKEN;

const turso = createClient({ url: dbUrl, authToken: authToken });
console.log('*** CONNECTED TO TURSO ***');

export {
  turso
}
