-- =============================================
-- TimeToPill - Symptom Mapper Tables Schema
-- =============================================
-- 증상 검색 및 매핑 관련 테이블 정의
-- (symptom_search_logic 통합)
-- =============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------
-- Table: symptom
-- 표준 증상 테이블
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `symptom` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL COMMENT '증상 코드 (예: HEADACHE)',
  `display_name_ko` VARCHAR(50) NOT NULL COMMENT '한글 표시명 (예: 두통)',
  `active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '활성 여부',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_symptom_code` (`code`),
  KEY `idx_symptom_active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- Table: symptom_alias
-- 증상 별칭 테이블 (사용자 입력 → 표준 증상 매핑)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `symptom_alias` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `symptom_id` BIGINT NOT NULL COMMENT '연결된 표준 증상',
  `alias` VARCHAR(100) NOT NULL COMMENT '별칭 (예: 머리아파, 머리 아픔)',
  `normalized_alias` VARCHAR(100) NOT NULL COMMENT '정규화된 별칭',
  `weight` DECIMAL(3,2) NOT NULL DEFAULT 1.00 COMMENT '가중치 (매칭 우선순위)',
  `active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '활성 여부',
  PRIMARY KEY (`id`),
  KEY `idx_alias_symptom` (`symptom_id`),
  KEY `idx_alias_active` (`active`),
  CONSTRAINT `fk_alias_symptom` FOREIGN KEY (`symptom_id`) REFERENCES `symptom` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- Table: typo_correction
-- 오타 교정 테이블
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `typo_correction` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `pattern` VARCHAR(100) NOT NULL COMMENT '오타 패턴',
  `correct` VARCHAR(100) NOT NULL COMMENT '올바른 표현',
  `priority` INT NOT NULL DEFAULT 0 COMMENT '우선순위 (높을수록 먼저 적용)',
  `active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '활성 여부',
  PRIMARY KEY (`id`),
  KEY `idx_typo_active_priority` (`active`, `priority`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- Table: unmapped_term
-- 매핑 실패 로그 테이블 (학습용)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `unmapped_term` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `raw_chunk` VARCHAR(200) NOT NULL COMMENT '매핑 실패한 원본 텍스트',
  `best_score` DECIMAL(4,3) DEFAULT NULL COMMENT '최고 유사도 점수',
  `best_guess_json` TEXT DEFAULT NULL COMMENT '가장 유사한 증상 추측 (JSON)',
  `candidates_json` TEXT DEFAULT NULL COMMENT '후보 증상 목록 (JSON)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_unmapped_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
