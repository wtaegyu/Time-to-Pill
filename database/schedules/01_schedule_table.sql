-- 복약 일정 테이블
-- 사용자별 복약 스케줄 관리

CREATE TABLE IF NOT EXISTS schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    item_seq VARCHAR(50) NOT NULL COMMENT 'drug_overview FK',
    schedule_time ENUM('morning', 'afternoon', 'evening') NOT NULL COMMENT '복약 시간대',
    schedule_date DATE NOT NULL COMMENT '복약 날짜',
    taken BOOLEAN DEFAULT FALSE COMMENT '복용 여부',
    taken_at TIMESTAMP NULL COMMENT '실제 복용 시간',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_schedules_user_date (user_id, schedule_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
