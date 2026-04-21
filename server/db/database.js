const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../../poultry.db');
const db = new Database(dbPath, { verbose: console.log });

// Getting the database ready to use
const schema = fs.readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf8');

try {
    // Run all the SQL commands in our schema file
    // We use "WHERE NOT EXISTS" so it doesn't try to add things that are already there
    db.exec(schema);
    console.log('[DB] Database schema initialized/checked.');
} catch (error) {
    console.error('[DB] Error initializing schema:', error.message);
}

module.exports = db;
