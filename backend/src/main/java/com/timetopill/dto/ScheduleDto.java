package com.timetopill.dto;

import com.timetopill.entity.Schedule;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ScheduleDto {

    public record ScheduleResponse(
            Long id,
            String date,           // scheduleDate -> date (프론트엔드 호환)
            String time,           // 아침/점심/저녁
            boolean taken,         // isTaken -> taken (프론트엔드 호환)
            LocalDateTime takenAt,
            PillInfo pill          // drug -> pill (프론트엔드 호환)
    ) {
        public static ScheduleResponse from(Schedule schedule) {
            return new ScheduleResponse(
                    schedule.getId(),
                    schedule.getScheduleDate().toString(),
                    schedule.getScheduleTime() != null ? schedule.getScheduleTime().name() : "morning",
                    schedule.isTaken(),
                    schedule.getTakenAt(),
                    PillInfo.from(schedule.getDrug())
            );
        }
    }

    // 프론트엔드 Pill 타입과 호환되는 DTO
    public record PillInfo(
            String itemSeq,
            String name,
            String entpName,
            String description,
            String dosage,
            java.util.List<WarningInfo> warnings
    ) {
        public static PillInfo from(com.timetopill.entity.DrugOverview drug) {
            return new PillInfo(
                    drug.getItemSeq(),
                    drug.getItemName(),
                    drug.getEntpName() != null ? drug.getEntpName() : "",
                    drug.getEfficacyText() != null ? drug.getEfficacyText() : "",
                    drug.getUseMethodText() != null ? drug.getUseMethodText() : "",
                    java.util.Collections.emptyList() // TODO: DUR 정보 추가 가능
            );
        }
    }

    public record WarningInfo(
            String type,
            String message
    ) {}
}
