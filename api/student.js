import { getPool } from './lib/db.js';

export const handler = async (event, context) => {
  const pool = getPool();
  const { userId } = event.queryStringParameters || {};

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'UserId is required' })
    };
  }

  const path = event.path;

  try {
    const userRes = await pool.query('SELECT id FROM users WHERE user_id = $1', [userId]);
    if (userRes.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' })
      };
    }
    const internalId = userRes.rows[0].id;

    if (path.includes('issued')) {
      const result = await pool.query(`
        SELECT l.id, b.title, b.author, b.img_url as img, 
        l.due_date, 
        CASE WHEN l.due_date < CURRENT_DATE + INTERVAL '3 days' THEN true ELSE false END as dueUrgent,
        'Due ' || to_char(l.due_date, 'Mon DD') as dueText
        FROM loans l
        JOIN books b ON l.book_id = b.id
        WHERE l.user_id = $1 AND l.returned = false
      `, [internalId]);
      return {
        statusCode: 200,
        body: JSON.stringify(result.rows)
      };
    }

    if (path.includes('history')) {
      const result = await pool.query(`
        SELECT l.id, b.title, b.author, l.loan_date, l.due_date as return_date
        FROM loans l
        JOIN books b ON l.book_id = b.id
        WHERE l.user_id = $1 AND l.returned = true
        ORDER BY l.due_date DESC
      `, [internalId]);
      return {
        statusCode: 200,
        body: JSON.stringify(result.rows)
      };
    }

    if (path.includes('saved')) {
      const result = await pool.query(`
        SELECT item_type as type, title 
        FROM saved_items 
        WHERE user_id = $1
        ORDER BY saved_at DESC
      `, [internalId]);
      return {
        statusCode: 200,
        body: JSON.stringify(result.rows)
      };
    }

    if (event.httpMethod === 'POST' && path.includes('save')) {
      const { title, itemType } = JSON.parse(event.body);
      const result = await pool.query(
        'INSERT INTO saved_items (user_id, item_type, title) VALUES ($1, $2, $3) RETURNING *',
        [internalId, itemType, title]
      );
      return {
        statusCode: 201,
        body: JSON.stringify(result.rows[0])
      };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Endpoint not found' })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' })
    };
  }
};
