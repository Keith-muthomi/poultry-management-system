const db = require('../db/database');

const AuthController = {
  login: (req, res) => {
    const { email, password } = req.body;
    try {
      const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);
      if (user) {
        if (user.status === 'Suspended') {
          return res.status(403).json({ error: 'Your account has been suspended. Please contact the administrator.' });
        }
        // Return user without password
        const { password, secondary_password, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid email or password' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  },

  verifyAdminSecondary: (req, res) => {
    const { id, secondaryPassword } = req.body;
    try {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
      if (user && user.role === 'Admin' && user.secondary_password === secondaryPassword) {
        res.json({ success: true, message: 'Admin verified' });
      } else {
        res.status(401).json({ error: 'Invalid secondary password' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  },

  register: (req, res) => {
    const { name, email, password } = req.body;
    try {
      const stmt = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
      const role = (db.prepare('SELECT COUNT(*) as count FROM users').get().count === 0) ? 'Admin' : 'User';
      const result = stmt.run(name, email, password, role);
      res.status(201).json({ id: result.lastInsertRowid, message: 'User registered successfully' });
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: 'Registration failed', details: err.message });
      }
    }
  },

  updateProfile: (req, res) => {
    const { id, name, email } = req.body;
    try {
      const stmt = db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?');
      stmt.run(name, email, id);
      const user = db.prepare('SELECT id, name, email, role, status FROM users WHERE id = ?').get(id);
      res.json({ user, message: 'Profile updated successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update profile', details: err.message });
    }
  },

  updatePassword: (req, res) => {
    const { id, currentPassword, newPassword } = req.body;
    try {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
      if (user && user.password === currentPassword) {
        const stmt = db.prepare('UPDATE users SET password = ? WHERE id = ?');
        stmt.run(newPassword, id);
        res.json({ message: 'Password updated successfully' });
      } else {
        res.status(401).json({ error: 'Invalid current password' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to update password', details: err.message });
    }
  }
};

module.exports = AuthController;
