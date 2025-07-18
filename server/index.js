import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configure dotenv
dotenv.config();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Change this to your production domain
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Dynamic route imports
const setupRoutes = async () => {
  try {
    const usersRoutes = await import('./routes/users.js');
    const activitiesRoutes = await import('./routes/activities.js');
    const locationsRoutes = await import('./routes/locations.js');
    const assignmentsRoutes = await import('./routes/assignments.js');
    const historyRoutes = await import('./routes/history.js');
    const dashboardRoutes = await import('./routes/dashboard.js');

    app.use('/api/users', usersRoutes.default);
    app.use('/api/activities', activitiesRoutes.default);
    app.use('/api/locations', locationsRoutes.default);
    app.use('/api/assignments', assignmentsRoutes.default);
    app.use('/api/history', historyRoutes.default);
    app.use('/api/dashboard', dashboardRoutes.default);
  } catch (error) {
    console.error('Error loading routes:', error);
    // Fallback: create basic routes if files don't exist
    app.get('/api/users', (req, res) => res.json([]));
    app.get('/api/activities', (req, res) => res.json([]));
    app.get('/api/locations', (req, res) => res.json([]));
    app.get('/api/assignments', (req, res) => res.json([]));
    app.get('/api/history', (req, res) => res.json([]));
    app.get('/api/dashboard', (req, res) => res.json({}));
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'TaskManager API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: '/api/users',
      activities: '/api/activities',
      locations: '/api/locations',
      assignments: '/api/assignments',
      history: '/api/history',
      dashboard: '/api/dashboard'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Start server
const startServer = async () => {
  try {
    await setupRoutes();
    
    app.listen(PORT, () => {
      console.log(`
🚀 TaskManager Server running!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔗 Health check: http://localhost:${PORT}/health
📚 API info: http://localhost:${PORT}/api
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();