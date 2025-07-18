const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET all locations
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM locations ORDER BY code');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching locations' });
  }
});

// GET location by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM locations WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching location' });
  }
});

// POST create new location
router.post('/', async (req, res) => {
  try {
    const { code, description } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    
    const result = await pool.query(
      'INSERT INTO locations (code, description) VALUES ($1, $2) RETURNING *',
      [code, description]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      res.status(400).json({ error: 'Location code already exists' });
    } else {
      res.status(500).json({ error: 'Error creating location' });
    }
  }
});

// PUT update location
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { code, description } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    
    const result = await pool.query(
      'UPDATE locations SET code = $1, description = $2 WHERE id = $3 RETURNING *',
      [code, description, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      res.status(400).json({ error: 'Location code already exists' });
    } else {
      res.status(500).json({ error: 'Error updating location' });
    }
  }
});

// DELETE location
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM locations WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json({ message: 'Location deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting location' });
  }
});

module.exports = router;