-- TimeToPill Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    age INT,
    gender ENUM('M', 'F'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Pills table
CREATE TABLE IF NOT EXISTS pills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    dosage VARCHAR(50),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pill warnings table
CREATE TABLE IF NOT EXISTS pill_warnings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pill_id BIGINT NOT NULL,
    warning_type ENUM('drowsiness', 'interaction', 'pregnancy', 'alcohol') NOT NULL,
    message TEXT,
    FOREIGN KEY (pill_id) REFERENCES pills(id) ON DELETE CASCADE
);

-- User pills (many-to-many relationship)
CREATE TABLE IF NOT EXISTS user_pills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    pill_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pill_id) REFERENCES pills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_pill (user_id, pill_id)
);

-- Schedules table
CREATE TABLE IF NOT EXISTS schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    pill_id BIGINT NOT NULL,
    schedule_time ENUM('morning', 'afternoon', 'evening') NOT NULL,
    schedule_date DATE NOT NULL,
    taken BOOLEAN DEFAULT FALSE,
    taken_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pill_id) REFERENCES pills(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_schedules_user_date ON schedules(user_id, schedule_date);
CREATE INDEX idx_user_pills_user ON user_pills(user_id);
