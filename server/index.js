// This is the main file for our server
require('dotenv').config(); // Load variables from .env file
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const flockRoutes = require('./routes/flocks');
const productionRoutes = require('./routes/production');
const authRoutes = require('./routes/auth');
const financeRoutes = require('./routes/finance');
const recordsRoutes = require('./routes/records');
const protocolRoutes = require('./routes/protocols');
const adminRoutes = require('./routes/admin');
const authMiddleware = require('./middleware/auth');

const app = express();
// Priority: 1. Environment variable, 2. Default to 3000
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, '../dist');

// 1. HELMET FIRST
const isProduction = process.env.NODE_ENV === 'production';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "connect-src": ["'self'", "https://poultry-management-system-9b6t.onrender.com"],
      "script-src": ["'self'", "'unsafe-inline'"], // Allows your Vite chunks to run
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      "img-src": ["'self'", "data:", "blob:"],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
    },
  },
}));

// 2. STATIC FILES (Move this ABOVE the routes)
// This ensures that when the browser asks for /assets/..., it finds them.
app.use(express.static(distPath));

// 3. MIDDLEWARE & API ROUTES
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || !isProduction) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json()); // We need this so the server can read the data we send it

// Auth routes must NOT be behind the authMiddleware
app.use('/api/auth', authRoutes);

// Protection for everything else
app.use('/api', authMiddleware);

// Here are all our api paths
app.use('/api/flocks', flockRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/protocols', protocolRoutes);
app.use('/api/admin', adminRoutes);

// Just to check if the server is actually alive
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "Server is running with modular routes!" });
});

// 4. THE CATCH-ALL (MUST BE THE VERY LAST ROUTE)
// Using app.use for the catch-all to avoid Express 5 string path parsing issues
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
