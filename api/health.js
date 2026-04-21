import { getPool } from './lib/db.js';

export const handler = async (event, context) => {
  try {
    const pool = getPool();
    const result = await pool.query('SELECT NOW()');
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'ok', db_time: result.rows[0].now })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'error', message: err.message })
    };
  }
};
