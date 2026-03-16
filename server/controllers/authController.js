const db = require('../db/database');

const AuthController = {
  login: (req, res) => {
    const { email, password } = req.body;
    try {
      const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);
      if (user) {
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid email or password' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  },

  register: (req, res) => {
    const { name, email, password } = req.body;
    try {
      const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
      const result = stmt.run(name, email, password);
      res.status(201).json({ id: result.lastInsertRowid, message: 'User registered successfully' });
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: 'Registration failed', details: err.message });
      }
    }
  }
};

module.exports = AuthController;
