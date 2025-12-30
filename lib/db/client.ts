import * as SQLite from 'expo-sqlite';
import { createTablesSQL } from './schema';
import { getSeedSQL } from './seed';

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;

  try {
    db = await SQLite.openDatabaseAsync('bourbonbuddy.db');

    // Create tables
    await db.execAsync(createTablesSQL);

    // Check if we need to seed data
    const result = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM bourbons');

    if (result && result.count === 0) {
      console.log('Seeding database with bourbon data...');
      await db.execAsync(getSeedSQL());
      console.log('Database seeded successfully!');
    }

    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

// Bourbon queries
export interface Bourbon {
  id: number;
  name: string;
  distillery: string;
  type: 'bourbon' | 'rye' | 'wheat' | 'malt' | 'blend';
  proof: number;
  age_statement?: string;
  msrp?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'allocated';
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: number;
  bourbon_id: number;
  purchase_date?: string;
  purchase_price?: number;
  purchase_location?: string;
  notes?: string;
  rating?: number;
  created_at: string;
}

export interface BourbonWithCollection extends Bourbon {
  in_collection: boolean;
  collection_id?: number;
  collection_notes?: string;
  collection_rating?: number;
}

export const getAllBourbons = async (): Promise<Bourbon[]> => {
  const database = getDatabase();
  return await database.getAllAsync<Bourbon>('SELECT * FROM bourbons ORDER BY name ASC');
};

export const getBourbonById = async (id: number): Promise<Bourbon | null> => {
  const database = getDatabase();
  return await database.getFirstAsync<Bourbon>('SELECT * FROM bourbons WHERE id = ?', [id]);
};

export const searchBourbons = async (query: string): Promise<Bourbon[]> => {
  const database = getDatabase();
  const searchQuery = `%${query}%`;
  return await database.getAllAsync<Bourbon>(
    'SELECT * FROM bourbons WHERE name LIKE ? OR distillery LIKE ? ORDER BY name ASC',
    [searchQuery, searchQuery]
  );
};

export const getBourbonsByRarity = async (rarity: string): Promise<Bourbon[]> => {
  const database = getDatabase();
  return await database.getAllAsync<Bourbon>(
    'SELECT * FROM bourbons WHERE rarity = ? ORDER BY name ASC',
    [rarity]
  );
};

export interface BourbonFilters {
  types?: string[];
  rarities?: string[];
  minPrice?: number;
  maxPrice?: number;
  minProof?: number;
  maxProof?: number;
  sortBy?: 'name' | 'price_asc' | 'price_desc' | 'proof_asc' | 'proof_desc';
}

export const getFilteredBourbons = async (
  filters: BourbonFilters,
  searchQuery?: string
): Promise<Bourbon[]> => {
  const database = getDatabase();
  let query = 'SELECT * FROM bourbons WHERE 1=1';
  const params: any[] = [];

  // Search query
  if (searchQuery && searchQuery.trim().length > 0) {
    query += ' AND (name LIKE ? OR distillery LIKE ?)';
    const searchPattern = `%${searchQuery}%`;
    params.push(searchPattern, searchPattern);
  }

  // Type filter
  if (filters.types && filters.types.length > 0) {
    const placeholders = filters.types.map(() => '?').join(',');
    query += ` AND type IN (${placeholders})`;
    params.push(...filters.types);
  }

  // Rarity filter
  if (filters.rarities && filters.rarities.length > 0) {
    const placeholders = filters.rarities.map(() => '?').join(',');
    query += ` AND rarity IN (${placeholders})`;
    params.push(...filters.rarities);
  }

  // Price range filter
  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    query += ' AND msrp >= ?';
    params.push(filters.minPrice);
  }
  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    query += ' AND msrp <= ?';
    params.push(filters.maxPrice);
  }

  // Proof range filter
  if (filters.minProof !== undefined && filters.minProof > 0) {
    query += ' AND proof >= ?';
    params.push(filters.minProof);
  }
  if (filters.maxProof !== undefined && filters.maxProof > 0) {
    query += ' AND proof <= ?';
    params.push(filters.maxProof);
  }

  // Sorting
  switch (filters.sortBy) {
    case 'price_asc':
      query += ' ORDER BY msrp ASC, name ASC';
      break;
    case 'price_desc':
      query += ' ORDER BY msrp DESC, name ASC';
      break;
    case 'proof_asc':
      query += ' ORDER BY proof ASC, name ASC';
      break;
    case 'proof_desc':
      query += ' ORDER BY proof DESC, name ASC';
      break;
    case 'name':
    default:
      query += ' ORDER BY name ASC';
      break;
  }

  return await database.getAllAsync<Bourbon>(query, params);
};

