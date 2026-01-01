-- Example: Add new column
-- Author: Your Name
-- Date: 2024-01-01
-- Description: Add email column to users table

ALTER TABLE users ADD COLUMN email VARCHAR(100) UNIQUE;

-- Rollback (if needed):
-- ALTER TABLE users DROP COLUMN email;
