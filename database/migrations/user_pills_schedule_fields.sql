-- V009: user_pills 테이블에 복용 스케줄 설정 필드 추가

-- 복용 시작일
ALTER TABLE user_pills ADD COLUMN start_date DATE NULL;

-- 복용 종료일 (NULL = 무기한)
ALTER TABLE user_pills ADD COLUMN end_date DATE NULL;

-- 복용 빈도 (DAILY, EVERY_OTHER_DAY, EVERY_3_DAYS, WEEKLY, CUSTOM)
ALTER TABLE user_pills ADD COLUMN frequency VARCHAR(20) DEFAULT 'DAILY';

-- 특정 요일 (CUSTOM일 때 사용, 예: "MON,WED,FRI")
ALTER TABLE user_pills ADD COLUMN custom_days VARCHAR(50) NULL;

-- 복용 시간대 (예: "MORNING,EVENING")
ALTER TABLE user_pills ADD COLUMN time_slots VARCHAR(50) DEFAULT 'MORNING';

-- 활성 상태
ALTER TABLE user_pills ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- 인덱스 추가
CREATE INDEX idx_user_pills_active ON user_pills(user_id, is_active);
CREATE INDEX idx_user_pills_dates ON user_pills(start_date, end_date);
