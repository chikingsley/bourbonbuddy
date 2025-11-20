// Database schema initialization

export const createTablesSQL = `
-- Create bourbons table
CREATE TABLE IF NOT EXISTS bourbons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  distillery TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('bourbon', 'rye', 'wheat', 'malt', 'blend')),
  proof REAL NOT NULL,
  age_statement TEXT,
  msrp REAL,
  rarity TEXT DEFAULT 'common' CHECK(rarity IN ('common', 'uncommon', 'rare', 'allocated')),
  description TEXT,
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bourbon_id INTEGER NOT NULL,
  purchase_date TEXT,
  purchase_price REAL,
  purchase_location TEXT,
  notes TEXT,
  rating INTEGER CHECK(rating >= 1 AND rating <= 5),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bourbon_id) REFERENCES bourbons(id) ON DELETE CASCADE,
  UNIQUE(bourbon_id)
);

-- Create index on bourbon name for searching
CREATE INDEX IF NOT EXISTS idx_bourbons_name ON bourbons(name);
CREATE INDEX IF NOT EXISTS idx_bourbons_distillery ON bourbons(distillery);
CREATE INDEX IF NOT EXISTS idx_collections_bourbon_id ON collections(bourbon_id);
`;
