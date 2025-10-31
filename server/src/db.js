import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Please define it in a .env file or environment variable.'
  );
}

export const pool = new Pool({
  connectionString,
});

pool.on('error', (err) => {
  console.error('Unexpected database error', err);
  process.exit(1);
});

export const query = (text, params) => pool.query(text, params);
