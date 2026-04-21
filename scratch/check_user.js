import { getPool } from '../api/lib/db.js';
const pool = getPool();
try {
  const res = await pool.query('SELECT * FROM users WHERE user_id = $1', ['LIB']);
  console.log(JSON.stringify(res.rows[0], null, 2));
} catch (err) {
  console.error(err);
}
process.exit(0);
