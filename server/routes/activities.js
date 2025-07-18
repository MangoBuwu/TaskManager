const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all activities
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM activities ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching activities' });
  }
});

// GET activity by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM activities WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching activity' });
  }
});

// POST create new activity
router.post('/', async (req, res) => {
  try {
    const { name, description, requires_location = true } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const result = await pool.query(
      'INSERT INTO activities (name, description, requires_location) VALUES ($1, $2, $3) RETURNING *',
      [name, description, requires_location]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      res.status(400).json({ error: 'Activity name already exists' });
    } else {
      res.status(500).json({ error: 'Error creating activity' });
    }
  }
});

// PUT update activity
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, requires_location } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const result = await pool.query(
      'UPDATE activities SET name = $1, description = $2, requires_location = $3 WHERE id = $4 RETURNING *',
      [name, description, requires_location, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      res.status(400).json({ error: 'Activity name already exists' });
    } else {
      res.status(500).json({ error: 'Error updating activity' });
    }
  }
});

// DELETE activity
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM activities WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    res.json({ message: 'Activity deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting activity' });
  }
});

module.exports = router;