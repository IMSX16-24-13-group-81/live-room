import { Client } from 'pg';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

let db: NodePgDatabase<typeof schema>;

export const getPG = async () => {
  if (db) return db;
  
  const client = new Client(
    process.env.PG_CONNECTION_STRING || {
      host: '127.0.0.1',
      port: 5432,
      user: 'liveinfo',
      password: 'livepassword',
      database: 'liveinfo'
    }
  );

  console.log('Connecting to database');
  await client.connect();
  db = drizzle(client, { schema });
  return db;
};
