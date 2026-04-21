import { getPool } from './lib/db.js';

export default async function handler(req, res) {
  const pool = getPool();
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'UserId is required' });
  }

  try {
    const userRes = await pool.query('SELECT id FROM users WHERE user_id = $1', [userId]);
    if (userRes.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    const internalId = userRes.rows[0].id;

    if (req.url.includes('issued')) {
      const result = await pool.query(`
        SELECT l.id, b.title, b.author, b.img_url as img, 
        l.due_date, 
        CASE WHEN l.due_date < CURRENT_DATE + INTERVAL '3 days' THEN true ELSE false END as dueUrgent,
        'Due ' || to_char(l.due_date, 'Mon DD') as dueText
        FROM loans l
        JOIN books b ON l.book_id = b.id
        WHERE l.user_id = $1 AND l.returned = false
      `, [internalId]);
      return res.status(200).json(result.rows);
    }

    if (req.url.includes('history')) {
      const result = await pool.query(`
        SELECT l.id, b.title, b.author, l.loan_date, l.due_date as return_date
        FROM loans l
        JOIN books b ON l.book_id = b.id
        WHERE l.user_id = $1 AND l.returned = true
        ORDER BY l.due_date DESC
      `, [internalId]);
      return res.status(200).json(result.rows);
    }

    if (req.url.includes('saved')) {
      const result = await pool.query(`
        SELECT item_type as type, title 
        FROM saved_items 
        WHERE user_id = $1
        ORDER BY saved_at DESC
      `, [internalId]);
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST' && req.url.includes('save')) {
      const { title, itemType } = req.body;
      const result = await pool.query(
        'INSERT INTO saved_items (user_id, item_type, title) VALUES ($1, $2, $3) RETURNING *',
        [internalId, itemType, title]
      );
      return res.status(201).json(result.rows[0]);
    }

    res.status(404).json({ message: 'Endpoint not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
