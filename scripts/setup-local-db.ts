import { createClient } from '@libsql/client';
import { env } from '../src/env';

if (env.VITE_ENV !== 'development') {
  throw new Error('db:setup only runs with VITE_ENV=development');
}

const database = createClient({ url: env.SQLITE_DATABASE_URL });
try {
  const transaction = await database.transaction('write');
  try {
    await transaction.executeMultiple(
      await Bun.file(
        new URL('../src/db/sql/schema.sql', import.meta.url),
      ).text(),
    );
    const result = await transaction.execute(
      'SELECT COUNT(*) AS count FROM items',
    );
    if (Number(result.rows[0].count) === 0) {
      await transaction.executeMultiple(
        await Bun.file(
          new URL('../src/db/sql/inserts.sql', import.meta.url),
        ).text(),
      );
    }
    await transaction.commit();
    console.log(
      'Local SQLite database ready. Existing questions were preserved.',
    );
  } finally {
    transaction.close();
  }
} finally {
  database.close();
}
