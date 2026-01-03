-- Insert test admin user
-- Username: admin
-- Password: admin (BCrypt encoded)

INSERT INTO users (username, password, nickname, provider, created_at, updated_at)
VALUES (
    'admin',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeQpYVmJrPMxdWiZPGYs1xPEJXeP0q8.a',
    'Admin',
    'LOCAL',
    NOW(),
    NOW()
);

-- Rollback:
-- DELETE FROM users WHERE username = 'admin';
