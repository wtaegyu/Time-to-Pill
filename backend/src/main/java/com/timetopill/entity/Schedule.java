package com.timetopill.entity;

import com.timetopill.config.TableNames;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@Table(name = TableNames.SCHEDULES)
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_seq", nullable = false)
    private DrugOverview drug;

    @Column(name = "schedule_date", nullable = false)
    private LocalDate scheduleDate;

    // 복용 시간대 (아침/점심/저녁)
    @Enumerated(EnumType.STRING)
    @Column(name = "schedule_time")
    private TimeSlot scheduleTime;

    @Column(name = "is_taken")
    private boolean isTaken = false;

    @Column(name = "taken_at")
    private LocalDateTime takenAt;

    // 시간대 Enum
    public enum TimeSlot {
        morning, afternoon, evening
    }
}
