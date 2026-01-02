package com.timetopill.config;

/**
 * 데이터베이스 테이블 이름 상수 모음
 * 현재 사용 중인 테이블 이름과 100% 일치시켜 둠.
 */
public final class TableNames {

    private TableNames() {}

    // 1. 사용자 테이블
    public static final String USERS = "users";

    // 2. 약 전체 정보 (식약처 데이터) - [변경] pills -> drug_overview
    public static final String DRUG_OVERVIEW = "drug_overview";

    // 3. 금기 정보 (DUR) - [추가]
    public static final String DUR_INFO = "dur_info";
    public static final String DUR_COMBINATION_INFO = "dur_combination_info";

    // 4. 내 약통 (사용자가 추가한 약)
    public static final String USER_PILLS = "user_pills";

    // 5. 복용 일정
    public static final String SCHEDULES = "schedules";

}