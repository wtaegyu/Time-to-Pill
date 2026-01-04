package com.timetopill.service;

import com.timetopill.dto.DrugSearchDto;
import com.timetopill.dto.PillScheduleRequest;
import com.timetopill.dto.UserPillResponse;
import com.timetopill.entity.*;
import com.timetopill.repository.DrugOverviewRepository;
import com.timetopill.repository.ScheduleRepository;
import com.timetopill.repository.UserPillRepository;
import com.timetopill.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class PillService {

    private final UserPillRepository userPillRepository;
    private final DrugOverviewRepository drugRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;

    // 1. 내 약통 조회 (스케줄 정보 포함)
    @Transactional(readOnly = true)
    public List<UserPillResponse> getMyPillsWithSchedule(Long userId) {
        List<UserPill> userPills = userPillRepository.findByUserIdWithPill(userId);
        return userPills.stream()
                .map(UserPillResponse::from)
                .collect(Collectors.toList());
    }

    // 1-1. 내 약통 조회 (기존 호환용)
    @Transactional(readOnly = true)
    public List<DrugSearchDto> getMyPills(Long userId) {
        List<UserPill> userPills = userPillRepository.findByUserIdWithPill(userId);
        return userPills.stream()
                .map(userPill -> DrugSearchDto.from(userPill.getDrug()))
                .collect(Collectors.toList());
    }

    // 2. 내 약통에 추가 (스케줄 설정 포함)
    public void addPillWithSchedule(Long userId, PillScheduleRequest request) {
        log.info("약 추가 (스케줄 포함) - User: {}, ItemSeq: {}", userId, request.getItemSeq());

        if (userPillRepository.existsByUserIdAndDrug_ItemSeq(userId, request.getItemSeq())) {
            throw new IllegalArgumentException("이미 내 약통에 있는 약입니다.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        DrugOverview drug = drugRepository.findById(request.getItemSeq())
                .orElseThrow(() -> new RuntimeException("약 정보를 찾을 수 없습니다."));

        // UserPill 저장
        UserPill userPill = new UserPill();
        userPill.setUser(user);
        userPill.setDrug(drug);
        userPill.setStartDate(request.getStartDate() != null ? request.getStartDate() : LocalDate.now());
        userPill.setEndDate(request.getEndDate());
        userPill.setFrequency(request.getFrequency() != null ? request.getFrequency() : Frequency.DAILY);
        userPill.setCustomDays(request.getCustomDays() != null ? String.join(",", request.getCustomDays()) : null);
        userPill.setTimeSlots(request.getTimeSlots() != null ? String.join(",", request.getTimeSlots()) : "MORNING");
        userPill.setActive(true);

        userPillRepository.save(userPill);

        // Schedule 엔트리 생성 (향후 30일)
        generateSchedules(userPill, user, drug);

        log.info("약 및 스케줄 저장 완료!");
    }

    // 2-1. 간단 추가 (기존 호환용)
    public void addPill(Long userId, String itemSeq) {
        log.info("약 추가 (간단) - User: {}, ItemSeq: {}", userId, itemSeq);

        if (userPillRepository.existsByUserIdAndDrug_ItemSeq(userId, itemSeq)) {
            throw new IllegalArgumentException("이미 내 약통에 있는 약입니다.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        DrugOverview drug = drugRepository.findById(itemSeq)
                .orElseThrow(() -> new RuntimeException("약 정보를 찾을 수 없습니다."));

        UserPill userPill = new UserPill();
        userPill.setUser(user);
        userPill.setDrug(drug);
        userPill.setStartDate(LocalDate.now());
        userPill.setFrequency(Frequency.DAILY);
        userPill.setTimeSlots("MORNING");
        userPill.setActive(true);

        userPillRepository.save(userPill);

        // 기본 스케줄 생성 (매일 아침)
        generateSchedules(userPill, user, drug);

        log.info("DB 저장 성공!");
    }

    // 3. 내 약통에서 삭제
    public void deletePill(Long userId, String itemSeq) {
        // 관련 스케줄도 삭제
        scheduleRepository.deleteAll(
            scheduleRepository.findByUserIdAndDrug_ItemSeq(userId, itemSeq)
        );
        userPillRepository.deleteByUserIdAndDrug_ItemSeq(userId, itemSeq);
    }

    // 4. 스케줄 수정
    public void updateSchedule(Long userId, String itemSeq, PillScheduleRequest request) {
        UserPill userPill = userPillRepository.findByUserIdAndDrug_ItemSeq(userId, itemSeq)
                .orElseThrow(() -> new RuntimeException("등록된 약을 찾을 수 없습니다."));

        userPill.setStartDate(request.getStartDate());
        userPill.setEndDate(request.getEndDate());
        userPill.setFrequency(request.getFrequency());
        userPill.setCustomDays(request.getCustomDays() != null ? String.join(",", request.getCustomDays()) : null);
        userPill.setTimeSlots(request.getTimeSlots() != null ? String.join(",", request.getTimeSlots()) : "MORNING");

        userPillRepository.save(userPill);

        // 기존 미래 스케줄 삭제 후 재생성
        LocalDate today = LocalDate.now();
        List<Schedule> futureSchedules = scheduleRepository.findByUserIdAndDrug_ItemSeq(userId, itemSeq)
                .stream()
                .filter(s -> !s.getScheduleDate().isBefore(today))
                .collect(Collectors.toList());
        scheduleRepository.deleteAll(futureSchedules);

        generateSchedules(userPill, userPill.getUser(), userPill.getDrug());
    }

    // 스케줄 생성 헬퍼 메서드 (향후 30일)
    private void generateSchedules(UserPill userPill, User user, DrugOverview drug) {
        LocalDate startDate = userPill.getStartDate() != null ? userPill.getStartDate() : LocalDate.now();
        LocalDate endDate = userPill.getEndDate() != null ? userPill.getEndDate() : startDate.plusDays(30);

        // 최대 30일까지만 생성
        if (endDate.isAfter(startDate.plusDays(30))) {
            endDate = startDate.plusDays(30);
        }

        Frequency frequency = userPill.getFrequency() != null ? userPill.getFrequency() : Frequency.DAILY;

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            if (shouldCreateSchedule(date, frequency, userPill.getCustomDays(), startDate)) {
                Schedule schedule = new Schedule();
                schedule.setUser(user);
                schedule.setDrug(drug);
                schedule.setScheduleDate(date);
                schedule.setTaken(false);

                scheduleRepository.save(schedule);
            }
        }
    }

    // 해당 날짜에 스케줄 생성해야 하는지 확인
    private boolean shouldCreateSchedule(LocalDate date, Frequency frequency, String customDays, LocalDate startDate) {
        switch (frequency) {
            case DAILY:
                return true;

            case EVERY_OTHER_DAY:
                long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(startDate, date);
                return daysBetween % 2 == 0;

            case EVERY_3_DAYS:
                long days3 = java.time.temporal.ChronoUnit.DAYS.between(startDate, date);
                return days3 % 3 == 0;

            case WEEKLY:
                return date.getDayOfWeek() == startDate.getDayOfWeek();

            case CUSTOM:
                if (customDays == null || customDays.isEmpty()) return false;
                String dayOfWeek = date.getDayOfWeek().toString().substring(0, 3); // MON, TUE, etc.
                return customDays.toUpperCase().contains(dayOfWeek);

            default:
                return true;
        }
    }
}