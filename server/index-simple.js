import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Configure dotenv
dotenv.config();

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

// Basic API routes (fallback)
app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Usuario Demo', email: 'demo@taskmanager.com' }
  ]);
});

app.get('/api/activities', (req, res) => {
  res.json([
    { id: 1, name: 'Guadaña', requiresLocation: true },
    { id: 2, name: 'Riego', requiresLocation: true },
    { id: 3, name: 'Barrido', requiresLocation: true },
    { id: 4, name: 'Servicios', requiresLocation: false }
  ]);
});

app.get('/api/locations', (req, res) => {
  res.json([
    { id: 1, name: 'A01', area: 'A' },
    { id: 2, name: 'A02', area: 'A' },
    { id: 3, name: 'B01', area: 'B' }
  ]);
});

app.get('/api/assignments', (req, res) => {
  res.json([]);
});

app.get('/api/history', (req, res) => {
  res.json([]);
});

app.get('/api/dashboard', (req, res) => {
  res.json({
    totalAssignments: 0,
    completedAssignments: 0,
    pendingAssignments: 0,
    absences: 0
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    port: PORT,
    message: 'TaskManager API is running successfully!'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'TaskManager API',
    version: '1.0.0',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      users: '/api/users',
      activities: '/api/activities',
      locations: '/api/locations',
      assignments: '/api/assignments',
      history: '/api/history',
      dashboard: '/api/dashboard'
    },
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to TaskManager API',
    status: 'running',
    version: '1.0.0',
    docs: '/api',
    health: '/health'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    availableEndpoints: ['/health', '/api', '/api/users', '/api/activities'],
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 TaskManager Server running!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔗 Health check: http://localhost:${PORT}/health
📚 API info: http://localhost:${PORT}/api
🎯 Ready for production!
  `);
});

export default app;