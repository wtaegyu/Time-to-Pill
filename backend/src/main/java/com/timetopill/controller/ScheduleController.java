package com.timetopill.controller;

import com.timetopill.dto.ScheduleDto.*;
import com.timetopill.service.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    // TODO: JWT 토큰에서 userId 추출하는 로직 필요
    @GetMapping("/today")
    public ResponseEntity<List<ScheduleResponse>> getTodaySchedule(@RequestHeader("X-User-Id") Long userId) {
        List<ScheduleResponse> schedules = scheduleService.getTodaySchedule(userId);
        return ResponseEntity.ok(schedules);
    }

    @PutMapping("/{id}/taken")
    public ResponseEntity<Void> markAsTaken(@PathVariable Long id) {
        scheduleService.markAsTaken(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/untaken")
    public ResponseEntity<Void> markAsNotTaken(@PathVariable Long id) {
        scheduleService.markAsNotTaken(id);
        return ResponseEntity.ok().build();
    }
}
