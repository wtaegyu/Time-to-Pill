package com.timetopill.dto;

import com.timetopill.entity.Schedule;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ScheduleDto {

    public record ScheduleResponse(
            Long id,
            LocalDate scheduleDate,
            boolean isTaken,
            LocalDateTime takenAt,

            // [수정 포인트 1] PillDto.PillResponse -> DrugSearchDto 로 변경
            DrugSearchDto drug
    ) {
        public static ScheduleResponse from(Schedule schedule) {
            return new ScheduleResponse(
                    schedule.getId(),
                    schedule.getScheduleDate(),
                    schedule.isTaken(),
                    schedule.getTakenAt(),

                    // [수정 포인트 2] Schedule에 있는 DrugOverview를 DTO로 변환
                    // (DrugSearchDto.from 메서드 활용)
                    DrugSearchDto.from(schedule.getDrug())
            );
        }
    }
}