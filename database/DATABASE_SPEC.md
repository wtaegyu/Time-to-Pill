# TimeToPill Database Specification

## Initial Setup

```sql
CREATE DATABASE timetopill;
USE timetopill;
```

---

## Table Structure

### 1. users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Primary key |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Login ID (or email for OAuth) |
| password | VARCHAR(255) | | Password (hashed, NULL for OAuth) |
| nickname | VARCHAR(50) | UNIQUE, NOT NULL | Display name |
| age | INT | | User age |
| gender | ENUM('M','F') | | Gender |
| provider | VARCHAR(10) | DEFAULT 'LOCAL' | Auth provider (LOCAL, GOOGLE) |
| created_at | TIMESTAMP | | Created timestamp |
| updated_at | TIMESTAMP | | Updated timestamp |

---

### 2. pills

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Primary key |
| name | VARCHAR(100) | NOT NULL | Pill name |
| description | TEXT | | Description |
| dosage | VARCHAR(50) | | Dosage info |
| image_url | VARCHAR(500) | | Image URL |
| created_at | TIMESTAMP | | Created timestamp |

---

### 3. pill_warnings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Primary key |
| pill_id | BIGINT | FK -> pills.id | Reference to pill |
| warning_type | ENUM | NOT NULL | drowsiness, interaction, pregnancy, alcohol |
| message | TEXT | | Warning message |

---

### 4. user_pills

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Primary key |
| user_id | BIGINT | FK -> users.id | Reference to user |
| pill_id | BIGINT | FK -> pills.id | Reference to pill |
| created_at | TIMESTAMP | | Added timestamp |

**Constraint:** UNIQUE (user_id, pill_id)

---

### 5. schedules

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Primary key |
| user_id | BIGINT | FK -> users.id | Reference to user |
| pill_id | BIGINT | FK -> pills.id | Reference to pill |
| schedule_time | ENUM | NOT NULL | morning, afternoon, evening |
| schedule_date | DATE | NOT NULL | Scheduled date |
| taken | BOOLEAN | DEFAULT FALSE | Taken status |
| taken_at | TIMESTAMP | | Taken timestamp |
| created_at | TIMESTAMP | | Created timestamp |

---

## ERD Diagram

```mermaid
erDiagram
    users ||--o{ user_pills : has
    users ||--o{ schedules : has
    pills ||--o{ user_pills : belongs_to
    pills ||--o{ schedules : belongs_to
    pills ||--o{ pill_warnings : has

    users {
        bigint id PK
        varchar username UK
        varchar password
        varchar nickname UK
        int age
        enum gender
        timestamp created_at
        timestamp updated_at
    }

    pills {
        bigint id PK
        varchar name
        text description
        varchar dosage
        varchar image_url
        timestamp created_at
    }

    pill_warnings {
        bigint id PK
        bigint pill_id FK
        enum warning_type
        text message
    }

    user_pills {
        bigint id PK
        bigint user_id FK
        bigint pill_id FK
        timestamp created_at
    }

    schedules {
        bigint id PK
        bigint user_id FK
        bigint pill_id FK
        enum schedule_time
        date schedule_date
        boolean taken
        timestamp taken_at
        timestamp created_at
    }
```

---

## Notes

- Use snake_case for table and column names
- Apply CASCADE on FK delete
- Timezone: Asia/Seoul
