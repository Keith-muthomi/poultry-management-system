const db = require('../db/database');

const ProductionModel = {
  getAll: (farmId) => {
    return db.prepare(`
      SELECT p.*, f.name as flock_name, f.type as flock_type
      FROM production p
      JOIN flocks f ON p.flock_id = f.id
      WHERE p.farm_id = ?
      ORDER BY p.date DESC
    `).all(farmId);
  },

  getById: (id, farmId) => {
    return db.prepare('SELECT * FROM production WHERE id = ? AND farm_id = ?').get(id, farmId);
  },

  getByFlock: (flockId, farmId) => {
    return db.prepare('SELECT * FROM production WHERE flock_id = ? AND farm_id = ? ORDER BY date DESC').all(flockId, farmId);
  },

  create: (data, farmId) => {
    const { flock_id, date, egg_count, cracked_count, mortality_count, feed_consumed_kg, notes, user_id } = data;
    const stmt = db.prepare(`
      INSERT INTO production (flock_id, date, egg_count, cracked_count, mortality_count, feed_consumed_kg, notes, farm_id, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(flock_id, date, egg_count, cracked_count, mortality_count, feed_consumed_kg, notes, farmId, user_id);
  },

  update: (id, data, farmId) => {
    const { date, egg_count, cracked_count, mortality_count, feed_consumed_kg, notes } = data;
    const stmt = db.prepare(`
      UPDATE production 
      SET date = ?, egg_count = ?, cracked_count = ?, mortality_count = ?, feed_consumed_kg = ?, notes = ?
      WHERE id = ? AND farm_id = ?
    `);
    return stmt.run(date, egg_count, cracked_count, mortality_count, feed_consumed_kg, notes, id, farmId);
  },

  delete: (id, farmId) => {
    return db.prepare('DELETE FROM production WHERE id = ? AND farm_id = ?').run(id, farmId);
  }
};

module.exports = ProductionModel;
