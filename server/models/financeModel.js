const db = require('../db/database');

const FinanceModel = {
  getAll: (farmId) => {
    return db.prepare('SELECT * FROM finance WHERE farm_id = ? ORDER BY date DESC').all(farmId);
  },

  getById: (id, farmId) => {
    return db.prepare('SELECT * FROM finance WHERE id = ? AND farm_id = ?').get(id, farmId);
  },

  create: (data, farmId) => {
    const { type, category, amount, description, date, user_id } = data;
    const stmt = db.prepare(`
      INSERT INTO finance (type, category, amount, description, date, farm_id, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(type, category, amount, description, date, farmId, user_id);
  },

  update: (id, data, farmId) => {
    const { type, category, amount, description, date } = data;
    const stmt = db.prepare(`
      UPDATE finance 
      SET type = ?, category = ?, amount = ?, description = ?, date = ?
      WHERE id = ? AND farm_id = ?
    `);
    return stmt.run(type, category, amount, description, date, id, farmId);
  },

  delete: (id, farmId) => {
    return db.prepare('DELETE FROM finance WHERE id = ? AND farm_id = ?').run(id, farmId);
  },

  getSummary: (farmId) => {
    return db.prepare(`
      SELECT 
        SUM(CASE WHEN type = 'Sale' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END) as total_expenses
      FROM finance
      WHERE farm_id = ?
    `).get(farmId);
  }
};

module.exports = FinanceModel;
