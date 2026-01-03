-- 약품 기본 정보 테이블
-- 식약처 API에서 가져온 약품 정보

CREATE TABLE IF NOT EXISTS drug_overview (
    item_seq VARCHAR(50) PRIMARY KEY COMMENT '품목일련번호',
    item_name VARCHAR(1000) COMMENT '품목명',
    entp_name VARCHAR(255) COMMENT '업체명',
    efficacy_text TEXT COMMENT '효능효과',
    use_method_text TEXT COMMENT '용법용량',
    warning_text_1 TEXT COMMENT '주의사항',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_drug_name (item_name(100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 사용자-약품 매핑 테이블
CREATE TABLE IF NOT EXISTS user_pills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    item_seq VARCHAR(50) NOT NULL COMMENT 'drug_overview FK',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_drug (user_id, item_seq)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
