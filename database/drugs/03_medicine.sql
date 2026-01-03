-- 의약품 테이블
-- 덤프 파일에서 추가된 약품 정보 테이블
-- 덤프 파일 스키마 기준 (timetopill_localhost-2026_01_01_23_26_10-dump.sql)

CREATE TABLE IF NOT EXISTS medicine (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cancel_date VARCHAR(255) COMMENT '취소일',
    edi_code TEXT COMMENT 'EDI 코드',
    efficacy LONGTEXT COMMENT '효능효과',
    entp_name TEXT COMMENT '업체명',
    etc_otc_code VARCHAR(255) COMMENT '전문/일반 구분코드',
    item_image VARCHAR(255) COMMENT '제품 이미지 URL',
    item_name TEXT COMMENT '품목명',
    item_seq VARCHAR(255) NOT NULL COMMENT '품목일련번호',
    main_ingr LONGTEXT COMMENT '주성분',
    permit_date VARCHAR(255) COMMENT '허가일',
    precaution_data LONGTEXT COMMENT '주의사항',
    use_method LONGTEXT COMMENT '용법용량',
    UNIQUE KEY uk_item_seq (item_seq)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
