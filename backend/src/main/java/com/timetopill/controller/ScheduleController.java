package com.timetopill.controller;

import com.timetopill.dto.ScheduleDto.*;
import com.timetopill.service.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    // 월별 복약 기록 조회 (캘린더용)
    @GetMapping("/month")
    public ResponseEntity<Map<String, Map<String, Object>>> getMonthSchedule(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam int year,
            @RequestParam int month) {

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<ScheduleResponse> schedules = scheduleService.getScheduleByDateRange(userId, startDate, endDate);

        // 날짜별로 그룹화
        Map<String, Map<String, Object>> result = new java.util.HashMap<>();

        Map<String, List<ScheduleResponse>> grouped = schedules.stream()
            .collect(Collectors.groupingBy(s -> s.scheduleDate().toString()));

        for (Map.Entry<String, List<ScheduleResponse>> entry : grouped.entrySet()) {
            List<ScheduleResponse> list = entry.getValue();
            int total = list.size();
            int taken = (int) list.stream().filter(ScheduleResponse::isTaken).count();

            List<Map<String, Object>> pills = new java.util.ArrayList<>();
            for (ScheduleResponse s : list) {
                Map<String, Object> pill = new java.util.HashMap<>();
                pill.put("id", s.id());
                pill.put("name", s.drug().getItemName());
                pill.put("time", "morning");
                pill.put("taken", s.isTaken());
                pills.add(pill);
            }

            Map<String, Object> dayData = new java.util.HashMap<>();
            dayData.put("total", total);
            dayData.put("taken", taken);
            dayData.put("pills", pills);

            result.put(entry.getKey(), dayData);
        }

        return ResponseEntity.ok(result);
    }
}
