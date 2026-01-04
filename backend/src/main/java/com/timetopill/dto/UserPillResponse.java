package com.timetopill.dto;

import com.timetopill.entity.Frequency;
import com.timetopill.entity.UserPill;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Getter
@Builder
public class UserPillResponse {
    private Long id;
    private DrugSearchDto drug;

    // 스케줄 설정
    private LocalDate startDate;
    private LocalDate endDate;
    private Frequency frequency;
    private List<String> customDays;
    private List<String> timeSlots;
    private boolean isActive;

    public static UserPillResponse from(UserPill userPill) {
        return UserPillResponse.builder()
                .id(userPill.getId())
                .drug(DrugSearchDto.from(userPill.getDrug()))
                .startDate(userPill.getStartDate())
                .endDate(userPill.getEndDate())
                .frequency(userPill.getFrequency())
                .customDays(userPill.getCustomDays() != null
                    ? Arrays.asList(userPill.getCustomDays().split(","))
                    : null)
                .timeSlots(userPill.getTimeSlots() != null
                    ? Arrays.asList(userPill.getTimeSlots().split(","))
                    : List.of("MORNING"))
                .isActive(userPill.isActive())
                .build();
    }
}
