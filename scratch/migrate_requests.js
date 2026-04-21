import { getPool } from '../api/lib/db.js';
import dotenv from 'dotenv';
dotenv.config();

async function migrate() {
  const pool = getPool();
  try {
    console.log('Running migration...');
    await pool.query('ALTER TABLE requests ADD COLUMN IF NOT EXISTS research_id INTEGER;');
    console.log('Migration successful: Column research_id added to requests table.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
