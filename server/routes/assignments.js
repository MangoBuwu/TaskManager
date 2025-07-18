const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET assignments for a specific date
router.get('/', async (req, res) => {
  try {
    const { date = new Date().toISOString().split('T')[0] } = req.query;
    
    const result = await pool.query(`
      SELECT 
        da.id,
        da.assigned_date,
        da.completed,
        da.completed_at,
        da.notes,
        u.id as user_id,
        u.name as user_name,
        a.id as activity_id,
        a.name as activity_name,
        a.requires_location,
        l.id as location_id,
        l.code as location_code,
        l.description as location_description
      FROM daily_assignments da
      JOIN users u ON da.user_id = u.id
      JOIN activities a ON da.activity_id = a.id
      LEFT JOIN locations l ON da.location_id = l.id
      WHERE da.assigned_date = $1
      ORDER BY a.name, l.code
    `, [date]);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching assignments' });
  }
});

// POST create new assignment
router.post('/', async (req, res) => {
  try {
    const { user_id, activity_id, location_id, assigned_date, notes } = req.body;
    
    if (!user_id || !activity_id || !assigned_date) {
      return res.status(400).json({ error: 'User ID, Activity ID, and Date are required' });
    }
    
    const result = await pool.query(`
      INSERT INTO daily_assignments (user_id, activity_id, location_id, assigned_date, notes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [user_id, activity_id, location_id, assigned_date, notes]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      res.status(400).json({ error: 'Assignment already exists for this activity and location on this date' });
    } else {
      res.status(500).json({ error: 'Error creating assignment' });
    }
  }
});

// PUT update assignment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, activity_id, location_id, completed, notes } = req.body;
    
    const result = await pool.query(`
      UPDATE daily_assignments 
      SET user_id = $1, activity_id = $2, location_id = $3, completed = $4, notes = $5,
          completed_at = CASE WHEN $4 = true THEN CURRENT_TIMESTAMP ELSE NULL END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `, [user_id, activity_id, location_id, completed, notes, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating assignment' });
  }
});

// DELETE assignment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM daily_assignments WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    res.json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting assignment' });
  }
});

// POST mark absence
router.post('/absence', async (req, res) => {
  try {
    const { user_id, date, reason } = req.body;
    
    if (!user_id || !date) {
      return res.status(400).json({ error: 'User ID and Date are required' });
    }
    
    const result = await pool.query(`
      INSERT INTO absences (user_id, date, reason)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, date) DO UPDATE SET reason = $3
      RETURNING *
    `, [user_id, date, reason]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error recording absence' });
  }
});

// GET absences for a date range
router.get('/absences', async (req, res) => {
  try {
    const { start_date, end_date, user_id } = req.query;
    
    let query = `
      SELECT a.*, u.name as user_name
      FROM absences a
      JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    
    if (start_date) {
      params.push(start_date);
      query += ` AND a.date >= $${params.length}`;
    }
    
    if (end_date) {
      params.push(end_date);
      query += ` AND a.date <= $${params.length}`;
    }
    
    if (user_id) {
      params.push(user_id);
      query += ` AND a.user_id = $${params.length}`;
    }
    
    query += ' ORDER BY a.date DESC, u.name';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching absences' });
  }
});

module.exports = router;