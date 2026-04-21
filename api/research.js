import { getPool } from './lib/db.js';

export default async function handler(req, res) {
  const pool = getPool();
  
  if (req.method === 'GET') {
    try {
      const { q } = req.query;
      let query = 'SELECT * FROM research_materials';
      let params = [];
      
      if (q) {
        query += ' WHERE title ILIKE $1 OR author ILIKE $1 OR description ILIKE $1';
        params = [`%${q}%`];
      }
      
      query += ' ORDER BY created_at DESC';
      const result = await pool.query(query, params);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching research materials' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, author, type, category, description, img_url, external_link } = req.body;
      const result = await pool.query(
        'INSERT INTO research_materials (title, author, type, category, description, img_url, external_link) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [title, author, type, category, description, img_url, external_link]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error creating research material' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      await pool.query('DELETE FROM research_materials WHERE id = $1', [id]);
      res.status(200).json({ message: 'Material deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error deleting material' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, title, author, type, category, description, img_url, external_link, available } = req.body;
      const result = await pool.query(
        'UPDATE research_materials SET title = $1, author = $2, type = $3, category = $4, description = $5, img_url = $6, external_link = $7, available = $8 WHERE id = $9 RETURNING *',
        [title, author, type, category, description, img_url, external_link, available, id]
      );
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating research material' });
    }
  }
}
