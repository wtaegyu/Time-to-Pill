-- 안전성 관련 테이블
-- 사용자 그룹별 약품 안전 정보

-- 사용자 그룹 (임산부, 노인, 어린이 등)
CREATE TABLE IF NOT EXISTS user_groups (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '그룹명 (pregnant, elderly, children 등)',
    description TEXT COMMENT '그룹 설명',
    min_age INT COMMENT '최소 연령',
    max_age INT COMMENT '최대 연령'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 약품별 사용자 그룹 안전 정보
CREATE TABLE IF NOT EXISTS pill_safety (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_seq VARCHAR(50) NOT NULL COMMENT 'drug_overview FK',
    user_group_id BIGINT NOT NULL,
    safety_level ENUM('safe', 'caution', 'avoid', 'prohibited') NOT NULL,
    warning_message TEXT COMMENT '경고 메시지',
    FOREIGN KEY (user_group_id) REFERENCES user_groups(id) ON DELETE CASCADE,
    UNIQUE KEY unique_drug_group (item_seq, user_group_id),
    INDEX idx_safety_drug (item_seq)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
