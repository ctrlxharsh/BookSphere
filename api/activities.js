import { getPool } from './lib/db.js';

export default async function handler(req, res) {
  const pool = getPool();
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT icon, icon_bg as "iconBg", icon_color as "iconColor", message as text, meta, created_at FROM library_activities ORDER BY created_at DESC LIMIT 10');
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching activities' });
    }
  } else if (req.method === 'POST') {
    const { icon, iconBg, iconColor, text, meta } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO library_activities (icon, icon_bg, icon_color, message, meta) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [icon, iconBg, iconColor, text, meta]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error creating activity' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
