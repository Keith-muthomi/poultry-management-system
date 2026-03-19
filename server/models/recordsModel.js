const db = require('../db/database');

const RecordsModel = {
  // Supplies
  getAllSupplies: (farmId) => {
    return db.prepare('SELECT * FROM supplies WHERE farm_id = ? ORDER BY name ASC').all(farmId);
  },

  createSupply: (data, farmId) => {
    const { name, category, quantity, unit, min_threshold, user_id } = data;
    const stmt = db.prepare(`
      INSERT INTO supplies (name, category, quantity, unit, min_threshold, farm_id, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(name, category, quantity, unit, min_threshold, farmId, user_id);
  },

  updateSupply: (id, data, farmId) => {
    const { name, category, quantity, unit, min_threshold } = data;
    const stmt = db.prepare(`
      UPDATE supplies 
      SET name = ?, category = ?, quantity = ?, unit = ?, min_threshold = ?
      WHERE id = ? AND farm_id = ?
    `);
    return stmt.run(name, category, quantity, unit, min_threshold, id, farmId);
  },

  deleteSupply: (id, farmId) => {
    return db.prepare('DELETE FROM supplies WHERE id = ? AND farm_id = ?').run(id, farmId);
  }
};

module.exports = RecordsModel;
