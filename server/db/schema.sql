-- Poultry Management System Schema

-- Flocks Table
CREATE TABLE IF NOT EXISTS flocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT CHECK(type IN ('Layers', 'Broilers')) NOT NULL,
  breed TEXT,
  initial_count INTEGER NOT NULL,
  current_count INTEGER NOT NULL,
  hatch_date DATE,
  pen_id TEXT,
  status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'Sold', 'Culled')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Daily Production Table (Eggs, etc.)
CREATE TABLE IF NOT EXISTS production (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  flock_id INTEGER,
  date DATE DEFAULT (DATE('now')),
  egg_count INTEGER DEFAULT 0,
  cracked_count INTEGER DEFAULT 0,
  mortality_count INTEGER DEFAULT 0,
  feed_consumed_kg REAL DEFAULT 0,
  notes TEXT,
  FOREIGN KEY (flock_id) REFERENCES flocks (id)
);

-- Mock Data (Only inserted if table is empty)
INSERT INTO flocks (name, type, breed, initial_count, current_count, hatch_date, pen_id, status)
SELECT 'Layer Batch A', 'Layers', 'Hy-Line Brown', 3200, 3200, '2023-08-15', 'Pen 03', 'Active'
WHERE NOT EXISTS (SELECT 1 FROM flocks WHERE name = 'Layer Batch A');

INSERT INTO flocks (name, type, breed, initial_count, current_count, hatch_date, pen_id, status)
SELECT 'Broiler Batch B', 'Broilers', 'Cobb 500', 4600, 4600, '2024-02-10', 'Pen 06', 'Active'
WHERE NOT EXISTS (SELECT 1 FROM flocks WHERE name = 'Broiler Batch B');

INSERT INTO flocks (name, type, breed, initial_count, current_count, hatch_date, pen_id, status)
SELECT 'Layer Batch C', 'Layers', 'Lohmann Brown', 2500, 2500, '2024-01-05', 'Pen 01', 'Active'
WHERE NOT EXISTS (SELECT 1 FROM flocks WHERE name = 'Layer Batch C');
