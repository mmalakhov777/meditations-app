-- Migration: Add Telegram initData fields to users table
-- Created: 2025-09-07

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS telegram_username TEXT,
  ADD COLUMN IF NOT EXISTS telegram_first_name TEXT,
  ADD COLUMN IF NOT EXISTS telegram_last_name TEXT,
  ADD COLUMN IF NOT EXISTS telegram_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS telegram_allows_write_to_pm BOOLEAN,
  ADD COLUMN IF NOT EXISTS telegram_query_id TEXT,
  ADD COLUMN IF NOT EXISTS telegram_auth_date BIGINT,
  ADD COLUMN IF NOT EXISTS telegram_signature TEXT,
  ADD COLUMN IF NOT EXISTS telegram_hash TEXT;

-- Helpful index
CREATE INDEX IF NOT EXISTS idx_users_telegram_username ON users(telegram_username);

-- Track migration
INSERT INTO schema_migrations (version) VALUES ('002_add_telegram_fields') ON CONFLICT DO NOTHING;

