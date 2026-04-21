import { getPool } from './lib/db.js';

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  const { loanId } = JSON.parse(event.body);
  const pool = getPool();

  try {
    // Check if loan exists
    const loan = await pool.query('SELECT * FROM loans WHERE id = $1', [loanId]);
    if (loan.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Loan not found' })
      };
    }

    // Update due date (add 7 days)
    await pool.query('UPDATE loans SET due_date = due_date + INTERVAL \'7 days\' WHERE id = $1', [loanId]);

    // Log activity
    await pool.query(
      'INSERT INTO library_activities (icon, icon_bg, icon_color, message, meta) VALUES ($1, $2, $3, $4, $5)',
      ['event_repeat', 'bg-secondary-container', 'text-on-secondary-container', `Loan renewed for item ID: ${loan.rows[0].book_id}`, 'Student Portal • Just now']
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Loan renewed successfully' })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error renewing loan' })
    };
  }
};
