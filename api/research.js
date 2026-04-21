import { getPool } from './lib/db.js';

export const handler = async (event, context) => {
  const pool = getPool();
  const method = event.httpMethod;

  if (method === 'GET') {
    try {
      const { q } = event.queryStringParameters || {};
      let query = 'SELECT * FROM research_materials';
      let params = [];

      if (q) {
        query += ' WHERE title ILIKE $1 OR author ILIKE $1 OR description ILIKE $1';
        params = [`%${q}%`];
      }

      query += ' ORDER BY created_at DESC';
      const result = await pool.query(query, params);
      return {
        statusCode: 200,
        body: JSON.stringify(result.rows)
      };
    } catch (err) {
      console.error(err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching research materials' })
      };
    }
  } else if (method === 'POST') {
    try {
      const { title, author, type, category, description, img_url, external_link } = JSON.parse(event.body);
      const result = await pool.query(
        'INSERT INTO research_materials (title, author, type, category, description, img_url, external_link) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [title, author, type, category, description, img_url, external_link]
      );
      return {
        statusCode: 201,
        body: JSON.stringify(result.rows[0])
      };
    } catch (err) {
      console.error(err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error creating research material' })
      };
    }
  } else if (method === 'DELETE') {
    try {
      const { id } = event.queryStringParameters || {};
      await pool.query('DELETE FROM research_materials WHERE id = $1', [id]);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Material deleted' })
      };
    } catch (err) {
      console.error(err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error deleting material' })
      };
    }
  } else if (method === 'PUT') {
    try {
      const { id, title, author, type, category, description, img_url, external_link, available } = JSON.parse(event.body);
      const result = await pool.query(
        'UPDATE research_materials SET title = $1, author = $2, type = $3, category = $4, description = $5, img_url = $6, external_link = $7, available = $8 WHERE id = $9 RETURNING *',
        [title, author, type, category, description, img_url, external_link, available, id]
      );
      return {
        statusCode: 200,
        body: JSON.stringify(result.rows[0])
      };
    } catch (err) {
      console.error(err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error updating research material' })
      };
    }
  }
};
