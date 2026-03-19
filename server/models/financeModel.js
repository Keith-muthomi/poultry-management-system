const db = require('../db/database');

const FinanceModel = {
  getAll: () => {
    return db.prepare('SELECT * FROM finance ORDER BY date DESC').all();
  },

  getById: (id) => {
    return db.prepare('SELECT * FROM finance WHERE id = ?').get(id);
  },

  create: (data) => {
    const { type, category, amount, description, date } = data;
    const stmt = db.prepare(`
      INSERT INTO finance (type, category, amount, description, date)
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(type, category, amount, description, date || new Date().toISOString().split('T')[0]);
  },

  update: (id, data) => {
    const { type, category, amount, description, date } = data;
    const stmt = db.prepare(`
      UPDATE finance 
      SET type = ?, category = ?, amount = ?, description = ?, date = ?
      WHERE id = ?
    `);
    return stmt.run(type, category, amount, description, date, id);
  },

  delete: (id) => {
    return db.prepare('DELETE FROM finance WHERE id = ?').run(id);
  }
};

module.exports = FinanceModel;
