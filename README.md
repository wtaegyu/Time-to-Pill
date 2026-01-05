# Time To Pill

복약 관리 애플리케이션 - React Native + Spring Boot

## Features

### 인증
- 회원가입/로그인 (일반 로그인)
- Google OAuth 로그인
- 일반 계정 + 구글 계정 연동
- 프로필 관리 (나이, 성별, 닉네임)
- 비밀번호 변경

### 약 관리
- 약 검색 (이름 검색, 증상 검색)
- 증상 매핑 알고리즘 (오타 교정, 유사어 인식)
- 인기 약품 조회 (사용자들이 가장 많이 추가한 약)
- 약 상세 정보 (효능, 용법, 주의사항)
- 내 약통 관리 (추가/삭제)

### 복약 스케줄
- 복약 스케줄 설정 (아침/점심/저녁)
- 복용 빈도 설정 (매일, 격일, 3일마다, 주간, 커스텀)
- 복용 기간 설정 (시작일, 종료일)
- 복용 완료 체크

### 캘린더
- 월별 복약 기록 확인
- 일별 복용률 표시
- 구글 캘린더 동기화 (구글 연동 시)

### 기타
- 처방전 스캔 (카메라/갤러리)
- 마이페이지 (프로필, 설정)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React Native, Expo SDK 54, TypeScript |
| Backend | Spring Boot 3.x, Java 21 |
| Database | MySQL 8.0 |
| Auth | Token-based (temp-token), Google OAuth |

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
│       │   ├── LoginScreen.tsx       # 로그인 (일반 + 구글)
│       │   ├── RegisterScreen.tsx    # 회원가입
│       │   ├── CompleteProfileScreen.tsx  # 구글 가입 후 추가 정보
│       │   ├── HomeScreen.tsx        # 홈 (오늘의 복약)
│       │   ├── SearchScreen.tsx      # 약 검색 + 인기 약품
│       │   ├── PillDetailScreen.tsx  # 약 상세 정보
│       │   ├── AddPillScheduleScreen.tsx  # 스케줄 설정
│       │   ├── CalendarScreen.tsx    # 복약 캘린더
│       │   ├── CameraScreen.tsx      # 처방전 스캔
│       │   ├── MyPageScreen.tsx      # 마이페이지
│       │   ├── EditProfileScreen.tsx # 프로필 수정
│       │   ├── ChangePasswordScreen.tsx  # 비밀번호 변경
│       │   └── ...
│       ├── services/
│       │   ├── api.ts               # Axios 인스턴스
│       │   ├── authService.ts       # 인증 API
│       │   ├── pillService.ts       # 약 관련 API
│       │   └── calendarService.ts   # 구글 캘린더 API
│       ├── types/                   # TypeScript types
│       └── navigation/              # Navigation config
│
├── backend/                      # Backend (Spring Boot)
│   └── src/main/java/com/timetopill/
│       ├── controller/
│       │   ├── AuthController.java      # 인증 API
│       │   ├── SearchController.java    # 검색 API
│       │   ├── PillController.java      # 약 관리 API
│       │   └── ScheduleController.java  # 스케줄 API
│       ├── service/
│       │   ├── AuthService.java         # 인증 로직
│       │   ├── SearchService.java       # 검색 로직
│       │   └── PillService.java         # 약 관리 로직
│       ├── repository/              # Data access layer
│       ├── entity/                  # JPA entities
│       ├── dto/                     # Request/Response objects
│       ├── config/
│       │   ├── SecurityConfig.java          # Spring Security
│       │   └── TokenAuthenticationFilter.java  # 토큰 인증 필터
│       └── symptommapper/           # 증상 매핑 알고리즘
│
├── database/                     # Database
│   ├── users/                    # 사용자 테이블
│   ├── drugs/                    # 약품 데이터 (대용량, git 제외)
│   ├── symptoms/                 # 증상 매핑 테이블
│   ├── safety/                   # 약품 안전성 테이블
│   ├── schedules/                # 복약 스케줄 테이블
│   └── seeds/                    # 초기 데이터
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

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/google` | Google OAuth 로그인 |
| POST | `/api/auth/link-google` | 구글 계정 연동 |
| DELETE | `/api/auth/unlink-google` | 구글 계정 연동 해제 |
| PUT | `/api/auth/profile` | 프로필 수정 |
| PUT | `/api/auth/password` | 비밀번호 변경 |

### Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?keyword=` | 약 이름으로 검색 |
| GET | `/api/search/symptom?keyword=` | 증상으로 검색 (매핑 적용) |
| GET | `/api/search/popular?limit=5` | 인기 약품 조회 |
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

