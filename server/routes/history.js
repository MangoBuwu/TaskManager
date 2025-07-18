const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET history with filters
router.get('/', async (req, res) => {
  try {
    const { start_date, end_date, user_id, activity_id, location_id } = req.query;
    
    let query = `
      SELECT 
        ah.id,
        ah.date,
        ah.completed,
        ah.completed_at,
        ah.notes,
        u.id as user_id,
        u.name as user_name,
        a.id as activity_id,
        a.name as activity_name,
        l.id as location_id,
        l.code as location_code,
        l.description as location_description
      FROM activity_history ah
      JOIN users u ON ah.user_id = u.id
      JOIN activities a ON ah.activity_id = a.id
      LEFT JOIN locations l ON ah.location_id = l.id
      WHERE 1=1
    `;
    const params = [];
    
    if (start_date) {
      params.push(start_date);
      query += ` AND ah.date >= $${params.length}`;
    }
    
    if (end_date) {
      params.push(end_date);
      query += ` AND ah.date <= $${params.length}`;
    }
    
    if (user_id) {
      params.push(user_id);
      query += ` AND ah.user_id = $${params.length}`;
    }
    
    if (activity_id) {
      params.push(activity_id);
      query += ` AND ah.activity_id = $${params.length}`;
    }
    
    if (location_id) {
      params.push(location_id);
      query += ` AND ah.location_id = $${params.length}`;
    }
    
    query += ' ORDER BY ah.date DESC, a.name, l.code';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching history' });
  }
});

// GET user activity history
router.get('/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { start_date, end_date } = req.query;
    
    let query = `
      SELECT 
        ah.date,
        ah.completed,
        ah.completed_at,
        ah.notes,
        a.name as activity_name,
        l.code as location_code,
        l.description as location_description
      FROM activity_history ah
      JOIN activities a ON ah.activity_id = a.id
      LEFT JOIN locations l ON ah.location_id = l.id
      WHERE ah.user_id = $1
    `;
    const params = [user_id];
    
    if (start_date) {
      params.push(start_date);
      query += ` AND ah.date >= $${params.length}`;
    }
    
    if (end_date) {
      params.push(end_date);
      query += ` AND ah.date <= $${params.length}`;
    }
    
    query += ' ORDER BY ah.date DESC, a.name';
    
    const result = await pool.query(query, params);
    
    // Also get absences for this user
    let absenceQuery = `
      SELECT date, reason
      FROM absences
      WHERE user_id = $1
    `;
    const absenceParams = [user_id];
    
    if (start_date) {
      absenceParams.push(start_date);
      absenceQuery += ` AND date >= $${absenceParams.length}`;
    }
    
    if (end_date) {
      absenceParams.push(end_date);
      absenceQuery += ` AND date <= $${absenceParams.length}`;
    }
    
    absenceQuery += ' ORDER BY date DESC';
    
    const absenceResult = await pool.query(absenceQuery, absenceParams);
    
    res.json({
      activities: result.rows,
      absences: absenceResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching user history' });
  }
});

// POST move assignments to history (end of day process)
router.post('/archive', async (req, res) => {
  try {
    const { date = new Date().toISOString().split('T')[0] } = req.body;
    
    // Move completed assignments to history
    const result = await pool.query(`
      INSERT INTO activity_history (user_id, activity_id, location_id, date, completed, completed_at, notes)
      SELECT user_id, activity_id, location_id, assigned_date, completed, completed_at, notes
      FROM daily_assignments
      WHERE assigned_date = $1
      ON CONFLICT DO NOTHING
    `, [date]);
    
    // Clear daily assignments for the date
    await pool.query('DELETE FROM daily_assignments WHERE assigned_date = $1', [date]);
    
    res.json({ message: `Archived assignments for ${date}`, count: result.rowCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error archiving assignments' });
  }
});

module.exports = router;