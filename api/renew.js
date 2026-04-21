import { getPool } from './lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { loanId } = req.body;
  const pool = getPool();

  try {
    // Check if loan exists
    const loan = await pool.query('SELECT * FROM loans WHERE id = $1', [loanId]);
    if (loan.rows.length === 0) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Update due date (add 7 days)
    await pool.query('UPDATE loans SET due_date = due_date + INTERVAL \'7 days\' WHERE id = $1', [loanId]);

    // Log activity
    await pool.query(
      'INSERT INTO library_activities (icon, icon_bg, icon_color, message, meta) VALUES ($1, $2, $3, $4, $5)',
      ['event_repeat', 'bg-secondary-container', 'text-on-secondary-container', `Loan renewed for item ID: ${loan.rows[0].book_id}`, 'Student Portal • Just now']
    );

    res.status(200).json({ message: 'Loan renewed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error renewing loan' });
  }
}
