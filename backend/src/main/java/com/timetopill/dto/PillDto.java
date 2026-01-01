package com.timetopill.dto;

import com.timetopill.entity.Pill;
import com.timetopill.entity.PillWarning;
import java.util.List;

public class PillDto {

    // 약 정보 응답
    public record PillResponse(
        Long id,
        String name,
        String description,
        String dosage,
        String imageUrl,
        List<WarningDto> warnings
    ) {
        public static PillResponse from(Pill pill) {
            return new PillResponse(
                pill.getId(),
                pill.getName(),
                pill.getDescription(),
                pill.getDosage(),
                pill.getImageUrl(),
                pill.getWarnings().stream()
                    .map(WarningDto::from)
                    .toList()
            );
        }

        public static PillResponse fromWithoutWarnings(Pill pill) {
            return new PillResponse(
                pill.getId(),
                pill.getName(),
                pill.getDescription(),
                pill.getDosage(),
                pill.getImageUrl(),
                List.of()
            );
        }
    }

    // 약 경고 DTO
    public record WarningDto(
        String type,
        String message
    ) {
        public static WarningDto from(PillWarning warning) {
            return new WarningDto(
                warning.getWarningType().name(),
                warning.getMessage()
            );
        }
    }
}
