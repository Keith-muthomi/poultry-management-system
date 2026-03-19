const db = require('../db/database');

const AdminController = {
  getAllUsers: (req, res) => {
    try {
      const users = db.prepare('SELECT id, name, email, role, status, farm_id, created_at FROM users').all();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch users', details: err.message });
    }
  },

  updateUserStatus: (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const stmt = db.prepare('UPDATE users SET status = ? WHERE id = ?');
      stmt.run(status, id);
      res.json({ message: `User status updated to ${status}` });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update user status', details: err.message });
    }
  },

  deleteUser: (req, res) => {
    const { id } = req.params;
    try {
      const stmt = db.prepare('DELETE FROM users WHERE id = ?');
      stmt.run(id);
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete user', details: err.message });
    }
  },

  getSystemData: (req, res) => {
    try {
      const data = {
        farms: db.prepare('SELECT * FROM farms').all(),
        users: db.prepare('SELECT id, name, email, role, status, farm_id FROM users').all(),
        flocks: db.prepare('SELECT * FROM flocks').all(),
        production: db.prepare('SELECT * FROM production').all(),
        finance: db.prepare('SELECT * FROM finance').all(),
        supplies: db.prepare('SELECT * FROM supplies').all()
      };
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to extract system data', details: err.message });
    }
  }
};

module.exports = AdminController;
