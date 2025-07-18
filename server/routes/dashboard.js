const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET dashboard overview
router.get('/', async (req, res) => {
  try {
    const { date = new Date().toISOString().split('T')[0] } = req.query;
    
    // Get today's assignments summary
    const assignmentsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_assignments,
        COUNT(CASE WHEN completed = true THEN 1 END) as completed_assignments,
        COUNT(CASE WHEN completed = false THEN 1 END) as pending_assignments
      FROM daily_assignments
      WHERE assigned_date = $1
    `, [date]);
    
    // Get activity distribution for today
    const activityResult = await pool.query(`
      SELECT 
        a.name as activity_name,
        COUNT(*) as count,
        COUNT(CASE WHEN da.completed = true THEN 1 END) as completed
      FROM daily_assignments da
      JOIN activities a ON da.activity_id = a.id
      WHERE da.assigned_date = $1
      GROUP BY a.id, a.name
      ORDER BY a.name
    `, [date]);
    
    // Get user performance for today
    const userResult = await pool.query(`
      SELECT 
        u.name as user_name,
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN da.completed = true THEN 1 END) as completed_tasks
      FROM daily_assignments da
      JOIN users u ON da.user_id = u.id
      WHERE da.assigned_date = $1
      GROUP BY u.id, u.name
      ORDER BY u.name
    `, [date]);
    
    // Get absences for today
    const absenceResult = await pool.query(`
      SELECT COUNT(*) as absent_count
      FROM absences
      WHERE date = $1
    `, [date]);
    
    res.json({
      date,
      summary: assignmentsResult.rows[0],
      activities: activityResult.rows,
      users: userResult.rows,
      absences: absenceResult.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching dashboard data' });
  }
});

// GET location progress report
router.get('/location-progress', async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month || (currentDate.getMonth() + 1);
    const targetYear = year || currentDate.getFullYear();
    
    // Get all locations
    const locationsResult = await pool.query('SELECT * FROM locations ORDER BY code');
    
    // Get all activities except "Servicios"
    const activitiesResult = await pool.query(`
      SELECT * FROM activities 
      WHERE name != 'Servicios' AND requires_location = true
      ORDER BY name
    `);
    
    const locationProgress = [];
    
    for (const location of locationsResult.rows) {
      const locationData = {
        location_code: location.code,
        location_description: location.description,
        activities: []
      };
      
      for (const activity of activitiesResult.rows) {
        // Count how many times this activity was completed at this location in the target month
        const completedResult = await pool.query(`
          SELECT COUNT(*) as completed_count
          FROM activity_history ah
          WHERE ah.location_id = $1 
            AND ah.activity_id = $2
            AND ah.completed = true
            AND EXTRACT(MONTH FROM ah.date) = $3
            AND EXTRACT(YEAR FROM ah.date) = $4
        `, [location.id, activity.id, targetMonth, targetYear]);
        
        // Get the total expected times (this could be configurable)
        // For now, let's assume each activity should be done at least once per month
        const expectedCount = 1;
        const completedCount = parseInt(completedResult.rows[0].completed_count);
        
        locationData.activities.push({
          activity_name: activity.name,
          activity_id: activity.id,
          completed_count: completedCount,
          expected_count: expectedCount,
          progress_percentage: Math.min((completedCount / expectedCount) * 100, 100),
          status: completedCount >= expectedCount ? 'completed' : 'pending'
        });
      }
      
      locationProgress.push(locationData);
    }
    
    res.json({
      month: targetMonth,
      year: targetYear,
      locations: locationProgress
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching location progress' });
  }
});

// GET activity summary by location
router.get('/activity-summary', async (req, res) => {
  try {
    const { activity_id, month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month || (currentDate.getMonth() + 1);
    const targetYear = year || currentDate.getFullYear();
    
    if (!activity_id) {
      return res.status(400).json({ error: 'Activity ID is required' });
    }
    
    // Get activity details
    const activityResult = await pool.query('SELECT * FROM activities WHERE id = $1', [activity_id]);
    if (activityResult.rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    const activity = activityResult.rows[0];
    
    // Get all locations
    const locationsResult = await pool.query('SELECT * FROM locations ORDER BY code');
    
    const locationSummary = [];
    
    for (const location of locationsResult.rows) {
      // Count completed activities at this location
      const completedResult = await pool.query(`
        SELECT 
          COUNT(*) as completed_count,
          COUNT(DISTINCT ah.date) as unique_days
        FROM activity_history ah
        WHERE ah.location_id = $1 
          AND ah.activity_id = $2
          AND ah.completed = true
          AND EXTRACT(MONTH FROM ah.date) = $3
          AND EXTRACT(YEAR FROM ah.date) = $4
      `, [location.id, activity_id, targetMonth, targetYear]);
      
      const completedCount = parseInt(completedResult.rows[0].completed_count);
      const uniqueDays = parseInt(completedResult.rows[0].unique_days);
      
      locationSummary.push({
        location_code: location.code,
        location_description: location.description,
        completed_count: completedCount,
        unique_days: uniqueDays,
        last_completed: null // Could add this if needed
      });
    }
    
    res.json({
      activity: activity,
      month: targetMonth,
      year: targetYear,
      locations: locationSummary
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching activity summary' });
  }
});

// GET monthly statistics
router.get('/monthly-stats', async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month || (currentDate.getMonth() + 1);
    const targetYear = year || currentDate.getFullYear();
    
    // Get total activities completed
    const totalResult = await pool.query(`
      SELECT COUNT(*) as total_completed
      FROM activity_history
      WHERE completed = true
        AND EXTRACT(MONTH FROM date) = $1
        AND EXTRACT(YEAR FROM date) = $2
    `, [targetMonth, targetYear]);
    
    // Get activities by type
    const activityBreakdown = await pool.query(`
      SELECT 
        a.name as activity_name,
        COUNT(*) as count
      FROM activity_history ah
      JOIN activities a ON ah.activity_id = a.id
      WHERE ah.completed = true
        AND EXTRACT(MONTH FROM ah.date) = $1
        AND EXTRACT(YEAR FROM ah.date) = $2
      GROUP BY a.id, a.name
      ORDER BY count DESC
    `, [targetMonth, targetYear]);
    
    // Get user performance
    const userPerformance = await pool.query(`
      SELECT 
        u.name as user_name,
        COUNT(*) as tasks_completed,
        COUNT(DISTINCT ah.date) as active_days
      FROM activity_history ah
      JOIN users u ON ah.user_id = u.id
      WHERE ah.completed = true
        AND EXTRACT(MONTH FROM ah.date) = $1
        AND EXTRACT(YEAR FROM ah.date) = $2
      GROUP BY u.id, u.name
      ORDER BY tasks_completed DESC
    `, [targetMonth, targetYear]);
    
    // Get absence count
    const absenceCount = await pool.query(`
      SELECT COUNT(*) as total_absences
      FROM absences
      WHERE EXTRACT(MONTH FROM date) = $1
        AND EXTRACT(YEAR FROM date) = $2
    `, [targetMonth, targetYear]);
    
    res.json({
      month: targetMonth,
      year: targetYear,
      total_completed: parseInt(totalResult.rows[0].total_completed),
      activity_breakdown: activityBreakdown.rows,
      user_performance: userPerformance.rows,
      total_absences: parseInt(absenceCount.rows[0].total_absences)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching monthly statistics' });
  }
});

module.exports = router;