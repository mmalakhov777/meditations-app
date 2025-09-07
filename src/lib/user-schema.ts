// User schema for Telegram Mini App with favorites and subscription

export type SubscriptionStatus = "free" | "premium" | "trial";

export type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
};

export type User = {
  // Primary key
  id: string; // UUID or auto-generated

  // Telegram authentication data
  telegramId: number; // Telegram user ID (unique)
  telegramData: TelegramUser; // Full Telegram user object
  telegramLanguageCode?: string; // User's preferred language from Telegram

  // App-specific fields
  favoriteMeditations: string[]; // Array of meditation IDs
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiresAt?: Date; // For trial/premium subscriptions

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
};

// Database schema (for SQL/Prisma/etc)
export const UserTableSchema = `
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  telegram_id INTEGER UNIQUE NOT NULL,
  telegram_data JSONB NOT NULL,
  telegram_language_code TEXT,
  favorite_meditations TEXT[] DEFAULT '{}',
  subscription_status TEXT CHECK (subscription_status IN ('free', 'premium', 'trial')) DEFAULT 'free',
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);
CREATE INDEX idx_users_last_active ON users(last_active_at);
`;

// Helper functions
export function createUser(telegramUser: TelegramUser): Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastActiveAt'> {
  return {
    telegramId: telegramUser.id,
    telegramData: telegramUser,
    telegramLanguageCode: telegramUser.language_code,
    favoriteMeditations: [],
    subscriptionStatus: telegramUser.is_premium ? "premium" : "free",
    subscriptionExpiresAt: undefined,
  };
}

export function isSubscriptionActive(user: User): boolean {
  if (user.subscriptionStatus === "free") return true;
  if (user.subscriptionStatus === "premium") return true;
  if (user.subscriptionStatus === "trial") {
    return user.subscriptionExpiresAt ? new Date() < user.subscriptionExpiresAt : false;
  }
  return false;
}

export function addFavoriteMeditation(user: User, meditationId: string): string[] {
  const favorites = new Set(user.favoriteMeditations);
  favorites.add(meditationId);
  return Array.from(favorites);
}

export function removeFavoriteMeditation(user: User, meditationId: string): string[] {
  return user.favoriteMeditations.filter(id => id !== meditationId);
}
