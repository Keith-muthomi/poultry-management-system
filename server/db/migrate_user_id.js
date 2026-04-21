const db = require('./database');

const tables = ['flocks', 'production', 'supplies', 'finance', 'protocols'];

tables.forEach(table => {
  try {
    db.exec(`ALTER TABLE ${table} ADD COLUMN user_id INTEGER DEFAULT 1`);
    console.log(`Added user_id to ${table}`);
  } catch (e) {
    console.log(`Could not add user_id to ${table} (maybe already exists): ${e.message}`);
  }
});

// Give all the old data to the first user since we need someone to own it
// The boss user usually has ID 1
console.log('Migration complete');
process.exit(0);
