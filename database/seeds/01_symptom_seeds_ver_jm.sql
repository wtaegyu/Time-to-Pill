-- 증상 초기 데이터
-- 표준 증상 및 별칭, 오타 교정 데이터

-- 1. 표준 증상 데이터
INSERT INTO symptom (code, display_name_ko, active) VALUES
('HEADACHE', '두통', TRUE),
('STOMACHACHE', '복통', TRUE),
('FEVER', '발열', TRUE),
('COLD', '감기', TRUE),
('COUGH', '기침', TRUE),
('SORE_THROAT', '인후통', TRUE),
('RUNNY_NOSE', '콧물', TRUE),
('DIARRHEA', '설사', TRUE),
('CONSTIPATION', '변비', TRUE),
('NAUSEA', '구토', TRUE),
('DIZZINESS', '어지러움', TRUE),
('FATIGUE', '피로', TRUE),
('INSOMNIA', '불면증', TRUE),
('ALLERGY', '알레르기', TRUE),
('MUSCLE_PAIN', '근육통', TRUE),
('JOINT_PAIN', '관절통', TRUE),
('BACK_PAIN', '요통', TRUE),
('TOOTHACHE', '치통', TRUE),
('INDIGESTION', '소화불량', TRUE),
('HEARTBURN', '속쓰림', TRUE);

-- 2. 증상 별칭 데이터
-- 두통 관련
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '머리가 아파요', '머리가아파요', 1.00, TRUE FROM symptom WHERE code = 'HEADACHE';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '머리 아픔', '머리아픔', 0.95, TRUE FROM symptom WHERE code = 'HEADACHE';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '머리통증', '머리통증', 0.90, TRUE FROM symptom WHERE code = 'HEADACHE';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '두통이 있어요', '두통이있어요', 1.00, TRUE FROM symptom WHERE code = 'HEADACHE';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '머리가 지끈거려요', '머리가지끈거려요', 0.95, TRUE FROM symptom WHERE code = 'HEADACHE';

-- 복통 관련
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '배가 아파요', '배가아파요', 1.00, TRUE FROM symptom WHERE code = 'STOMACHACHE';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '배 아픔', '배아픔', 0.95, TRUE FROM symptom WHERE code = 'STOMACHACHE';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '배탈', '배탈', 0.90, TRUE FROM symptom WHERE code = 'STOMACHACHE';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '복부 통증', '복부통증', 0.95, TRUE FROM symptom WHERE code = 'STOMACHACHE';

-- 발열 관련
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '열이 나요', '열이나요', 1.00, TRUE FROM symptom WHERE code = 'FEVER';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '열나', '열나', 0.90, TRUE FROM symptom WHERE code = 'FEVER';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '고열', '고열', 0.95, TRUE FROM symptom WHERE code = 'FEVER';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '몸에서 열이 나요', '몸에서열이나요', 0.95, TRUE FROM symptom WHERE code = 'FEVER';

-- 감기 관련
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '감기 걸렸어요', '감기걸렸어요', 1.00, TRUE FROM symptom WHERE code = 'COLD';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '감기 기운', '감기기운', 0.95, TRUE FROM symptom WHERE code = 'COLD';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '코감기', '코감기', 0.90, TRUE FROM symptom WHERE code = 'COLD';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '몸살', '몸살', 0.85, TRUE FROM symptom WHERE code = 'COLD';

-- 기침 관련
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '기침이 나요', '기침이나요', 1.00, TRUE FROM symptom WHERE code = 'COUGH';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '기침 나', '기침나', 0.90, TRUE FROM symptom WHERE code = 'COUGH';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '마른기침', '마른기침', 0.95, TRUE FROM symptom WHERE code = 'COUGH';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '가래 기침', '가래기침', 0.90, TRUE FROM symptom WHERE code = 'COUGH';

-- 인후통 관련
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '목이 아파요', '목이아파요', 1.00, TRUE FROM symptom WHERE code = 'SORE_THROAT';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '목 아픔', '목아픔', 0.95, TRUE FROM symptom WHERE code = 'SORE_THROAT';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '목감기', '목감기', 0.90, TRUE FROM symptom WHERE code = 'SORE_THROAT';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '목이 칼칼해요', '목이칼칼해요', 0.85, TRUE FROM symptom WHERE code = 'SORE_THROAT';

-- 콧물 관련
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '콧물이 나요', '콧물이나요', 1.00, TRUE FROM symptom WHERE code = 'RUNNY_NOSE';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '콧물 나', '콧물나', 0.90, TRUE FROM symptom WHERE code = 'RUNNY_NOSE';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '코가 막혀요', '코가막혀요', 0.85, TRUE FROM symptom WHERE code = 'RUNNY_NOSE';

-- 설사 관련
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '설사해요', '설사해요', 1.00, TRUE FROM symptom WHERE code = 'DIARRHEA';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '배가 안좋아요', '배가안좋아요', 0.80, TRUE FROM symptom WHERE code = 'DIARRHEA';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '묽은 변', '묽은변', 0.90, TRUE FROM symptom WHERE code = 'DIARRHEA';

-- 소화불량 관련
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '소화가 안돼요', '소화가안돼요', 1.00, TRUE FROM symptom WHERE code = 'INDIGESTION';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '체했어요', '체했어요', 0.95, TRUE FROM symptom WHERE code = 'INDIGESTION';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '더부룩해요', '더부룩해요', 0.90, TRUE FROM symptom WHERE code = 'INDIGESTION';

-- 속쓰림 관련
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '속이 쓰려요', '속이쓰려요', 1.00, TRUE FROM symptom WHERE code = 'HEARTBURN';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '속쓰림', '속쓰림', 1.00, TRUE FROM symptom WHERE code = 'HEARTBURN';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '위산역류', '위산역류', 0.90, TRUE FROM symptom WHERE code = 'HEARTBURN';

-- 치통 관련
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '이가 아파요', '이가아파요', 1.00, TRUE FROM symptom WHERE code = 'TOOTHACHE';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '이빨 아파', '이빨아파', 0.95, TRUE FROM symptom WHERE code = 'TOOTHACHE';
INSERT INTO symptom_alias (symptom_id, alias, normalized_alias, weight, active)
SELECT id, '치아 통증', '치아통증', 0.95, TRUE FROM symptom WHERE code = 'TOOTHACHE';

-- 3. 오타 교정 데이터
INSERT INTO typo_correction (pattern, correct, priority, active) VALUES
('머리가아퍼요', '머리가아파요', 10, TRUE),
('머리아퍼', '머리아파', 10, TRUE),
('배아퍼요', '배아파요', 10, TRUE),
('배아퍼', '배아파', 10, TRUE),
('목아퍼요', '목아파요', 10, TRUE),
('열나요', '열이나요', 5, TRUE),
('감기걸림', '감기걸렸어요', 5, TRUE),
('기침나', '기침이나요', 5, TRUE),
('콧믈', '콧물', 10, TRUE),
('컷물', '콧물', 10, TRUE),
('두틍', '두통', 10, TRUE),
('복틍', '복통', 10, TRUE),
('치틍', '치통', 10, TRUE),
('설싸', '설사', 10, TRUE),
('번비', '변비', 10, TRUE),
('소화안됨', '소화불량', 5, TRUE),
('체함', '체했어요', 5, TRUE),
('속씀', '속쓰림', 10, TRUE);
