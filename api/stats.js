import { getPool } from './lib/db.js';

export const handler = async (event, context) => {
  const pool = getPool();

  try {
    const totalIssued = await pool.query('SELECT COUNT(*) FROM loans WHERE returned = false');
    const newMembers = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'student'");
    const pendingReqs = await pool.query("SELECT COUNT(*) FROM requests WHERE status = 'pending'");

    return {
      statusCode: 200,
      body: JSON.stringify([
        { icon: 'book', label: 'Total Books Issued', value: totalIssued.rows[0].count, badge: 'Live Data', badgeColor: 'text-primary bg-primary/10' },
        { icon: 'pending_actions', label: 'Pending Book Requests', value: pendingReqs.rows[0].count, badge: 'Requires Attention', badgeColor: 'text-error bg-error/10' },
        { icon: 'person_add', label: 'Registered Students', value: newMembers.rows[0].count, badge: 'Database count', badgeColor: 'text-secondary bg-secondary/10' },
      ])
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' })
    };
  }
};
