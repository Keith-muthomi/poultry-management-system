const db = require('./database');

try {
  db.exec("ALTER TABLE users ADD COLUMN secondary_password TEXT");
  db.exec("UPDATE users SET secondary_password = 'secure456' WHERE role = 'Admin'");
  console.log('Added secondary_password column and updated admin');
} catch (e) {
  console.log('Database modification error (maybe already exists): ' + e.message);
}
