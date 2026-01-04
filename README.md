# Time To Pill

복약 관리 애플리케이션 - React Native + Spring Boot

## Features

- 회원가입/로그인 (일반 로그인, Google OAuth)
- 약 검색 (이름 검색, 증상 검색)
- 증상 매핑 알고리즘 (오타 교정, 유사어 인식)
- 복약 스케줄 관리 (아침/점심/저녁)
- 복약 캘린더 (월별 복용 기록 확인)
- 처방전 스캔 (카메라/갤러리)
- 마이페이지 (프로필, 설정)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React Native, Expo, TypeScript |
| Backend | Spring Boot 3.x, Java 21 |
| Database | MySQL 8.0 |
| Auth | JWT, Google OAuth |

---

## Requirements

| Tool | Version | Check Command |
|------|---------|---------------|
| Node.js | 18.x+ | `node --version` |
| npm | 9.x+ | `npm --version` |
| Java JDK | 21 | `java --version` |
| MySQL | 8.0 | `mysql --version` |
| Android Studio | Latest | - |

---

## Project Structure

```
TimeToPill/
├── app/                          # Frontend (React Native + Expo)
│   └── src/
│       ├── screens/
│       │   ├── LoginScreen.tsx
│       │   ├── RegisterScreen.tsx
│       │   ├── HomeScreen.tsx
│       │   ├── SearchScreen.tsx
│       │   ├── CalendarScreen.tsx    # 복약 캘린더
│       │   ├── CameraScreen.tsx      # 처방전 스캔
│       │   ├── MyPageScreen.tsx
│       │   └── ...
│       ├── services/             # API calls
│       ├── types/                # TypeScript types
│       └── navigation/           # Navigation config
│
├── backend/                      # Backend (Spring Boot)
│   └── src/main/java/com/timetopill/
│       ├── controller/           # REST API endpoints
│       ├── service/              # Business logic
│       ├── repository/           # Data access layer
│       ├── entity/               # JPA entities
│       ├── dto/                  # Request/Response objects
│       ├── config/               # Configuration
│       └── symptommapper/        # 증상 매핑 알고리즘
│           ├── domain/           # Symptom, SymptomAlias 엔티티
│           ├── mapping/          # 매핑 로직 (Fuzzy, Trigram 등)
│           ├── repository/       # 증상 관련 Repository
│           └── service/          # MappingService
│
├── database/                     # Database
│   ├── users/                    # 사용자 테이블
│   ├── drugs/                    # 약품 데이터 (대용량, git 제외)
│   ├── symptoms/                 # 증상 매핑 테이블
│   ├── safety/                   # 약품 안전성 테이블
│   ├── schedules/                # 복약 스케줄 테이블
│   ├── seeds/                    # 초기 데이터
│   └── README.md                 # 데이터베이스 가이드
│
└── README.md
```

---

## Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/wtaegyu/Time-to-Pill.git
cd TimeToPill
```

### 2. Database Setup

#### 방법 1: 덤프 파일로 한 번에 설정 (추천)

```bash
# 1. 데이터베이스 생성
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS timetopill CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. 덤프 파일 임포트 (모든 테이블 + 데이터 포함)
mysql -u root -p timetopill < database/timetopill_dump.sql
```

> **덤프 파일 받기**: 덤프 파일은 용량이 커서 git에 포함되지 않습니다.
> 팀원에게 `timetopill_dump.sql` 파일을 요청하여 `database/` 폴더에 넣으세요.

#### 방법 2: SQL 파일 개별 실행 (개발용)

```sql
-- MySQL 접속
mysql -u root -p

-- 데이터베이스 생성
CREATE DATABASE timetopill;
USE timetopill;

-- 1단계: 기본 테이블
SOURCE database/users/01_users_table.sql;
SOURCE database/symptoms/01_symptom_tables_ver_jm.sql;
SOURCE database/safety/01_safety_tables.sql;

-- 2단계: 약품 데이터 (대용량, 별도 요청 필요)
SOURCE database/drugs/drug_overview_ver_sy.sql;
SOURCE database/drugs/dur_info_ver_sy.sql;
SOURCE database/drugs/dur_combination_info_ver_sy.sql;

-- 3단계: 의존 테이블
SOURCE database/schedules/01_schedule_table.sql;

-- 4단계: 초기 데이터
SOURCE database/seeds/01_symptom_seeds_ver_jm.sql;
```

> **참고**: `_ver_sy` 파일들은 용량이 커서 git에 포함되지 않습니다.

### 3. Backend Setup

> **환경변수 설정**: `backend/.env.example` 파일을 복사하여 값을 채워주세요.

**PowerShell:**
```powershell
cd backend

