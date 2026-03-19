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

// For existing mock data, let's assign them to the first user (System Admin usually)
// System Admin ID is 1
console.log('Migration complete');
process.exit(0);
