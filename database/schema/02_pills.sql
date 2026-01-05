-- =============================================
-- TimeToPill - Pills & Schedule Tables Schema
-- =============================================
-- 약 및 복용 스케줄 관련 테이블 정의
-- =============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------
-- Table: pills
-- 약 정보 테이블 (사용자가 등록한 약)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `pills` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `item_seq` VARCHAR(50) DEFAULT NULL COMMENT 'drug_overview의 item_seq 참조',
  `name` VARCHAR(200) NOT NULL COMMENT '약 이름',
  `description` TEXT DEFAULT NULL COMMENT '약 설명/효능',
  `dosage` VARCHAR(100) DEFAULT NULL COMMENT '복용량',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pills_item_seq` (`item_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- Table: pill_warnings
-- 약 경고 정보 테이블
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `pill_warnings` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `pill_id` BIGINT NOT NULL,
  `warning` TEXT NOT NULL COMMENT '경고 내용',
  PRIMARY KEY (`id`),
  KEY `idx_pill_warnings_pill` (`pill_id`),
  CONSTRAINT `fk_pill_warnings_pill` FOREIGN KEY (`pill_id`) REFERENCES `pills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- Table: user_pills
-- 사용자-약 연결 테이블 (사용자가 복용 중인 약)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `user_pills` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `pill_id` BIGINT NOT NULL,
  `start_date` DATE DEFAULT NULL COMMENT '복용 시작일',
  `end_date` DATE DEFAULT NULL COMMENT '복용 종료일',
  `frequency` VARCHAR(20) DEFAULT 'DAILY' COMMENT '복용 빈도 (DAILY, WEEKLY, CUSTOM)',
  `custom_days` VARCHAR(50) DEFAULT NULL COMMENT '커스텀 요일 (MON,TUE,WED...)',
  `time_slots` VARCHAR(50) DEFAULT 'MORNING' COMMENT '복용 시간대 (MORNING,AFTERNOON,EVENING)',
  `is_active` TINYINT(1) DEFAULT 1 COMMENT '활성 여부',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_pill` (`user_id`, `pill_id`),
  KEY `idx_user_pills_user` (`user_id`),
  KEY `idx_user_pills_active` (`user_id`, `is_active`),
  KEY `idx_user_pills_dates` (`start_date`, `end_date`),
  CONSTRAINT `fk_user_pills_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_pills_pill` FOREIGN KEY (`pill_id`) REFERENCES `pills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------
-- Table: schedules
-- 복용 스케줄 테이블 (일별 복용 기록)
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `schedules` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `pill_id` BIGINT NOT NULL,
  `schedule_date` DATE NOT NULL COMMENT '복용 날짜',
  `schedule_time` ENUM('morning', 'afternoon', 'evening') NOT NULL COMMENT '복용 시간대',
  `taken` TINYINT(1) DEFAULT 0 COMMENT '복용 여부',
  `taken_at` TIMESTAMP NULL DEFAULT NULL COMMENT '실제 복용 시간',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_schedules_user_date` (`user_id`, `schedule_date`),
  KEY `idx_schedules_pill` (`pill_id`),
  CONSTRAINT `fk_schedules_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_schedules_pill` FOREIGN KEY (`pill_id`) REFERENCES `pills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
