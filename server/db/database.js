const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Load env if not already loaded (useful for standalone scripts)
require('dotenv').config();

// Priority: 1. DB_PATH env, 2. Default filename in root
const dbName = process.env.DB_PATH || 'poultry.db';
const dbPath = path.isAbsolute(dbName) ? dbName : path.resolve(__dirname, '../../', dbName);

const db = new Database(dbPath); // Removed verbose logging

// Getting the database ready to use
const schema = fs.readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf8');

try {
    // Run all the SQL commands in our schema file
    db.exec(schema);
    console.log('[DB] Database initialized successfully.');
    
    // Show a quick summary of the data we have
    const usersCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const flocksCount = db.prepare('SELECT COUNT(*) as count FROM flocks').get().count;
    console.log(`[DB] Current state: ${usersCount} Users, ${flocksCount} Flocks recorded.`);
} catch (error) {
    console.error('[DB] Error initializing schema:', error.message);
}

module.exports = db;
