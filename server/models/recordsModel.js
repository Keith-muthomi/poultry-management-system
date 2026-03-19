const db = require('../db/database');

const RecordsModel = {
  getTableData: (tableName) => {
    // Basic whitelist to prevent SQL injection since we're using dynamic table names
    const allowedTables = ['users', 'flocks', 'production', 'supplies', 'finance'];
    if (!allowedTables.includes(tableName)) {
      throw new Error('Invalid table name');
    }
    return db.prepare(`SELECT * FROM ${tableName}`).all();
  }
};

module.exports = RecordsModel;
