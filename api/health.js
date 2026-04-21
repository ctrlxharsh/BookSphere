import { getPool } from './lib/db.js';

export default async function handler(req, res) {
  try {
    const pool = getPool();
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({ status: 'ok', db_time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}
