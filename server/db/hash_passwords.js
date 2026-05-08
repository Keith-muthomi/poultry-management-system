const db = require('./database');
const bcrypt = require('bcryptjs');

/**
 * Migration: Secure Passwords
 * This script hashes all existing plain-text passwords in the database.
 * Run this once after implementing bcrypt.
 */

const SALT_ROUNDS = 10;

async function migratePasswords() {
  console.log('[Migration] Starting password hashing migration...');
  
  try {
    const users = db.prepare('SELECT id, password, secondary_password, role FROM users').all();
    
    for (const user of users) {
      const updates = [];
      const values = [];

      // Only hash if it doesn't look like a bcrypt hash (bcrypt hashes start with $2a$ or $2b$)
      if (!user.password.startsWith('$2')) {
        console.log(`[Migration] Hashing primary password for user ID ${user.id}...`);
        const hashedPrimary = await bcrypt.hash(user.password, SALT_ROUNDS);
        updates.push('password = ?');
        values.push(hashedPrimary);
      }

      if (user.role === 'Admin' && user.secondary_password && !user.secondary_password.startsWith('$2')) {
        console.log(`[Migration] Hashing secondary password for admin ID ${user.id}...`);
        const hashedSecondary = await bcrypt.hash(user.secondary_password, SALT_ROUNDS);
        updates.push('secondary_password = ?');
        values.push(hashedSecondary);
      }

      if (updates.length > 0) {
        values.push(user.id);
        const stmt = db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`);
        stmt.run(...values);
      }
    }

    console.log('[Migration] All passwords have been secured!');
  } catch (err) {
    console.error('[Migration] Error during migration:', err.message);
  }
}

migratePasswords();
