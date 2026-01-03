# TimeToPill Database Schema

## 폴더 구조

```
database/
├── users/          # 사용자 인증 관련
├── drugs/          # 약품 정보 관련 (_ver_sy)
├── symptoms/       # 증상 매핑 관련 (_ver_jm)
├── safety/         # 약품 안전성 관련
├── schedules/      # 복약 스케줄 관련
├── seeds/          # 초기 데이터
└── migrations/     # 기존 마이그레이션 (히스토리)
```

## 파일 네이밍 규칙

| 접미사 | 출처 | 설명 |
|--------|------|------|
| `_ver_sy` | soyeon | 약품 데이터 (덤프 파일에서 추출) |
| `_ver_jm` | symptom_search_logic | 증상 매핑 알고리즘 관련 |

---

## 테이블 실행 순서

### 1단계: 기본 테이블 (의존성 없음)
```sql
SOURCE users/01_users_table.sql;
SOURCE symptoms/01_symptom_tables_ver_jm.sql;
SOURCE safety/01_safety_tables.sql;
```

### 2단계: 약품 데이터 (큰 파일, git에 없음)
```sql
SOURCE drugs/drug_overview_ver_sy.sql;
SOURCE drugs/dur_info_ver_sy.sql;
SOURCE drugs/dur_combination_info_ver_sy.sql;
SOURCE drugs/medicine_ver_sy.sql;
```

### 3단계: 의존 테이블
```sql
SOURCE schedules/01_schedule_table.sql;
```

### 4단계: 초기 데이터
```sql
SOURCE seeds/01_symptom_seeds_ver_jm.sql;
SOURCE seeds/02_user_group_seeds.sql;
```

---

## 약품 데이터 (_ver_sy) 가져오기

**주의:** `_ver_sy` 파일들은 용량이 커서 git에 포함되지 않습니다.

| 파일 | 크기 | 데이터 |
|------|------|--------|
| `drug_overview_ver_sy.sql` | 12 MB | 약품 기본 정보 (~44,000건) |
| `dur_info_ver_sy.sql` | 7.5 MB | 단일 금기 정보 (~23,000건) |
| `dur_combination_info_ver_sy.sql` | 217 MB | 병용금기 정보 (~837,000건) |
| `medicine_ver_sy.sql` | 1,005 MB | 약품 상세 정보 (~44,000건) |

### 데이터 얻는 방법
1. 팀원(soyeon)에게 파일 요청
2. 또는 원본 덤프 파일에서 추출

---

## 테이블 목록

| 폴더 | 파일 | 테이블 | 설명 |
|------|------|--------|------|
| users | 01_users_table | users | 사용자 인증 정보 |
| drugs | drug_overview_ver_sy | drug_overview | 약품 기본 정보 |
| drugs | dur_info_ver_sy | dur_info | 단일 약품 금기 정보 |
| drugs | dur_combination_info_ver_sy | dur_combination_info | 병용금기 정보 |
| drugs | medicine_ver_sy | medicine | 약품 정보 (이미지 포함) |
| symptoms | 01_symptom_tables_ver_jm | symptom | 표준 증상 |
| symptoms | 01_symptom_tables_ver_jm | symptom_alias | 증상 별칭/변형 |
| symptoms | 01_symptom_tables_ver_jm | typo_correction | 오타 교정 |
| symptoms | 01_symptom_tables_ver_jm | unmapped_term | 매핑 실패 로그 |
| safety | 01_safety_tables | user_groups | 사용자 그룹 |
| safety | 01_safety_tables | pill_safety | 약품별 안전 정보 |
| schedules | 01_schedule_table | schedules | 복약 스케줄 |

---

## 유용한 명령어

```sql
-- 테이블 구조 확인
DESCRIBE users;

-- 전체 테이블 목록
SHOW TABLES;

-- 테이블 데이터 확인
SELECT * FROM symptom;
SELECT * FROM drug_overview LIMIT 10;
```
