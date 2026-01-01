# TimeToPill Installation Guide

## Prerequisites

- **Node.js** (v18 or higher)
- **Java JDK** (v21)
- **MySQL** (v8.0)
- **Android Studio** (for emulator)

---

## 1. Clone Repository

```bash
git clone https://github.com/wtaegyu/Time-to-Pill.git
cd Time-to-Pill
```

---

## 2. Database Setup

### Create Database
```sql
CREATE DATABASE timetopill;
```

### Run Migrations
```bash
mysql -u root -p timetopill < database/migrations/V001_init_schema.sql
mysql -u root -p timetopill < database/migrations/V003_add_provider_column.sql
```

---

## 3. Backend Setup

### Navigate to backend
```bash
cd backend
```

### Set Environment Variables
Create environment variables or edit `application.yml`:

| Variable | Description | Example |
|----------|-------------|---------|
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 3306 |
| DB_NAME | Database name | timetopill |
| DB_USERNAME | Database user | root |
| DB_PASSWORD | Database password | your_password |
| GOOGLE_CLIENT_ID | Google OAuth Client ID | xxx.apps.googleusercontent.com |
| GOOGLE_CLIENT_SECRET | Google OAuth Secret | GOCSPX-xxx |

### Run Backend
```bash
gradlew bootRun
```

Backend runs at: http://localhost:8080

---

## 4. Frontend Setup

### Navigate to app
```bash
cd app
```

### Install Dependencies
```bash
npm install
```

### If installation fails (Windows PowerShell)
```bash
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Start Expo
```bash
npx expo start --clear
```

---

## 5. Run on Android Emulator

### Start Emulator
1. Open Android Studio
2. Tools > Device Manager
3. Click play button on your virtual device

### Connect App
After `npx expo start`, press `a` to open on Android

---

## Troubleshooting

### "npm cannot be loaded" (PowerShell)
```bash
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### "GradleWrapperMain not found"
Download gradle-wrapper.jar:
```bash
curl -L -o gradle/wrapper/gradle-wrapper.jar "https://github.com/gradle/gradle/raw/v8.11.1/gradle/wrapper/gradle-wrapper.jar"
```

### App crashes on emulator
Delete and reinstall node_modules:
```bash
cd app
rmdir /s /q node_modules   # Windows
rm -rf node_modules        # Mac/Linux
del package-lock.json      # Windows
rm package-lock.json       # Mac/Linux
npm install
npx expo start --clear
```

### Emulator not detected
1. Ensure Android Studio emulator is running BEFORE pressing `a`
2. Check if `adb` is in PATH:
```bash
adb devices
```

---

## Quick Start Summary

```bash
# Terminal 1: Backend
cd backend
gradlew bootRun

# Terminal 2: Frontend
cd app
npm install
npx expo start --clear
# Press 'a' after emulator is running
```

---

## API Base URL (for emulator)

When running on Android emulator, use `10.0.2.2` instead of `localhost`:

```typescript
// app/src/services/api.ts
const API_BASE_URL = 'http://10.0.2.2:8080/api';
```
