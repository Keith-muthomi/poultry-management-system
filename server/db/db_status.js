const Database = require('better-sqlite3');
const path = require('path');

/**
 * DB Status Utility
 * Provides a summarized view of the database content for debugging 
 * without flooding the terminal with raw records.
 */

const dbPath = path.resolve(__dirname, '../../', process.env.DB_PATH || 'poultry.db');
const db = new Database(dbPath, { readonly: true });

function getSummary() {
    console.log('\n📊 --- POULTRYDOCS DATABASE SUMMARY ---');
    console.log(`📍 DB Path: ${dbPath}`);
    console.log(`🌐 Server Port: ${process.env.PORT || 3000}`);
    console.log('----------------------------------------');

    const tables = ['users', 'flocks', 'production', 'supplies', 'finance', 'protocols'];
    
    tables.forEach(table => {
        try {
            const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get().count;
            
            let extraInfo = '';
            if (table === 'flocks') {
                const active = db.prepare("SELECT COUNT(*) as count FROM flocks WHERE status = 'Active'").get().count;
                extraInfo = ` (${active} active)`;
            } else if (table === 'finance') {
                const total = db.prepare("SELECT SUM(amount) as sum FROM finance").get().sum || 0;
                extraInfo = ` (Total Volume: $${total.toFixed(2)})`;
            } else if (table === 'users') {
                const roles = db.prepare("SELECT role, COUNT(*) as count FROM users GROUP BY role").all();
                extraInfo = ` [${roles.map(r => `${r.role}s: ${r.count}`).join(', ')}]`;
            }

            console.log(`✅ ${table.padEnd(12)}: ${count.toString().padStart(3)} records${extraInfo}`);
        } catch (err) {
            console.log(`❌ ${table.padEnd(12)}: Table not found or error.`);
        }
    });

    console.log('----------------------------------------');
    console.log(`🕒 Generated at: ${new Date().toLocaleString()}`);
    console.log('----------------------------------------\n');
}

try {
    getSummary();
} catch (error) {
    console.error('Error reading database:', error.message);
} finally {
    db.close();
}