# 환경변수 설정
$env:DB_PASSWORD="your_mysql_password"
$env:GOOGLE_CLIENT_ID="your_google_client_id"
$env:GOOGLE_CLIENT_SECRET="your_google_client_secret"

# 실행
./gradlew bootRun
```

**CMD:**
```cmd
cd backend

set DB_PASSWORD=your_mysql_password
set GOOGLE_CLIENT_ID=your_google_client_id
set GOOGLE_CLIENT_SECRET=your_google_client_secret

gradlew bootRun
```

서버 주소: `http://localhost:8080`

### 4. Frontend Setup

```bash
cd app

# 의존성 설치
npm install

# Expo 개발 서버 시작
npm start

# Android 직접 실행
npm run android
```

---

## Database Files

### 파일 네이밍 규칙

| 접미사 | 출처 | 설명 |
|--------|------|------|
| `_ver_sy` | soyeon | 약품 데이터 (덤프 파일에서 추출) |
| `_ver_jm` | symptom_search_logic | 증상 매핑 알고리즘 관련 |

### 대용량 파일 (git 제외)

| 파일 | 크기 | 데이터 |
|------|------|--------|
| `drug_overview_ver_sy.sql` | 12 MB | 약품 기본 정보 (~44,000건) |
| `dur_info_ver_sy.sql` | 7.5 MB | 단일 금기 정보 (~23,000건) |
| `dur_combination_info_ver_sy.sql` | 217 MB | 병용금기 정보 (~837,000건) |
| `medicine_ver_sy.sql` | 1,005 MB | 약품 상세 정보 (~44,000건) |

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/google` | Google OAuth 로그인 |

### Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?keyword=` | 약 이름으로 검색 |
| GET | `/api/search/symptom?keyword=` | 증상으로 검색 (매핑 적용) |
| GET | `/api/search/{itemSeq}` | 약 상세 정보 |

### Pills
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pills/my` | 내 약 목록 (스케줄 정보 포함) |
| POST | `/api/pills/my` | 약 추가 (스케줄 설정 포함) |
| POST | `/api/pills/my/{itemSeq}` | 약 추가 (간단) |
| PUT | `/api/pills/my/{itemSeq}/schedule` | 스케줄 수정 |
| DELETE | `/api/pills/my/{itemSeq}` | 약 삭제 |

### Schedule
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schedule/today` | 오늘의 복약 스케줄 |
| GET | `/api/schedule/month?year=&month=` | 월별 복약 기록 (캘린더용) |
| PUT | `/api/schedule/{id}/taken` | 복용 완료 처리 |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | localhost | 데이터베이스 호스트 |
| `DB_PORT` | 3306 | 데이터베이스 포트 |
| `DB_NAME` | timetopill | 데이터베이스 이름 |
| `DB_USERNAME` | root | 데이터베이스 사용자 |
| `DB_PASSWORD` | - | 데이터베이스 비밀번호 |
| `GOOGLE_CLIENT_ID` | - | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | - | Google OAuth Client Secret |

---

## Troubleshooting

### 백엔드 시작 실패

**증상 테이블 관련 경고가 나오는 경우:**
- 정상입니다. 증상 테이블이 없어도 앱은 동작합니다.
- 증상 검색은 기본 LIKE 검색으로 폴백됩니다.

**API 키 관련 오류:**
- `api.service-key` 환경변수가 없어도 앱은 시작됩니다.

### MySQL 연결 실패
1. MySQL 서버 실행 확인
2. `DB_PASSWORD` 환경변수 확인
3. `timetopill` 데이터베이스 존재 확인

### 앱에서 API 연결 실패
- Android 에뮬레이터에서는 `localhost` 대신 `10.0.2.2` 사용
- `app/src/services/api.ts` 확인

### Gradle 빌드 오류

```bash
cd backend
./gradlew clean build --refresh-dependencies
```

---

## App Screens

| 화면 | 설명 |
|------|------|
| Home | 오늘의 복약 현황, 아침/점심/저녁 탭 |
| Search | 약 검색 (이름, 증상 태그) |
| Camera | 처방전 촬영/갤러리 선택 |
| Calendar | 월별 복약 기록, 복용률 통계 |
| MyPage | 프로필, 알림 설정, 비밀번호 변경 |

---

## License

MIT License
