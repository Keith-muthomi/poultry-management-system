const db = require('../db/database');

const ProtocolModel = {
  getAll: () => {
    return db.prepare('SELECT * FROM protocols ORDER BY created_at DESC').all();
  },

  create: (data) => {
    const { title, time, location, status } = data;
    const stmt = db.prepare('INSERT INTO protocols (title, time, location, status) VALUES (?, ?, ?, ?)');
    return stmt.run(title, time, location, status || 'Pending');
  },

  delete: (id) => {
    return db.prepare('DELETE FROM protocols WHERE id = ?').run(id);
  }
};

module.exports = ProtocolModel;
