package com.timetopill.controller;

import com.timetopill.dto.DrugSearchDto;
import com.timetopill.service.PillService; // [중요] PillService import
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pills")
@RequiredArgsConstructor
public class PillController {

    private final PillService pillService; // [변경] UserPillService -> PillService

    // 1. 내 약통 조회
    @GetMapping("/my")
    public List<DrugSearchDto> getMyPills(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return pillService.getMyPills(userId);
    }

    // 2. 내 약통에 추가
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
}