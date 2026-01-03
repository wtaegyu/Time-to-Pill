package com.timetopill.entity;

import com.timetopill.config.TableNames; // 혹시 TableNames가 없다면 문자열 "schedules"로 대체 가능
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@Table(name = TableNames.SCHEDULES) // TableNames 클래스가 없다면 @Table(name = "schedules") 로 변경
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ==========================================
    // [수정 포인트] Pill -> DrugOverview 교체
    // ==========================================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_seq", nullable = false) // DrugOverview의 PK (item_seq)와 연결
    private DrugOverview drug;

    @Column(name = "schedule_date", nullable = false)
    private LocalDate scheduleDate;

    @Column(name = "is_taken")
    private boolean isTaken = false;

    @Column(name = "taken_at")
    private LocalDateTime takenAt;

    // 시간대(아침/점심/저녁)가 필요하다면 추가
    // @Enumerated(EnumType.STRING)
    // private TimeSlot timeSlot;
}