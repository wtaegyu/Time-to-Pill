-- DUR (Drug Utilization Review) 정보 테이블
-- 의약품 안전사용 정보

-- 단일 약품 금기 정보
CREATE TABLE IF NOT EXISTS dur_info (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_code VARCHAR(50) NOT NULL COMMENT '품목코드',
    item_name VARCHAR(500) COMMENT '품목명',
    type_name VARCHAR(100) COMMENT '금기 종류 (연령금기, 임부금기 등)',
    prohibited_content TEXT COMMENT '금기 내용',
    remark TEXT COMMENT '비고',
    INDEX idx_dur_item (item_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 병용금기 정보
CREATE TABLE IF NOT EXISTS dur_combination_info (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_code_a VARCHAR(50) NOT NULL COMMENT '품목코드 A',
    item_name_a VARCHAR(500) COMMENT '품목명 A',
    item_code_b VARCHAR(50) NOT NULL COMMENT '품목코드 B',
    item_name_b VARCHAR(500) COMMENT '품목명 B',
    prohibited_content TEXT COMMENT '병용금기 내용',
    INDEX idx_combination_a (item_code_a),
    INDEX idx_combination_b (item_code_b)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
