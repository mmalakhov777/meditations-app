import { Client } from 'pg';
import { User, TelegramUser, createUser } from '@/lib/user-schema';

// Database connection
async function getDbClient() {
  const client = new Client({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl: {
      rejectUnauthorized: false,
      require: true
    },
    port: 5432
  });
  
  await client.connect();
  return client;
}

export async function createOrGetUser(telegramUser: TelegramUser): Promise<User> {
  const client = await getDbClient();
  
  try {
    // Check if user already exists
    const existingUser = await getUserByTelegramId(telegramUser.id);
    if (existingUser) {
      // Update last active and return existing user
      await client.query(
        'UPDATE users SET last_active_at = NOW(), telegram_data = $1 WHERE telegram_id = $2',
        [JSON.stringify(telegramUser), telegramUser.id]
      );
      return existingUser;
    }

    // Create new user
    const newUserData = createUser(telegramUser);
    const result = await client.query(`
      INSERT INTO users (
        telegram_id, 
        telegram_data, 
        telegram_language_code, 
        favorite_meditations, 
        subscription_status
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      newUserData.telegramId,
      JSON.stringify(newUserData.telegramData),
      newUserData.telegramLanguageCode,
      newUserData.favoriteMeditations,
      newUserData.subscriptionStatus
    ]);

    return dbRowToUser(result.rows[0]);
  } finally {
    await client.end();
  }
}

export async function getUserByTelegramId(telegramId: number): Promise<User | null> {
  const client = await getDbClient();
  
  try {
    const result = await client.query(
      'SELECT * FROM users WHERE telegram_id = $1',
      [telegramId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return dbRowToUser(result.rows[0]);
  } finally {
    await client.end();
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const client = await getDbClient();
  
  try {
    const result = await client.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return dbRowToUser(result.rows[0]);
  } finally {
    await client.end();
  }
}

export async function updateUserFavorites(telegramId: number, favoriteIds: string[]): Promise<void> {
  const client = await getDbClient();
  
  try {
    await client.query(
      'UPDATE users SET favorite_meditations = $1, updated_at = NOW() WHERE telegram_id = $2',
      [favoriteIds, telegramId]
    );
  } finally {
    await client.end();
  }
}

export async function updateUserSubscription(
  telegramId: number, 
  subscriptionStatus: 'free' | 'premium' | 'trial',
  expiresAt?: Date
): Promise<void> {
  const client = await getDbClient();
  
  try {
    await client.query(
      'UPDATE users SET subscription_status = $1, subscription_expires_at = $2, updated_at = NOW() WHERE telegram_id = $3',
      [subscriptionStatus, expiresAt, telegramId]
    );
  } finally {
    await client.end();
  }
}

// Helper function to convert database row to User type
function dbRowToUser(row: {
  id: string;
  telegram_id: number;
  telegram_data: any;
  telegram_language_code: string | null;
  favorite_meditations: string[];
  subscription_status: string;
  subscription_expires_at: string | null;
  created_at: string;
  updated_at: string;
  last_active_at: string;
}): User {
  return {
    id: row.id,
    telegramId: row.telegram_id,
    telegramData: row.telegram_data,
    telegramLanguageCode: row.telegram_language_code,
    favoriteMeditations: row.favorite_meditations || [],
    subscriptionStatus: row.subscription_status,
    subscriptionExpiresAt: row.subscription_expires_at ? new Date(row.subscription_expires_at) : undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    lastActiveAt: new Date(row.last_active_at)
  };
}
