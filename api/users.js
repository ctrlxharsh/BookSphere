import { getPool } from './lib/db.js';

export default async function handler(req, res) {
  const pool = getPool();

  if (req.method === 'POST') {
    const { userId, name, role, password, details } = req.body;
    
    // Basic validation
    if (!userId || !name || !role || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const result = await pool.query(
        'INSERT INTO users (user_id, name, role, password_hash, details) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id, name, role, details',
        [userId, name, role, password, details]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      if (err.code === '23505') { // Unique violation
        return res.status(409).json({ message: 'User ID already exists' });
      }
      res.status(500).json({ message: 'Error creating user' });
    }
  } else if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT id, user_id, name, role, details FROM users ORDER BY id DESC');
      res.status(200).json(result.rows);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching users' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
