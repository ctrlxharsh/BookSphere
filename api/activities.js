import { getPool } from './lib/db.js';

export const handler = async (event, context) => {
  const pool = getPool();
  const method = event.httpMethod;

  if (method === 'GET') {
    try {
      const result = await pool.query('SELECT icon, icon_bg as "iconBg", icon_color as "iconColor", message as text, meta, created_at FROM library_activities ORDER BY created_at DESC LIMIT 10');
      return {
        statusCode: 200,
        body: JSON.stringify(result.rows)
      };
    } catch (err) {
      console.error(err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching activities' })
      };
    }
  } else if (method === 'POST') {
    const { icon, iconBg, iconColor, text, meta } = JSON.parse(event.body);
    try {
      const result = await pool.query(
        'INSERT INTO library_activities (icon, icon_bg, icon_color, message, meta) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [icon, iconBg, iconColor, text, meta]
      );
      return {
        statusCode: 201,
        body: JSON.stringify(result.rows[0])
      };
    } catch (err) {
      console.error(err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error creating activity' })
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }
};
