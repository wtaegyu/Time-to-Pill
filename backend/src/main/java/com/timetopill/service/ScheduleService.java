package com.timetopill.service;

import com.timetopill.dto.ScheduleDto.*;
import com.timetopill.entity.Schedule;
import com.timetopill.repository.ScheduleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    public ScheduleService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    public List<ScheduleResponse> getTodaySchedule(Long userId) {
        LocalDate today = LocalDate.now();
        return scheduleRepository.findByUserIdAndDate(userId, today).stream()
            .map(ScheduleResponse::from)
            .toList();
    }

    public List<ScheduleResponse> getScheduleByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return scheduleRepository.findByUserIdAndDateRange(userId, startDate, endDate).stream()
            .map(ScheduleResponse::from)
            .toList();
    }

    @Transactional
    public void markAsTaken(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
            .orElseThrow(() -> new IllegalArgumentException("Schedule not found"));

        schedule.setTaken(true);
        schedule.setTakenAt(LocalDateTime.now());

        scheduleRepository.save(schedule);
    }

    @Transactional
    public void markAsNotTaken(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
            .orElseThrow(() -> new IllegalArgumentException("Schedule not found"));

        schedule.setTaken(false);
        schedule.setTakenAt(null);

        scheduleRepository.save(schedule);
    }
}
