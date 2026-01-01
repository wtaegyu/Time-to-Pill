# Database Collaboration Guide

## Folder Structure

```
database/
├── DATABASE_SPEC.md      # Table specifications (up-to-date)
├── README.md             # This file
└── migrations/           # Change history
    ├── V001_init_schema.sql
    ├── V002_example_add_column.sql
    └── ...
```

---

## Making Database Changes

### 1. Create Migration File

Naming convention: `V{number}_{description}.sql`

```
V003_add_pill_category.sql
V004_create_notifications_table.sql
```

### 2. File Template

```sql
-- Author: Your Name
-- Date: 2024-01-01
-- Description: Add category column to pills table

ALTER TABLE pills ADD COLUMN category VARCHAR(50);

-- Rollback:
-- ALTER TABLE pills DROP COLUMN category;
```

### 3. Update DATABASE_SPEC.md

Always update DATABASE_SPEC.md after making changes.

### 4. Commit to Git

```bash
git add database/
git commit -m "feat(db): add category column to pills table"
```

---

## New Team Member Setup

```sql
-- 1. Create database
CREATE DATABASE timetopill;
USE timetopill;

-- 2. Run migration files in order
-- V001 -> V002 -> V003 -> ...
SOURCE migrations/V001_init_schema.sql;
SOURCE migrations/V002_example_add_column.sql;
```

---

## Guidelines

1. **Avoid conflicts**: Always pull latest before creating new migration
2. **Include rollback**: Document how to undo changes
3. **Test locally**: Verify changes work before pushing
4. **Keep spec updated**: Sync DATABASE_SPEC.md with every change

---

## Useful Commands

```sql
-- Show table structure
DESCRIBE users;

-- List all tables
SHOW TABLES;

-- Run specific migration
SOURCE migrations/V003_add_pill_category.sql;
```
