package com.timetopill.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@Table(name = "user_pills")
public class UserPill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pill_id", referencedColumnName = "item_seq")
    private DrugOverview drug;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // ===== 복용 스케줄 설정 =====

    @Column(name = "start_date")
    private LocalDate startDate;  // 복용 시작일

    @Column(name = "end_date")
    private LocalDate endDate;    // 복용 종료일 (null = 무기한)

    @Enumerated(EnumType.STRING)
    @Column(name = "frequency")
    private Frequency frequency = Frequency.DAILY;  // 복용 빈도

    // 특정 요일 선택 (CUSTOM일 때 사용, 쉼표 구분: "MON,WED,FRI")
    @Column(name = "custom_days")
    private String customDays;

    // 복용 시간대 (쉼표 구분: "MORNING,EVENING")
    @Column(name = "time_slots")
    private String timeSlots = "MORNING";

    @Column(name = "is_active")
    private boolean isActive = true;  // 활성 상태
}