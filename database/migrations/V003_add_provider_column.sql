-- Add provider column for OAuth support
-- Author: System
-- Date: 2024-01-01
-- Description: Add provider column to users table for Google OAuth login

ALTER TABLE users ADD COLUMN provider VARCHAR(10) DEFAULT 'LOCAL';

-- Update existing users to LOCAL provider
UPDATE users SET provider = 'LOCAL' WHERE provider IS NULL;

-- Make password nullable for OAuth users
ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NULL;

-- Rollback (if needed):
-- ALTER TABLE users DROP COLUMN provider;
-- ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NOT NULL;
