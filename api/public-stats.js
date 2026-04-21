import { getPool } from './lib/db.js';

export default async function handler(req, res) {
  const pool = getPool();
  try {
    const bookCount = await pool.query('SELECT COUNT(*) FROM books');
    const manuscriptCount = await pool.query("SELECT COUNT(*) FROM books WHERE category = 'Archives'");
    const featuredBook = await pool.query("SELECT * FROM books WHERE category = 'Archives' ORDER BY RANDOM() LIMIT 1");

    res.status(200).json({
      totalVolumes: bookCount.rows[0].count,
      totalManuscripts: manuscriptCount.rows[0].count,
      featured: featuredBook.rows[0] || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching public stats' });
  }
}
