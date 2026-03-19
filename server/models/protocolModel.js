const db = require('../db/database');

const ProtocolModel = {
  getAll: (farmId) => {
    return db.prepare('SELECT * FROM protocols WHERE farm_id = ? ORDER BY created_at DESC').all(farmId);
  },

  create: (data, farmId) => {
    const { title, time, location, status, user_id } = data;
    const stmt = db.prepare(`
      INSERT INTO protocols (title, time, location, status, farm_id, user_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(title, time, location, status, farmId, user_id);
  },

  update: (id, data, farmId) => {
    const { title, time, location, status } = data;
    const stmt = db.prepare(`
      UPDATE protocols 
      SET title = ?, time = ?, location = ?, status = ?
      WHERE id = ? AND farm_id = ?
    `);
    return stmt.run(title, time, location, status, id, farmId);
  },

  delete: (id, farmId) => {
    return db.prepare('DELETE FROM protocols WHERE id = ? AND farm_id = ?').run(id, farmId);
  }
};

module.exports = ProtocolModel;
