-- 사용자 그룹 초기 데이터
-- 약품 안전성 판단용 사용자 그룹

INSERT INTO user_groups (name, description, min_age, max_age) VALUES
('infant', '영아 (0-1세)', 0, 1),
('toddler', '유아 (2-5세)', 2, 5),
('children', '어린이 (6-12세)', 6, 12),
('adolescent', '청소년 (13-18세)', 13, 18),
('adult', '성인 (19-64세)', 19, 64),
('elderly', '노인 (65세 이상)', 65, NULL),
('pregnant', '임산부', NULL, NULL),
('breastfeeding', '수유부', NULL, NULL);
