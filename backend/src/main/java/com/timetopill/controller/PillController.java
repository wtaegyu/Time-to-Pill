package com.timetopill.controller;

import com.timetopill.dto.DrugSearchDto;
import com.timetopill.dto.PillScheduleRequest;
import com.timetopill.dto.UserPillResponse;
import com.timetopill.service.PillService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pills")
@RequiredArgsConstructor
public class PillController {

    private final PillService pillService;

    // 1. 내 약통 조회 (스케줄 정보 포함)
    @GetMapping("/my")
    public List<UserPillResponse> getMyPills(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return pillService.getMyPillsWithSchedule(userId);
    }

    // 2. 내 약통에 추가 (스케줄 설정 포함)
    @PostMapping("/my")
    public String addMyPillWithSchedule(@AuthenticationPrincipal UserDetails userDetails,
                                        @RequestBody PillScheduleRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        pillService.addPillWithSchedule(userId, request);
        return "약통에 추가되었습니다.";
    }

    // 2-1. 간단 추가 (기존 호환용 - 스케줄 없이)
    @PostMapping("/my/{itemSeq}")
    public String addMyPill(@AuthenticationPrincipal UserDetails userDetails,
                            @PathVariable("itemSeq") String itemSeq) {
        Long userId = Long.parseLong(userDetails.getUsername());
        pillService.addPill(userId, itemSeq);
        return "약통에 추가되었습니다.";
    }

    // 3. 내 약통에서 삭제
    @DeleteMapping("/my/{itemSeq}")
    public String deleteMyPill(@AuthenticationPrincipal UserDetails userDetails,
                               @PathVariable("itemSeq") String itemSeq) {
        Long userId = Long.parseLong(userDetails.getUsername());
        pillService.deletePill(userId, itemSeq);
        return "약통에서 삭제되었습니다.";
    }

    // 4. 스케줄 수정
    @PutMapping("/my/{itemSeq}/schedule")
    public String updateSchedule(@AuthenticationPrincipal UserDetails userDetails,
                                 @PathVariable("itemSeq") String itemSeq,
                                 @RequestBody PillScheduleRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        pillService.updateSchedule(userId, itemSeq, request);
        return "스케줄이 수정되었습니다.";
    }
}