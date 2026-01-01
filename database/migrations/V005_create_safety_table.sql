-- User group safety information table
-- Author: [Team Member Name]
-- Description: Safety information for specific user groups (pregnant, elderly, children)

-- TODO: Team member to complete this table structure

-- User group types for safety classification
CREATE TABLE IF NOT EXISTS user_groups (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,     -- e.g., pregnant, elderly, children, breastfeeding
    description TEXT,
    min_age INT,                           -- for age-based groups
    max_age INT
);

-- Pill safety information per user group
CREATE TABLE IF NOT EXISTS pill_safety (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pill_id BIGINT NOT NULL,
    user_group_id BIGINT NOT NULL,
    safety_level ENUM('safe', 'caution', 'avoid', 'prohibited') NOT NULL,
    warning_message TEXT,                  -- specific warning for this group
    alternative_pill_id BIGINT,            -- suggested alternative if not safe
    FOREIGN KEY (pill_id) REFERENCES pills(id) ON DELETE CASCADE,
    FOREIGN KEY (user_group_id) REFERENCES user_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (alternative_pill_id) REFERENCES pills(id) ON DELETE SET NULL,
    UNIQUE KEY unique_pill_group (pill_id, user_group_id)
);

-- Default user groups
INSERT INTO user_groups (name, description, min_age, max_age) VALUES
    ('pregnant', 'Pregnant women', NULL, NULL),
    ('breastfeeding', 'Breastfeeding mothers', NULL, NULL),
    ('elderly', 'Elderly (65+)', 65, NULL),
    ('children', 'Children (0-12)', 0, 12),
    ('infants', 'Infants (0-2)', 0, 2);

-- Index for faster lookup
CREATE INDEX idx_pill_safety_pill ON pill_safety(pill_id);
CREATE INDEX idx_pill_safety_group ON pill_safety(user_group_id);

-- Rollback:
-- DROP TABLE IF EXISTS pill_safety;
-- DROP TABLE IF EXISTS user_groups;
