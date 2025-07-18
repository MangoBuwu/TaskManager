import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://taskmanager-1-0s7m.onrender.com', 'https://yourdomain.com']
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'],
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
app.use('/api', limiter);

// Serve static files from client build
const clientBuildPath = join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// API Routes
app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Juan Pérez', email: 'juan@taskmanager.com', role: 'Responsable' },
    { id: 2, name: 'María García', email: 'maria@taskmanager.com', role: 'Responsable' },
    { id: 3, name: 'Carlos López', email: 'carlos@taskmanager.com', role: 'Responsable' },
    { id: 4, name: 'Ana Martínez', email: 'ana@taskmanager.com', role: 'Responsable' }
  ]);
});

app.get('/api/activities', (req, res) => {
  res.json([
    { id: 1, name: 'Guadaña', requiresLocation: true, description: 'Corte de césped y maleza' },
    { id: 2, name: 'Riego', requiresLocation: true, description: 'Riego de plantas y áreas verdes' },
    { id: 3, name: 'Barrido', requiresLocation: true, description: 'Limpieza y barrido de áreas' },
    { id: 4, name: 'Servicios', requiresLocation: false, description: 'Servicios generales y mantenimiento' }
  ]);
});

app.get('/api/locations', (req, res) => {
  const locations = [];
  // Generate locations A01-A16
  for (let i = 1; i <= 16; i++) {
    locations.push({ id: i, name: `A${i.toString().padStart(2, '0')}`, area: 'A' });
  }
  // Generate locations B01-B08
  for (let i = 1; i <= 8; i++) {
    locations.push({ id: i + 16, name: `B${i.toString().padStart(2, '0')}`, area: 'B' });
  }
  // Generate locations C01-C05
  for (let i = 1; i <= 5; i++) {
    locations.push({ id: i + 24, name: `C${i.toString().padStart(2, '0')}`, area: 'C' });
  }
  // Generate locations D01-D04
  for (let i = 1; i <= 4; i++) {
    locations.push({ id: i + 29, name: `D${i.toString().padStart(2, '0')}`, area: 'D' });
  }
  // Generate locations E01-E02
  for (let i = 1; i <= 2; i++) {
    locations.push({ id: i + 33, name: `E${i.toString().padStart(2, '0')}`, area: 'E' });
  }
  // Generate locations F01-F03
  for (let i = 1; i <= 3; i++) {
    locations.push({ id: i + 35, name: `F${i.toString().padStart(2, '0')}`, area: 'F' });
  }
  res.json(locations);
});

app.get('/api/assignments', (req, res) => {
  res.json([
    {
      id: 1,
      userId: 1,
      activityId: 1,
      locationId: 1,
      date: new Date().toISOString().split('T')[0],
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      userId: 2,
      activityId: 2,
      locationId: 2,
      date: new Date().toISOString().split('T')[0],
      completed: true,
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
  ]);
});

app.get('/api/history', (req, res) => {
  res.json([
    {
      id: 1,
      userId: 1,
      userName: 'Juan Pérez',
      activityId: 1,
      activityName: 'Guadaña',
      locationId: 1,
      locationName: 'A01',
      date: new Date().toISOString().split('T')[0],
      completed: true,
      completedAt: new Date().toISOString()
    }
  ]);
});

app.get('/api/dashboard', (req, res) => {
  res.json({
    totalAssignments: 12,
    completedAssignments: 8,
    pendingAssignments: 4,
    absences: 1,
    activities: [
      { name: 'Guadaña', completed: 3, total: 4 },
      { name: 'Riego', completed: 2, total: 3 },
      { name: 'Barrido', completed: 2, total: 3 },
      { name: 'Servicios', completed: 1, total: 2 }
    ],
    users: [
      { name: 'Juan Pérez', completed: 3, total: 4 },
      { name: 'María García', completed: 2, total: 3 },
      { name: 'Carlos López', completed: 2, total: 3 },
      { name: 'Ana Martínez', completed: 1, total: 2 }
    ]
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    port: PORT,
    message: 'TaskManager API is running successfully!',
    frontend: 'Serving React App',
    backend: 'API Ready'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'TaskManager API',
    version: '1.0.0',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    frontend: 'React + TypeScript + Tailwind CSS',
    backend: 'Node.js + Express',
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

// Handle React Router - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/') || req.path === '/health') {
    return res.status(404).json({ 
      error: 'API endpoint not found',
      path: req.originalUrl,
      availableEndpoints: ['/health', '/api', '/api/users', '/api/activities', '/api/locations', '/api/assignments', '/api/history', '/api/dashboard'],
      timestamp: new Date().toISOString()
    });
  }
  
  // Serve React app for all other routes
  res.sendFile(join(clientBuildPath, 'index.html'));
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

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 TaskManager Full-Stack App running!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🎨 Frontend: React + TypeScript + Tailwind CSS
🔧 Backend: Node.js + Express API
🔗 Health check: http://localhost:${PORT}/health
📚 API info: http://localhost:${PORT}/api
🌐 Web App: http://localhost:${PORT}
🎯 Ready for production!
  `);
});

export default app;