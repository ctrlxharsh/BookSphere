import { getPool } from './lib/db.js';

export default async function handler(req, res) {
  const pool = getPool();
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
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
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching report' });
  }
}
