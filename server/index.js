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

// Routes - Dynamic imports for ES modules
const setupRoutes = async () => {
  try {
    const { default: usersRouter } = await import('./routes/users.js');
    const { default: activitiesRouter } = await import('./routes/activities.js');
    const { default: locationsRouter } = await import('./routes/locations.js');
    const { default: assignmentsRouter } = await import('./routes/assignments.js');
    const { default: historyRouter } = await import('./routes/history.js');
    const { default: dashboardRouter } = await import('./routes/dashboard.js');

    app.use('/api/users', usersRouter);
    app.use('/api/activities', activitiesRouter);
    app.use('/api/locations', locationsRouter);
    app.use('/api/assignments', assignmentsRouter);
    app.use('/api/history', historyRouter);
    app.use('/api/dashboard', dashboardRouter);
  } catch (error) {
    console.error('Error setting up routes:', error);
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'TaskManager API',
    version: '1.0.0',
    description: 'API para gestión de actividades diarias',
    endpoints: {
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
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
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