import { getPool } from './lib/db.js';

export default async function handler(req, res) {
  const pool = getPool();

  if (req.method === 'GET') {
    if (req.url.includes('categories')) {
      try {
        const result = await pool.query('SELECT DISTINCT category FROM books WHERE category IS NOT NULL');
        res.status(200).json(['All', ...result.rows.map(r => r.category)]);
      } catch (err) {
        res.status(500).json({ message: 'Error fetching categories' });
      }
      return;
    }
    try {
      const result = await pool.query('SELECT * FROM books ORDER BY id DESC');
      res.status(200).json(result.rows);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching books' });
    }
  } else if (req.method === 'POST') {
    const { title, author, category, img_url, description } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO books (title, author, category, img_url, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, author, category, img_url, description]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ message: 'Error adding book' });
    }
  } else if (req.method === 'PUT') {
    const { id, title, author, category, img_url, description, available } = req.body;
    try {
      const result = await pool.query(
        'UPDATE books SET title=$1, author=$2, category=$3, img_url=$4, description=$5, available=$6 WHERE id=$7 RETURNING *',
        [title, author, category, img_url, description, available, id]
      );
      res.status(200).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ message: 'Error updating book' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      await pool.query('DELETE FROM books WHERE id=$1', [id]);
      res.status(200).json({ message: 'Book deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting book' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
