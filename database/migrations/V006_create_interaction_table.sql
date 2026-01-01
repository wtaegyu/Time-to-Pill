-- Drug interaction (contraindication) table
-- Author: [Team Member Name]
-- Description: Check interactions between two medications

-- TODO: Team member to complete this table structure

-- Drug interactions table
CREATE TABLE IF NOT EXISTS pill_interactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pill_id_1 BIGINT NOT NULL,
    pill_id_2 BIGINT NOT NULL,
    severity ENUM('minor', 'moderate', 'major', 'contraindicated') NOT NULL,
    description TEXT,                      -- description of the interaction
    effect TEXT,                           -- what happens when taken together
    recommendation TEXT,                   -- what to do (avoid, monitor, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pill_id_1) REFERENCES pills(id) ON DELETE CASCADE,
    FOREIGN KEY (pill_id_2) REFERENCES pills(id) ON DELETE CASCADE,
    -- Ensure unique pair regardless of order
    UNIQUE KEY unique_interaction (pill_id_1, pill_id_2),
    -- Ensure pill_id_1 < pill_id_2 to avoid duplicate pairs
    CHECK (pill_id_1 < pill_id_2)
);

-- Index for faster interaction lookup
CREATE INDEX idx_interaction_pill1 ON pill_interactions(pill_id_1);
CREATE INDEX idx_interaction_pill2 ON pill_interactions(pill_id_2);

-- Rollback:
-- DROP TABLE IF EXISTS pill_interactions;