## Authentication

### 토큰 형식
- 일반 로그인: `temp-token-{userId}`
- 구글 로그인: `google-token-{userId}`

### 요청 헤더
```
Authorization: Bearer temp-token-3
```

### 구글 계정 연동
1. 일반 계정 로그인 후 마이페이지에서 "구글 계정 연결"
2. 구글 로그인 완료 시 기존 계정에 googleId 연결
3. 이후 구글 로그인으로도 동일 계정 접근 가능

---

## App Screens

| 화면 | 파일 | 설명 |
|------|------|------|
| 로그인 | `LoginScreen.tsx` | 일반 로그인 + 구글 로그인 |
| 회원가입 | `RegisterScreen.tsx` | 이메일, 비밀번호, 닉네임, 나이, 성별 |
| 프로필 완성 | `CompleteProfileScreen.tsx` | 구글 가입 후 나이/성별 입력 |
| 홈 | `HomeScreen.tsx` | 오늘의 복약 현황, 아침/점심/저녁 탭 |
| 약 검색 | `SearchScreen.tsx` | 이름/증상 검색, 인기 약품 표시 |
| 약 상세 | `PillDetailScreen.tsx` | 효능, 용법, 주의사항, 약통 추가 |
| 스케줄 설정 | `AddPillScheduleScreen.tsx` | 복용 시간, 빈도, 기간 설정 |
| 캘린더 | `CalendarScreen.tsx` | 월별 복약 기록, 구글 캘린더 동기화 |
| 처방전 스캔 | `CameraScreen.tsx` | 카메라/갤러리 선택 |
| 마이페이지 | `MyPageScreen.tsx` | 프로필, 구글 연동, 설정 |
| 프로필 수정 | `EditProfileScreen.tsx` | 닉네임, 나이, 성별 변경 |
| 비밀번호 변경 | `ChangePasswordScreen.tsx` | 현재/새 비밀번호 입력 |

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

## Database Schema

### users 테이블
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary Key |
| username | VARCHAR(50) | 이메일 (Unique) |
| password | VARCHAR(255) | BCrypt 암호화 (구글 계정은 NULL) |
| nickname | VARCHAR(50) | 닉네임 (Unique) |
| age | INT | 나이 |
| gender | ENUM('M','F') | 성별 |
| provider | VARCHAR(10) | LOCAL / GOOGLE |
| google_id | VARCHAR(255) | 구글 계정 ID (Unique) |
| created_at | TIMESTAMP | 생성일 |
| updated_at | TIMESTAMP | 수정일 |

### user_pills 테이블
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary Key |
| user_id | BIGINT | 사용자 FK |
| pill_id | VARCHAR(255) | 약품 코드 FK |
| start_date | DATE | 복용 시작일 |
| end_date | DATE | 복용 종료일 |
| frequency | ENUM | DAILY, EVERY_OTHER_DAY, WEEKLY, CUSTOM |
| time_slots | VARCHAR(255) | MORNING,AFTERNOON,EVENING |
| is_active | BOOLEAN | 활성 상태 |

---

## Troubleshooting

### 백엔드 시작 실패
- 증상 테이블 관련 경고는 정상입니다.
- API 키 없이도 앱은 시작됩니다.

### MySQL 연결 실패
1. MySQL 서버 실행 확인
2. `DB_PASSWORD` 환경변수 확인
3. `timetopill` 데이터베이스 존재 확인

### 앱에서 API 연결 실패
- Android 에뮬레이터: `localhost` 대신 `10.0.2.2` 사용
- `app/src/services/api.ts` 확인

### 401 Unauthorized 에러
- Authorization 헤더 확인: `Bearer temp-token-{userId}`
- 토큰 형식이 올바른지 확인

### Gradle 빌드 오류
```bash
cd backend
./gradlew clean build --refresh-dependencies
```

---

## License

MIT License
