-- =============================================
-- TimeToPill - Users Table Schema
-- =============================================
-- 사용자 관련 테이블 정의
-- =============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------
-- Table: users
-- 사용자 정보 테이블
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL COMMENT '사용자 아이디 (OAuth의 경우 이메일)',
  `password` VARCHAR(255) DEFAULT NULL COMMENT '비밀번호 (BCrypt 해시, OAuth는 NULL)',
  `nickname` VARCHAR(50) NOT NULL COMMENT '닉네임',
  `age` INT DEFAULT NULL COMMENT '나이',
  `gender` ENUM('M', 'F') DEFAULT NULL COMMENT '성별',
  `provider` VARCHAR(10) DEFAULT 'LOCAL' COMMENT '인증 제공자 (LOCAL, GOOGLE)',
  `google_id` VARCHAR(255) DEFAULT NULL COMMENT '구글 계정 ID (연동용)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_username` (`username`),
  UNIQUE KEY `uk_users_nickname` (`nickname`),
  UNIQUE KEY `uk_users_google_id` (`google_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
