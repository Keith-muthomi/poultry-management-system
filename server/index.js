// server/index.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, '../dist');

// Middleware
app.use(express.static(distPath));

// API Routes (Example)
app.get('/api/data', (req, res) => {
  res.json({ message: "Hello from SQLite/Express!" });
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