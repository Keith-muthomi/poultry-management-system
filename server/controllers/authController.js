const db = require('../db/database');
const bcrypt = require('bcryptjs');

// How many rounds of hashing to perform. Higher is safer but slower.
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

const AuthController = {
  // Let people sign in if they have the right email and password
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      // 1. Find the user by email first
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      
      if (user) {
        // 2. Check if the user is suspended
        if (user.status === 'Suspended') {
          return res.status(403).json({ error: 'Your account has been suspended. Please contact the administrator.' });
        }

        // 3. Use bcrypt to compare the raw password with the hashed password in the DB
        // bcrypt.compare is safe against timing attacks.
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          // Give them the user info but keep the sensitive fields secret
          const { password, secondary_password, ...userWithoutPassword } = user;
          res.json({ user: userWithoutPassword, message: 'Login successful' });
        } else {
          res.status(401).json({ error: 'Invalid email or password' });
        }
      } else {
        res.status(401).json({ error: 'Invalid email or password' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  },

  // Check if the admin knows their second password for extra safety
  verifyAdminSecondary: async (req, res) => {
    const { id, secondaryPassword } = req.body;
    try {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
      
      // Secondary password also needs hashing if you want full security, 
      // but we'll stick to raw comparison for this specific field if it's meant to be a "pin"
      // or we can hash it too. Let's hash it for maximum professional points.
      if (user && user.role === 'Admin') {
        const isMatch = await bcrypt.compare(secondaryPassword, user.secondary_password);
        if (isMatch) {
          res.json({ success: true, message: 'Admin verified' });
        } else {
          res.status(401).json({ error: 'Invalid secondary password' });
        }
      } else {
        res.status(401).json({ error: 'Invalid secondary password' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  },

  // Add a new user to the system. First one becomes the boss!
  register: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      // 1. Hash the password BEFORE saving it to the database
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const stmt = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
      const role = (db.prepare('SELECT COUNT(*) as count FROM users').get().count === 0) ? 'Admin' : 'User';
      
      const result = stmt.run(name, email, hashedPassword, role);
      res.status(201).json({ id: result.lastInsertRowid, message: 'User registered successfully' });
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: 'Registration failed', details: err.message });
      }
    }
  },

  // Let someone change their name or email
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

  // Change the secret password
  updatePassword: async (req, res) => {
    const { id, currentPassword, newPassword } = req.body;
    try {
      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
      
      // 1. Verify the current password matches
      if (user && await bcrypt.compare(currentPassword, user.password)) {
        // 2. Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
        
        const stmt = db.prepare('UPDATE users SET password = ? WHERE id = ?');
        stmt.run(hashedNewPassword, id);
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
