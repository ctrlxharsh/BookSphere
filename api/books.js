import { getPool } from './lib/db.js';

export const handler = async (event, context) => {
  const pool = getPool();
  const method = event.httpMethod;
  const path = event.path;

  if (method === 'GET') {
    if (path.includes('categories')) {
      try {
        const result = await pool.query('SELECT DISTINCT category FROM books WHERE category IS NOT NULL');
        return {
          statusCode: 200,
          body: JSON.stringify(['All', ...result.rows.map(r => r.category)])
        };
      } catch (err) {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Error fetching categories' })
        };
      }
    }
    try {
      const result = await pool.query('SELECT * FROM books ORDER BY id DESC');
      return {
        statusCode: 200,
        body: JSON.stringify(result.rows)
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching books' })
      };
    }
  } else if (method === 'POST') {
    const { title, author, category, img_url, description } = JSON.parse(event.body);
    try {
      const result = await pool.query(
        'INSERT INTO books (title, author, category, img_url, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, author, category, img_url, description]
      );
      return {
        statusCode: 201,
        body: JSON.stringify(result.rows[0])
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error adding book' })
      };
    }
  } else if (method === 'PUT') {
    const { id, title, author, category, img_url, description, available } = JSON.parse(event.body);
    try {
      const result = await pool.query(
        'UPDATE books SET title=$1, author=$2, category=$3, img_url=$4, description=$5, available=$6 WHERE id=$7 RETURNING *',
        [title, author, category, img_url, description, available, id]
      );
      return {
        statusCode: 200,
        body: JSON.stringify(result.rows[0])
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error updating book' })
      };
    }
  } else if (method === 'DELETE') {
    const { id } = event.queryStringParameters || {};
    try {
      await pool.query('DELETE FROM books WHERE id=$1', [id]);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Book deleted' })
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error deleting book' })
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }
};
