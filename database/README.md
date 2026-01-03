# TimeToPill Database Schema

## 폴더 구조

```
database/
├── users/          # 사용자 인증 관련
├── drugs/          # 약품 정보 관련
├── symptoms/       # 증상 매핑 관련
├── safety/         # 약품 안전성 관련
├── schedules/      # 복약 스케줄 관련
├── seeds/          # 초기 데이터
└── migrations/     # 기존 마이그레이션 (히스토리)
```

---

## 테이블 실행 순서

테이블 간 FK 의존성으로 인해 다음 순서로 실행해야 합니다:

### 1단계: 기본 테이블 (의존성 없음)
```sql
SOURCE users/01_users_table.sql;        -- users
SOURCE drugs/01_drug_overview.sql;      -- drug_overview, user_pills
SOURCE symptoms/01_symptom_tables.sql;  -- symptom, symptom_alias, typo_correction, unmapped_term
SOURCE safety/01_safety_tables.sql;     -- user_groups, pill_safety
```

### 2단계: 의존 테이블
```sql
SOURCE drugs/02_dur_info.sql;           -- dur_info, dur_combination_info
SOURCE schedules/01_schedule_table.sql; -- schedules (users FK)
```

### 3단계: 초기 데이터
```sql
SOURCE seeds/01_symptom_seeds.sql;      -- 표준 증상, 별칭, 오타 교정
SOURCE seeds/02_user_group_seeds.sql;   -- 사용자 그룹 (임산부, 노인 등)
```

---

## 빠른 실행 (MySQL CLI)

```bash
# MySQL 접속
mysql -u root -p

# 데이터베이스 생성 및 선택
CREATE DATABASE IF NOT EXISTS timetopill;
USE timetopill;

# 전체 실행 (순서대로)
SOURCE users/01_users_table.sql;
SOURCE drugs/01_drug_overview.sql;
SOURCE symptoms/01_symptom_tables.sql;
SOURCE safety/01_safety_tables.sql;
SOURCE drugs/02_dur_info.sql;
SOURCE schedules/01_schedule_table.sql;
SOURCE seeds/01_symptom_seeds.sql;
SOURCE seeds/02_user_group_seeds.sql;
```

---

## 테이블 목록

| 폴더 | 파일 | 테이블 | 설명 |
|------|------|--------|------|
| users | 01_users_table | users | 사용자 인증 정보 |
| drugs | 01_drug_overview | drug_overview | 약품 기본 정보 |
| drugs | 01_drug_overview | user_pills | 사용자-약품 매핑 |
| drugs | 02_dur_info | dur_info | 단일 약품 금기 정보 |
| drugs | 02_dur_info | dur_combination_info | 병용금기 정보 |
| symptoms | 01_symptom_tables | symptom | 표준 증상 |
| symptoms | 01_symptom_tables | symptom_alias | 증상 별칭/변형 |
| symptoms | 01_symptom_tables | typo_correction | 오타 교정 |
| symptoms | 01_symptom_tables | unmapped_term | 매핑 실패 로그 |
| safety | 01_safety_tables | user_groups | 사용자 그룹 |
| safety | 01_safety_tables | pill_safety | 약품별 안전 정보 |
| schedules | 01_schedule_table | schedules | 복약 스케줄 |

---

## 파일 작성 가이드

### 네이밍 규칙
- `{순번}_{테이블명}.sql`
- 예: `01_users_table.sql`, `02_dur_info.sql`

### 파일 템플릿

```sql
-- 테이블 설명
-- 상세 설명

CREATE TABLE IF NOT EXISTS table_name (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    -- columns...
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 유용한 명령어

```sql
-- 테이블 구조 확인
DESCRIBE users;

-- 전체 테이블 목록
SHOW TABLES;

-- 테이블 데이터 확인
SELECT * FROM symptom;
SELECT * FROM symptom_alias LIMIT 10;
```