// Collection queries
export const getUserCollection = async (): Promise<BourbonWithCollection[]> => {
  const database = getDatabase();
  return await database.getAllAsync<BourbonWithCollection>(`
    SELECT
      b.*,
      1 as in_collection,
      c.id as collection_id,
      c.notes as collection_notes,
      c.rating as collection_rating,
      c.purchase_date,
      c.purchase_price,
      c.purchase_location
    FROM bourbons b
    INNER JOIN collections c ON b.id = c.bourbon_id
    ORDER BY b.name ASC
  `);
};

export const addToCollection = async (bourbonId: number): Promise<void> => {
  const database = getDatabase();
  await database.runAsync(
    'INSERT OR IGNORE INTO collections (bourbon_id) VALUES (?)',
    [bourbonId]
  );
};

export const removeFromCollection = async (bourbonId: number): Promise<void> => {
  const database = getDatabase();
  await database.runAsync('DELETE FROM collections WHERE bourbon_id = ?', [bourbonId]);
};

export const updateCollectionNotes = async (
  bourbonId: number,
  notes: string,
  rating?: number
): Promise<void> => {
  const database = getDatabase();
  await database.runAsync(
    'UPDATE collections SET notes = ?, rating = ? WHERE bourbon_id = ?',
    [notes, rating || null, bourbonId]
  );
};

export const isInCollection = async (bourbonId: number): Promise<boolean> => {
  const database = getDatabase();
  const result = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM collections WHERE bourbon_id = ?',
    [bourbonId]
  );
  return (result?.count || 0) > 0;
};

// Statistics queries
export interface CollectionStats {
  totalBourbons: number;
  totalValue: number;
  averageRating: number;
  averageProof: number;
  typeBreakdown: { type: string; count: number }[];
  rarityBreakdown: { rarity: string; count: number }[];
  recentAdditions: BourbonWithCollection[];
}

export const getCollectionStats = async (): Promise<CollectionStats> => {
  const database = getDatabase();

  // Get total count
  const totalResult = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM collections'
  );
  const totalBourbons = totalResult?.count || 0;

  // Get total value
  const valueResult = await database.getFirstAsync<{ total: number }>(
    `SELECT SUM(b.msrp) as total
     FROM collections c
     INNER JOIN bourbons b ON c.bourbon_id = b.id`
  );
  const totalValue = valueResult?.total || 0;

  // Get average rating
  const ratingResult = await database.getFirstAsync<{ avg: number }>(
    'SELECT AVG(rating) as avg FROM collections WHERE rating IS NOT NULL'
  );
  const averageRating = ratingResult?.avg || 0;

  // Get average proof
  const proofResult = await database.getFirstAsync<{ avg: number }>(
    `SELECT AVG(b.proof) as avg
     FROM collections c
     INNER JOIN bourbons b ON c.bourbon_id = b.id`
  );
  const averageProof = proofResult?.avg || 0;

  // Get type breakdown
  const typeBreakdown = await database.getAllAsync<{ type: string; count: number }>(
    `SELECT b.type, COUNT(*) as count
     FROM collections c
     INNER JOIN bourbons b ON c.bourbon_id = b.id
     GROUP BY b.type
     ORDER BY count DESC`
  );

  // Get rarity breakdown
  const rarityBreakdown = await database.getAllAsync<{ rarity: string; count: number }>(
    `SELECT b.rarity, COUNT(*) as count
     FROM collections c
     INNER JOIN bourbons b ON c.bourbon_id = b.id
     GROUP BY b.rarity
     ORDER BY count DESC`
  );

  // Get recent additions (last 5)
  const recentAdditions = await database.getAllAsync<BourbonWithCollection>(
    `SELECT
      b.*,
      1 as in_collection,
      c.id as collection_id,
      c.notes as collection_notes,
      c.rating as collection_rating,
      c.created_at
    FROM collections c
    INNER JOIN bourbons b ON c.bourbon_id = b.id
    ORDER BY c.created_at DESC
    LIMIT 5`
  );

  return {
    totalBourbons,
    totalValue,
    averageRating,
    averageProof,
    typeBreakdown,
    rarityBreakdown,
    recentAdditions,
  };
};
