// server/index.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const flockRoutes = require('./routes/flocks');
const productionRoutes = require('./routes/production');

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, '../dist');

// Middleware
app.use(cors());
app.use(express.json()); // Essential for parsing JSON bodies
app.use(express.static(distPath));

// API Routes
app.use('/api/flocks', flockRoutes);
app.use('/api/production', productionRoutes);

// Example fallback/debug route
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "Server is running with modular routes!" });
});

// Serve static files from the Vite build folder (dist)
app.use(express.static(path.join(__dirname, '../dist')));

// THE SPA FIX: Redirect all other requests to index.html
app.get('/*path', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
