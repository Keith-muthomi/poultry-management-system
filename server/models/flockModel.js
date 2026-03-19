const db = require('../db/database');

const FlockModel = {
  getAll: (farmId) => {
    return db.prepare(`
      SELECT 
        f.*,
        COALESCE(SUM(p.egg_count), 0) as total_production,
        COALESCE(SUM(p.feed_consumed_kg), 0) as total_consumption,
        COALESCE(SUM(p.mortality_count), 0) as total_mortality_recorded
      FROM flocks f
      LEFT JOIN production p ON f.id = p.flock_id
      WHERE f.farm_id = ?
      GROUP BY f.id
      ORDER BY f.created_at DESC
    `).all(farmId);
  },

  getById: (id, farmId) => {
    return db.prepare('SELECT * FROM flocks WHERE id = ? AND farm_id = ?').get(id, farmId);
  },

  create: (data, farmId) => {
    const { name, type, breed, count, hatch_date, pen_id, user_id } = data;
    const stmt = db.prepare(`
      INSERT INTO flocks (name, type, breed, initial_count, current_count, hatch_date, pen_id, farm_id, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(name, type, breed, count, count, hatch_date, pen_id, farmId, user_id);
  },

  update: (id, data, farmId) => {
    const { name, type, breed, current_count, hatch_date, pen_id, status } = data;
    const stmt = db.prepare(`
      UPDATE flocks 
      SET name = ?, type = ?, breed = ?, current_count = ?, hatch_date = ?, pen_id = ?, status = ?
      WHERE id = ? AND farm_id = ?
    `);
    return stmt.run(name, type, breed, current_count, hatch_date, pen_id, status, id, farmId);
  },

  delete: (id, farmId) => {
    return db.prepare('DELETE FROM flocks WHERE id = ? AND farm_id = ?').run(id, farmId);
  }
};

module.exports = FlockModel;
