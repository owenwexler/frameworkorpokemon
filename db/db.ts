import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const dbUrl = import.meta.env.TURSO_DATABASE_URL;
const authToken = import.meta.env.TURSO_AUTH_TOKEN;

const client = createClient({ url: dbUrl, authToken: authToken });

const db = drizzle(client);

export {
  db
}