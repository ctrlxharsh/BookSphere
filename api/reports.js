import { getPool } from './lib/db.js';

export const handler = async (event, context) => {
  const pool = getPool();
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const result = await pool.query(`
      SELECT l.id, l.loan_date, l.due_date,
             u.name as student_name, u.user_id as student_id,
             b.title as book_title, b.author
      FROM loans l
      JOIN users u ON l.user_id = u.id
      JOIN books b ON l.book_id = b.id
      WHERE l.returned = false
      ORDER BY l.due_date ASC
    `);
    return {
      statusCode: 200,
      body: JSON.stringify(result.rows)
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching report' })
    };
  }
};
