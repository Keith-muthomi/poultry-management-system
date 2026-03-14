const db = require('../db/database');

const ProductionModel = {
  getAll: () => {
    return db.prepare(`
      SELECT p.*, f.name as flock_name, f.type as flock_type 
      FROM production p
      JOIN flocks f ON p.flock_id = f.id
      ORDER BY p.date DESC
    `).all();
  },

  getTodayStats: () => {
    return db.prepare(`
      SELECT 
        SUM(egg_count) as total_eggs,
        SUM(mortality_count) as total_mortality,
        SUM(feed_consumed_kg) as total_feed
      FROM production 
      WHERE date = DATE('now')
    `).get();
  },

  getByFlockId: (flockId) => {
    return db.prepare('SELECT * FROM production WHERE flock_id = ? ORDER BY date DESC').all(flockId);
  },

  create: (data) => {
    const { flock_id, egg_count, cracked_count, mortality_count, feed_consumed_kg, notes } = data;
    const stmt = db.prepare(`
      INSERT INTO production (flock_id, egg_count, cracked_count, mortality_count, feed_consumed_kg, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(flock_id, egg_count, cracked_count, mortality_count, feed_consumed_kg, notes);
  },

  delete: (id) => {
    return db.prepare('DELETE FROM production WHERE id = ?').run(id);
  }
};

module.exports = ProductionModel;
