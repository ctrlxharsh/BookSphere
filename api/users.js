import { getPool } from './lib/db.js';

export const handler = async (event, context) => {
  const pool = getPool();
  const method = event.httpMethod;

  if (method === 'POST') {
    const { userId, name, role, password, details } = JSON.parse(event.body);
    
    // Basic validation
    if (!userId || !name || !role || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' })
      };
    }

    try {
      const result = await pool.query(
        'INSERT INTO users (user_id, name, role, password_hash, details) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id, name, role, details',
        [userId, name, role, password, details]
      );
      return {
        statusCode: 201,
        body: JSON.stringify(result.rows[0])
      };
    } catch (err) {
      console.error(err);
      if (err.code === '23505') { // Unique violation
        return {
          statusCode: 409,
          body: JSON.stringify({ message: 'User ID already exists' })
        };
      }
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error creating user' })
      };
    }
  } else if (method === 'GET') {
    try {
      const result = await pool.query('SELECT id, user_id, name, role, details FROM users ORDER BY id DESC');
      return {
        statusCode: 200,
        body: JSON.stringify(result.rows)
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching users' })
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }
};
