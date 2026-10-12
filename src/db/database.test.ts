import { afterAll, expect, test } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const directory = mkdtempSync(join(tmpdir(), 'fop-db-'));
const localUrl = `file:${join(directory, 'questions.db')}`;
const environment = {
  PATH: process.env.PATH,
  VITE_ENV: 'development',
  SQLITE_DATABASE_URL: localUrl,
  PORT: '3000',
  NODE_VERSION: '24.5.1',
  NITRO_PRESET: 'bun',
};

function run(args: string[], overrides: Record<string, string> = {}) {
  return Bun.spawnSync([process.execPath, '--no-env-file', ...args], {
    env: { ...environment, ...overrides },
    stdout: 'pipe',
    stderr: 'pipe',
  });
}

afterAll(() => rmSync(directory, { recursive: true, force: true }));

test('local setup preserves existing rows and SQLite contains the seeded questions', () => {
  for (let i = 0; i < 2; i++) {
    const setup = run(['scripts/setup-local-db.ts']);
    expect(setup.stderr.toString()).toBe('');
    expect(setup.exitCode).toBe(0);
  }
  const result = run([
    '-e',
    `import { database } from './src/db/db';
     const result = await database.execute('SELECT item_id AS id, item_name AS name, item_type AS type FROM items');
     const items = result.rows;
     console.log(JSON.stringify(items));
     database.close();`,
  ]);
  expect(result.exitCode).toBe(0);
  const items = JSON.parse(result.stdout.toString());
  const seeds = Bun.file('src/db/sql/inserts.sql');
  expect(items[0]).toEqual({ id: 1, name: 'React', type: 'framework' });
  expect(items.length).toBeGreaterThan(10);
  // Compare against the seed count so a second setup cannot silently duplicate rows.
  return seeds.text().then((sql) => {
    expect(items.length).toBe(sql.match(/INSERT INTO items/g)?.length);
  });
});

test('production requires credentials and rejects local database URLs', () => {
  const missing = run(['-e', "await import('./src/env')"], {
    VITE_ENV: 'production',
  });
  expect(missing.exitCode).not.toBe(0);
  for (const key of ['TURSO_DATABASE_URL', 'TURSO_AUTH_TOKEN', 'REDIS_URL']) {
    expect(missing.stderr.toString()).toContain(key);
  }
  const local = run(['-e', "await import('./src/env')"], {
    VITE_ENV: 'production',
    TURSO_DATABASE_URL: localUrl,
    TURSO_AUTH_TOKEN: 'test',
    REDIS_URL: 'redis://localhost:6379',
  });
  expect(local.exitCode).not.toBe(0);
});

test('production config selects Turso and local setup refuses production', () => {
  const production = {
    VITE_ENV: 'production',
    TURSO_DATABASE_URL: 'libsql://example.turso.io',
    TURSO_AUTH_TOKEN: 'test',
    REDIS_URL: 'redis://localhost:6379',
  };
  const result = run(
    [
      '-e',
      "import { database } from './src/db/db'; console.log(database.protocol); database.close();",
    ],
    production,
  );
  expect(result.exitCode).toBe(0);
  expect(result.stdout.toString().trim()).toBe('http');
  const setup = run(['scripts/setup-local-db.ts'], production);
  expect(setup.exitCode).not.toBe(0);
  expect(setup.stderr.toString()).toContain(
    'only runs with VITE_ENV=development',
  );
});

for (const scenario of [
  'hit',
  'miss',
  'read failure',
  'write failure',
  'invalid JSON',
  'invalid shape',
  'initialization failure',
  'database failure',
]) {
  test(`cache-first questions: ${scenario}`, () => {
    const result = run([
      '-e',
      `import { mock, expect } from 'bun:test';
       const scenario = ${JSON.stringify(scenario)};
       const items = [{ id: 1, name: 'React', type: 'framework' }];
       let queries = 0;
       let writes = 0;
       mock.module('./src/db/db', () => ({ database: {
         execute: async () => {
           queries++;
           if (scenario === 'database failure') throw new Error('database unavailable');
           return { rows: [{ item_id: 1, item_name: 'React', item_type: 'framework' }] };
         },
       }}));
       mock.module('./src/db/redis/redis.server', () => ({
         get default() {
           if (scenario === 'initialization failure') throw new Error('initialization failed');
           return {
             get: async () => {
               if (scenario === 'hit') return JSON.stringify(items);
               if (scenario === 'read failure') throw new Error('Redis unavailable');
               if (scenario === 'invalid JSON') return '{broken';
               if (scenario === 'invalid shape') return JSON.stringify({ error: 'bad cache' });
               return null;
             },
             set: async (key, value, expiry, ttl) => {
               writes++;
               expect(key).toBe('fop::data');
               expect(JSON.parse(value)).toEqual(items);
               expect([expiry, ttl]).toEqual(['EX', 216000]);
               if (scenario === 'write failure') throw new Error('Redis unavailable');
             },
           };
         },
       }));
       const { getAllItems } = await import('./src/db/models');
       if (scenario === 'database failure') {
         await expect(getAllItems()).rejects.toThrow('database unavailable');
       } else {
         expect(await getAllItems()).toEqual(items);
       }
       expect(queries).toBe(scenario === 'hit' ? 0 : 1);
       expect(writes).toBe(['hit', 'initialization failure', 'database failure'].includes(scenario) ? 0 : 1);`,
    ]);
    expect(result.exitCode).toBe(0);
  });
}
