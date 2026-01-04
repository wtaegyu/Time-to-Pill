package com.timetopill.dto;

import com.timetopill.entity.Frequency;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class PillScheduleRequest {
    private String itemSeq;           // 약 품목일련번호
    private LocalDate startDate;       // 시작일
    private LocalDate endDate;         // 종료일 (null = 무기한)
    private Frequency frequency;       // 복용 빈도
    private List<String> customDays;   // 특정 요일 (CUSTOM일 때): ["MON", "WED", "FRI"]
    private List<String> timeSlots;    // 복용 시간대: ["MORNING", "EVENING"]
}
