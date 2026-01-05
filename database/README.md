# TimeToPill Database

## 폴더 구조

```
database/
├── README.md                 # 이 파일
├── schema/                   # 테이블 스키마 정의
│   ├── 01_users.sql         # 사용자 테이블
│   ├── 02_pills.sql         # 약 및 스케줄 테이블
│   └── 03_symptom_mapper.sql # 증상 매핑 테이블
└── data/                     # 초기 데이터 (팀원별 작업)
    ├── drug_overview_ver_sy.sql      # 약 개요 데이터 (소연)
    ├── dur_info_ver_sy.sql           # DUR 정보 (소연)
    ├── dur_combination_info_ver_sy.sql # DUR 병용금기 (소연)
    ├── medicine_ver_sy.sql           # 의약품 데이터 (소연)
    ├── symptom_tables_ver_jm.sql     # 증상 테이블 (지민)
    └── symptom_seeds_ver_jm.sql      # 증상 데이터 (지민)
```

## 테이블 구조

### 1. 사용자 관련 (schema/01_users.sql)
| 테이블 | 설명 |
|--------|------|
| `users` | 사용자 정보 (아이디, 비밀번호, 닉네임, 나이, 성별) |

### 2. 약 및 스케줄 (schema/02_pills.sql)
| 테이블 | 설명 |
|--------|------|
| `pills` | 사용자가 등록한 약 정보 |
| `pill_warnings` | 약 경고 정보 |
| `user_pills` | 사용자-약 연결 (복용 중인 약) |
| `schedules` | 일별 복용 스케줄 |

### 3. 증상 매핑 (schema/03_symptom_mapper.sql)
| 테이블 | 설명 |
|--------|------|
| `symptom` | 표준 증상 목록 |
| `symptom_alias` | 증상 별칭 (사용자 입력 → 표준 증상) |
| `typo_correction` | 오타 교정 규칙 |
| `unmapped_term` | 매핑 실패 로그 |

### 4. 약 데이터 (data/*_ver_sy.sql - 소연)
| 테이블 | 설명 | 데이터 수 |
|--------|------|----------|
| `drug_overview` | 의약품 개요 (이름, 제조사, 효능, 용법) | ~44,000건 |
| `dur_info` | DUR 정보 (약 금기 정보) | ~23,000건 |
| `dur_combination_info` | DUR 병용금기 정보 | ~837,000건 |
| `medicine` | 의약품 상세 정보 | ~44,000건 |

## 초기 설정

### 1. 데이터베이스 생성
```sql
CREATE DATABASE timetopill CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 스키마 실행 (순서대로)
```bash
mysql -u root -p timetopill < database/schema/01_users.sql
mysql -u root -p timetopill < database/schema/02_pills.sql
mysql -u root -p timetopill < database/schema/03_symptom_mapper.sql
```

### 3. 초기 데이터 로드
```bash
# 약 데이터 (소연)
mysql -u root -p timetopill < database/data/drug_overview_ver_sy.sql
mysql -u root -p timetopill < database/data/dur_info_ver_sy.sql
mysql -u root -p timetopill < database/data/dur_combination_info_ver_sy.sql
mysql -u root -p timetopill < database/data/medicine_ver_sy.sql

# 증상 데이터 (지민)
mysql -u root -p timetopill < database/data/symptom_tables_ver_jm.sql
mysql -u root -p timetopill < database/data/symptom_seeds_ver_jm.sql
```

## ERD (Entity Relationship)

```
users ─┬─< user_pills >─ pills ─< pill_warnings
       │
       └─< schedules >─ pills

symptom ─< symptom_alias

drug_overview ─< dur_info
              ─< dur_combination_info
```

## 팀원별 담당

| 팀원 | 담당 테이블 | 파일 접미사 |
|------|-------------|-------------|
| 소연 | drug_overview, dur_info, dur_combination_info, medicine | `_ver_sy` |
| 지민 | symptom, symptom_alias, typo_correction | `_ver_jm` |
| 태규 | users, pills, schedules, user_pills | (schema 폴더) |

## 주의사항

1. **스키마 변경 시**: `schema/` 폴더의 파일 수정 후 팀원에게 알림
2. **데이터 추가 시**: 본인 담당 `_ver_XX` 파일에 추가
3. **FK 순서**: users → pills → user_pills → schedules 순서로 생성
4. **문자셋**: utf8mb4 사용 (이모지 지원)

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
