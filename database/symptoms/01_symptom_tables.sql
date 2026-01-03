-- 증상 매핑 테이블
-- symptom_search_logic 알고리즘에서 사용

-- 1. 표준 증상 테이블
CREATE TABLE IF NOT EXISTS symptom (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE COMMENT '증상 코드 (예: HEADACHE)',
    display_name_ko VARCHAR(50) NOT NULL COMMENT '한글 표시명 (예: 두통)',
    active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '활성화 여부',
    INDEX idx_symptom_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. 증상 별칭/변형 테이블
CREATE TABLE IF NOT EXISTS symptom_alias (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    symptom_id BIGINT NOT NULL COMMENT 'symptom 테이블 FK',
    alias VARCHAR(100) NOT NULL COMMENT '별칭 (예: 머리가 아파요)',
    normalized_alias VARCHAR(100) NOT NULL COMMENT '정규화된 별칭',
    weight DECIMAL(3,2) NOT NULL DEFAULT 1.00 COMMENT '매칭 가중치',
    active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '활성화 여부',
    CONSTRAINT fk_alias_symptom FOREIGN KEY (symptom_id) REFERENCES symptom(id) ON DELETE CASCADE,
    INDEX idx_alias_active (active),
    INDEX idx_alias_symptom (symptom_id),
    INDEX idx_alias_alias (alias)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. 오타 교정 테이블
CREATE TABLE IF NOT EXISTS typo_correction (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    pattern VARCHAR(100) NOT NULL COMMENT '오타 패턴 (예: 츠통)',
    correct VARCHAR(100) NOT NULL COMMENT '정정된 표현 (예: 치통)',
    priority INT NOT NULL DEFAULT 0 COMMENT '우선순위 (높을수록 먼저 적용)',
    active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '활성화 여부',
    INDEX idx_typo_active_priority (active, priority DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. 매핑 실패 로깅 테이블 (학습/개선용)
CREATE TABLE IF NOT EXISTS unmapped_term (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    raw_chunk VARCHAR(200) NOT NULL COMMENT '사용자가 입력한 원본 텍스트',
    best_score DECIMAL(4,3) NULL COMMENT '최고 매칭 점수',
    best_guess_json TEXT NULL COMMENT '최고 추정 결과 JSON',
    candidates_json TEXT NULL COMMENT '후보 목록 JSON',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 시간',
    INDEX idx_unmapped_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
