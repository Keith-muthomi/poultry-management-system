const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../../poultry.db');
const db = new Database(dbPath, { verbose: console.log });

// Initialize database schema
const schema = fs.readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf8');

try {
    // We use .exec() to run the schema. 
    // Because we updated schema.sql with "WHERE NOT EXISTS", it won't duplicate.
    db.exec(schema);
    console.log('[DB] Database schema initialized/checked.');
} catch (error) {
    console.error('[DB] Error initializing schema:', error.message);
}

module.exports = db;
