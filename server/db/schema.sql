-- This is the big list of all our tables

-- Where we keep track of people
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'User',
  status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'Suspended')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Where we keep track of our birds
CREATE TABLE IF NOT EXISTS flocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK(type IN ('Layers', 'Broilers')) NOT NULL,
  breed TEXT,
  initial_count INTEGER NOT NULL,
  current_count INTEGER NOT NULL,
  hatch_date DATE,
  pen_id TEXT,
  status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'Sold', 'Culled')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Where we write down how many eggs we got today
CREATE TABLE IF NOT EXISTS production (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  flock_id INTEGER,
  date DATE DEFAULT (DATE('now')),
  egg_count INTEGER DEFAULT 0,
  cracked_count INTEGER DEFAULT 0,
  mortality_count INTEGER DEFAULT 0,
  feed_consumed_kg REAL DEFAULT 0,
  notes TEXT,
  FOREIGN KEY (flock_id) REFERENCES flocks (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Where we keep track of our stuff
CREATE TABLE IF NOT EXISTS supplies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity REAL DEFAULT 0,
  unit TEXT,
  min_threshold REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Money coming in and going out
CREATE TABLE IF NOT EXISTS finance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT CHECK(type IN ('Sale', 'Expense')) NOT NULL,
  category TEXT NOT NULL,
  amount REAL NOT NULL,
  description TEXT,
  date DATE DEFAULT (DATE('now')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Some fake stuff for testing supplies
INSERT INTO supplies (name, category, quantity, unit, min_threshold)
SELECT 'Starter Feed', 'Feed', 500, 'kg', 100
WHERE NOT EXISTS (SELECT 1 FROM supplies WHERE name = 'Starter Feed');

INSERT INTO supplies (name, category, quantity, unit, min_threshold)
SELECT 'Newcastle Vaccine', 'Medicine', 50, 'vials', 10
WHERE NOT EXISTS (SELECT 1 FROM supplies WHERE name = 'Newcastle Vaccine');

-- Some fake stuff for testing money
INSERT INTO finance (type, category, amount, description, date)
SELECT 'Sale', 'Eggs', 1200, 'Sold 100 trays of eggs', '2024-03-10'
WHERE NOT EXISTS (SELECT 1 FROM finance WHERE description = 'Sold 100 trays of eggs');

-- Things we need to do
CREATE TABLE IF NOT EXISTS protocols (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  time TEXT,
  location TEXT,
  status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'Completed', 'Next Up')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Some fake stuff for testing tasks
INSERT INTO protocols (title, time, location, status)
SELECT 'Morning Vaccination', '08:00 AM', 'Batch A-03', 'Completed'
WHERE NOT EXISTS (SELECT 1 FROM protocols WHERE title = 'Morning Vaccination');

INSERT INTO protocols (title, time, location, status)
SELECT 'Feed Refill', '02:00 PM', 'All Pens', 'Next Up'
WHERE NOT EXISTS (SELECT 1 FROM protocols WHERE title = 'Feed Refill');

-- Some fake people to test logging in
INSERT INTO users (name, email, password, role, status)
SELECT 'System Admin', 'admin@poultrydocs.com', 'admin123', 'Admin', 'Active'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@poultrydocs.com');

INSERT INTO users (name, email, password, role, status)
SELECT 'John Farm Manager', 'john@poultrydocs.com', 'password123', 'User', 'Active'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'john@poultrydocs.com');

INSERT INTO users (name, email, password, role, status)
SELECT 'Sarah Records', 'sarah@poultrydocs.com', 'password123', 'User', 'Active'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'sarah@poultrydocs.com');

INSERT INTO users (name, email, password, role, status)
SELECT 'Michael Finance', 'michael@poultrydocs.com', 'password123', 'User', 'Active'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'michael@poultrydocs.com');

INSERT INTO users (name, email, password, role, status)
SELECT 'David Suspended', 'david@poultrydocs.com', 'password123', 'User', 'Suspended'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'david@poultrydocs.com');
