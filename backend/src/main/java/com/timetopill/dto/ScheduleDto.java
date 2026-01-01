package com.timetopill.dto;

import com.timetopill.entity.Schedule;

public class ScheduleDto {

    // 스케줄 응답
    public record ScheduleResponse(
        Long id,
        Long pillId,
        PillDto.PillResponse pill,
        String time,
        boolean taken,
        String date
    ) {
        public static ScheduleResponse from(Schedule schedule) {
            return new ScheduleResponse(
                schedule.getId(),
                schedule.getPill().getId(),
                PillDto.PillResponse.fromWithoutWarnings(schedule.getPill()),
                schedule.getScheduleTime().name(),
                schedule.getTaken(),
                schedule.getScheduleDate().toString()
            );
        }
    }

    // 스케줄 생성 요청
    public record CreateScheduleRequest(
        Long pillId,
        String scheduleTime,
        String scheduleDate
    ) {}
}
