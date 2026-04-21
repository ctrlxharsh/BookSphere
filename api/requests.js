import { getPool } from './lib/db.js';

export default async function handler(req, res) {
  const pool = getPool();

  if (req.method === 'GET') {
    const { userId } = req.query;
    try {
      let queryText = `
        SELECT r.id, r.status, r.request_date,
               u.name as student_name, u.user_id as student_id,
               b.title as book_title, b.id as book_id
        FROM requests r
        JOIN users u ON r.user_id = u.id
        JOIN books b ON r.book_id = b.id
      `;
      let queryParams = [];

      if (userId) {
        const userRes = await pool.query('SELECT id FROM users WHERE user_id = $1', [userId]);
        if (userRes.rows.length === 0) return res.status(200).json([]);
        queryText += ` WHERE r.user_id = $1 AND r.status IN ('pending', 'approved') `;
        queryParams = [userRes.rows[0].id];
      } else {
        queryText += ` WHERE r.status = 'pending' `;
      }

      queryText += ` ORDER BY r.request_date DESC `;
      
      const result = await pool.query(queryText, queryParams);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching requests' });
    }
  } else if (req.method === 'POST') {
    const { userId, bookId } = req.body;
    try {
      const userRes = await pool.query('SELECT id FROM users WHERE user_id = $1', [userId]);
      if (userRes.rows.length === 0) return res.status(404).json({ message: 'User not found' });
      const internalUserId = userRes.rows[0].id;

      const checkRes = await pool.query('SELECT * FROM requests WHERE user_id = $1 AND book_id = $2 AND status = $3', [internalUserId, bookId, 'pending']);
      if (checkRes.rows.length > 0) return res.status(400).json({ message: 'Request already pending' });

      const result = await pool.query(
        'INSERT INTO requests (user_id, book_id) VALUES ($1, $2) RETURNING *',
        [internalUserId, bookId]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error creating request' });
    }
  } else if (req.method === 'PUT') {
    const { requestId, status } = req.body;
    try {
      const reqRes = await pool.query('SELECT * FROM requests WHERE id = $1', [requestId]);
      if (reqRes.rows.length === 0) return res.status(404).json({ message: 'Request not found' });
      const request = reqRes.rows[0];

      await pool.query('UPDATE requests SET status = $1 WHERE id = $2', [status, requestId]);

      if (status === 'approved') {
        await pool.query(
          'INSERT INTO loans (user_id, book_id, due_date) VALUES ($1, $2, CURRENT_DATE + INTERVAL \'14 days\')',
          [request.user_id, request.book_id]
        );
        await pool.query('UPDATE books SET available = false WHERE id = $1', [request.book_id]);
      }

      res.status(200).json({ message: `Request ${status}` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating request' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
