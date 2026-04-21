import pg from 'pg';
const { Pool } = pg;

let pool;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString:
        process.env.DATABASE_URL ||
        'postgresql://postgres:BookSphere@123@db.ahbyapeeivxhurstsliv.supabase.co:5432/postgres',
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}
