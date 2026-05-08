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

const app = express();
// Priority: 1. Environment variable, 2. Default to 3000
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, '../dist');

// Setting up the tools we need
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // For dev flexibility
      "img-src": ["'self'", "data:", "blob:"],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    },
  },
}));
app.use(cors());
app.use(express.json()); // We need this so the server can read the data we send it
// Show the files we built with Vite
app.use(express.static(distPath));

// Here are all our api paths
app.use('/api/flocks', flockRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/protocols', protocolRoutes);
app.use('/api/admin', adminRoutes);

// Just to check if the server is actually alive
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "Server is running with modular routes!" });
});

// Send everything else to the index.html so the client-side router can handle it
// This is the "catch-all" route for Single Page Applications
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
