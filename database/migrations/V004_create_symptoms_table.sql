-- Symptoms and pill-symptom relationship tables
-- Author: [Team Member Name]
-- Description: Search pills by symptoms

-- TODO: Team member to complete this table structure

-- Symptoms master table
CREATE TABLE IF NOT EXISTS symptoms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,           -- e.g., headache, fever, cough
    category VARCHAR(50),                  -- e.g., pain, respiratory, digestive
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pill-Symptom relationship (which pills treat which symptoms)
CREATE TABLE IF NOT EXISTS pill_symptoms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pill_id BIGINT NOT NULL,
    symptom_id BIGINT NOT NULL,
    effectiveness ENUM('high', 'medium', 'low'),  -- optional: effectiveness rating
    FOREIGN KEY (pill_id) REFERENCES pills(id) ON DELETE CASCADE,
    FOREIGN KEY (symptom_id) REFERENCES symptoms(id) ON DELETE CASCADE,
    UNIQUE KEY unique_pill_symptom (pill_id, symptom_id)
);

-- Index for faster symptom search
CREATE INDEX idx_symptoms_name ON symptoms(name);
CREATE INDEX idx_pill_symptoms_symptom ON pill_symptoms(symptom_id);

-- Rollback:
-- DROP TABLE IF EXISTS pill_symptoms;
-- DROP TABLE IF EXISTS symptoms;
