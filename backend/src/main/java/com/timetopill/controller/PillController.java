package com.timetopill.controller;

import com.timetopill.dto.PillDto.*;
import com.timetopill.entity.User;
import com.timetopill.service.AuthService;
import com.timetopill.service.PillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pills")
public class PillController {

    private final PillService pillService;
    private final AuthService authService;

    public PillController(PillService pillService, AuthService authService) {
        this.pillService = pillService;
        this.authService = authService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<PillResponse>> searchByName(@RequestParam String name) {
        List<PillResponse> pills = pillService.searchByName(name);
        return ResponseEntity.ok(pills);
    }

    @GetMapping("/search/symptom")
    public ResponseEntity<List<PillResponse>> searchBySymptom(@RequestParam String symptom) {
        List<PillResponse> pills = pillService.searchBySymptom(symptom);
        return ResponseEntity.ok(pills);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PillResponse> getPillDetail(@PathVariable Long id) {
        PillResponse pill = pillService.getPillDetail(id);
        return ResponseEntity.ok(pill);
    }

    // TODO: JWT 토큰에서 userId 추출하는 로직 필요
    @GetMapping("/my")
    public ResponseEntity<List<PillResponse>> getMyPills(@RequestHeader("X-User-Id") Long userId) {
        List<PillResponse> pills = pillService.getMyPills(userId);
        return ResponseEntity.ok(pills);
    }

    @PostMapping("/my/{pillId}")
    public ResponseEntity<Void> addPill(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long pillId) {
        User user = authService.getUserById(userId);
        pillService.addPillToUser(userId, pillId, user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/my/{pillId}")
    public ResponseEntity<Void> removePill(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long pillId) {
        pillService.removePillFromUser(userId, pillId);
        return ResponseEntity.ok().build();
    }
}
