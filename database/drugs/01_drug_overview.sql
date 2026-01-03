-- 약품 기본 정보 테이블
-- 식약처 API에서 가져온 약품 정보
-- 덤프 파일 스키마 기준 (timetopill_localhost-2026_01_01_23_26_10-dump.sql)

CREATE TABLE IF NOT EXISTS drug_overview (
    item_seq VARCHAR(255) NOT NULL PRIMARY KEY COMMENT '품목일련번호',
    entp_name VARCHAR(255) COMMENT '업체명',
    item_name TEXT COMMENT '품목명',
    efficacy_text TEXT COMMENT '효능효과',
    use_method_text TEXT COMMENT '용법용량',
    warning_text_1 TEXT COMMENT '주의사항1',
    warning_text_2 TEXT COMMENT '주의사항2',
    interaction_text TEXT COMMENT '상호작용',
    side_effect_text TEXT COMMENT '부작용',
    storage_method_text TEXT COMMENT '저장방법',
    update_date DATE COMMENT '업데이트일',
    INDEX idx_item_name (item_name(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 사용자-약품 매핑 테이블
CREATE TABLE IF NOT EXISTS user_pills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    item_seq VARCHAR(255) NOT NULL COMMENT 'drug_overview FK',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_drug (user_id, item_seq)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
