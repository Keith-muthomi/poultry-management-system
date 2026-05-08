-- --- POULTRYDOCS DATABASE SCHEMA ---
-- This file defines the structure of our database.
-- If you ever delete poultry.db, the system will use this file to recreate it.

-- 1. FARMS TABLE
-- Every user and flock belongs to a farm.
CREATE TABLE IF NOT EXISTS farms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  owner_name TEXT,
  location TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS TABLE
-- Stores user credentials and roles.
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  farm_id INTEGER,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  secondary_password TEXT,
  role TEXT DEFAULT 'User',
  status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'Suspended')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (farm_id) REFERENCES farms (id)
);

-- 3. FLOCKS TABLE
-- Tracks groups of birds.
CREATE TABLE IF NOT EXISTS flocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  farm_id INTEGER,
  name TEXT NOT NULL,
  type TEXT CHECK(type IN ('Layers', 'Broilers')) NOT NULL,
  breed TEXT,
  initial_count INTEGER NOT NULL,
  current_count INTEGER NOT NULL,
  hatch_date DATE,
  pen_id TEXT,
  status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'Sold', 'Culled')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (farm_id) REFERENCES farms (id)
);

-- 4. PRODUCTION TABLE
-- Daily logs for eggs and mortality.
CREATE TABLE IF NOT EXISTS production (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  farm_id INTEGER,
  flock_id INTEGER,
  date DATE DEFAULT (DATE('now')),
  egg_count INTEGER DEFAULT 0,
  cracked_count INTEGER DEFAULT 0,
  mortality_count INTEGER DEFAULT 0,
  feed_consumed_kg REAL DEFAULT 0,
  notes TEXT,
  FOREIGN KEY (flock_id) REFERENCES flocks (id),
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (farm_id) REFERENCES farms (id)
);

-- 5. SUPPLIES TABLE
-- Inventory management.
CREATE TABLE IF NOT EXISTS supplies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  farm_id INTEGER,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity REAL DEFAULT 0,
  unit TEXT,
  min_threshold REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (farm_id) REFERENCES farms (id)
);

-- 6. FINANCE TABLE
-- Income and expenses.
CREATE TABLE IF NOT EXISTS finance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  farm_id INTEGER,
  type TEXT CHECK(type IN ('Sale', 'Expense')) NOT NULL,
  category TEXT NOT NULL,
  amount REAL NOT NULL,
  description TEXT,
  date DATE DEFAULT (DATE('now')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (farm_id) REFERENCES farms (id)
);

-- 7. PROTOCOLS TABLE
-- Task management and schedules.
CREATE TABLE IF NOT EXISTS protocols (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  farm_id INTEGER,
  title TEXT NOT NULL,
  time TEXT,
  location TEXT,
  status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'Completed', 'Next Up')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (farm_id) REFERENCES farms (id)
);

-- --- SEED DATA (Test Accounts) ---
-- All passwords below are hashed with Bcrypt (Salt Rounds: 10).
-- Primary Passwords are all: 'password123' (except admin which is 'admin123')
-- Admin Secondary Key is: 'secure456'

-- 1. Seed Farms
INSERT INTO farms (name, owner_name, location)
SELECT 'PoultryDocs HQ', 'System Admin', 'Central Office'
WHERE NOT EXISTS (SELECT 1 FROM farms WHERE id = 1);

-- 2. Seed Users
INSERT INTO users (name, email, password, secondary_password, role, status, farm_id)
SELECT 'System Admin', 'admin@poultrydocs.com', '$2b$10$D8Rpb6GIC9aQzeCjb1EkVuyvO4pE7wCmArZ9lZLh2pslOIvBJJRSq', '$2b$10$hQKRWA.Lw6R9BcCeRqxuqezJwhQAo3qAVQ8aIrkZiTBZy/1unu7Hm', 'Admin', 'Active', 1
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@poultrydocs.com');

INSERT INTO users (name, email, password, role, status, farm_id)
SELECT 'Kamau Waithaka', 'kamau@poultrydocs.com', '$2b$10$RT0LK2uE85cHVImhAlqqXuOePpLc47PF0lsVSUggoW.4n947HiSvi', 'User', 'Active', 1
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'kamau@poultrydocs.com');

-- 3. Seed Initial Inventory
INSERT INTO supplies (name, category, quantity, unit, min_threshold, user_id, farm_id)
SELECT 'Starter Feed', 'Feed', 500, 'kg', 100, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM supplies WHERE name = 'Starter Feed');

-- 4. Seed Initial Tasks
INSERT INTO protocols (title, time, location, status, user_id, farm_id)
SELECT 'Morning Vaccination', '08:00 AM', 'Batch A-03', 'Completed', 1, 1
WHERE NOT EXISTS (SELECT 1 FROM protocols WHERE title = 'Morning Vaccination');
