import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from './schema';

export const getDB = async () => {
  const client = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: 'liveinfo',
    password: 'livepassword',
    database: 'liveinfo'
  });

  await client.connect();
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder: 'drizzle' });
  return db;
};
