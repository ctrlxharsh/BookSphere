import { getPool } from './lib/db.js';

export const handler = async (event, context) => {
  const pool = getPool();
  try {
    const bookCount = await pool.query('SELECT COUNT(*) FROM books');
    const manuscriptCount = await pool.query("SELECT COUNT(*) FROM books WHERE category = 'Archives'");
    const featuredBook = await pool.query("SELECT * FROM books WHERE category = 'Archives' ORDER BY RANDOM() LIMIT 1");

    return {
      statusCode: 200,
      body: JSON.stringify({
        totalVolumes: bookCount.rows[0].count,
        totalManuscripts: manuscriptCount.rows[0].count,
        featured: featuredBook.rows[0] || null
      })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching public stats' })
    };
  }
};
