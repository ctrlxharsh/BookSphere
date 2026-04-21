import { getPool } from './lib/db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'amu_library_secret_key_2024';

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  const { userId, password } = JSON.parse(event.body);

  try {
    const pool = getPool();
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);

    if (result.rows.length === 0) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' })
      };
    }

    const user = result.rows[0];

    // For simplicity, we are checking plain text password as seeded. 
    // In production, use bcrypt.compare(password, user.password_hash)
    if (password !== user.password_hash) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' })
      };
    }

    const token = jwt.sign(
      { id: user.id, userId: user.user_id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        token,
        user: {
          id: user.user_id,
          name: user.name,
          role: user.role,
          details: user.details
        }
      })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' })
    };
  }
};
