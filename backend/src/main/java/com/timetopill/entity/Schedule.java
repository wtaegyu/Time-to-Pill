package com.timetopill.entity;

import com.timetopill.config.TableNames;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = TableNames.SCHEDULES,
       indexes = {
           @Index(name = "idx_schedules_user_date", columnList = "user_id, schedule_date")
       })
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pill_id", nullable = false)
    private Pill pill;

    @Enumerated(EnumType.STRING)
    @Column(name = "schedule_time", nullable = false)
    private ScheduleTime scheduleTime;

    @Column(name = "schedule_date", nullable = false)
    private LocalDate scheduleDate;

    @Column(nullable = false)
    private Boolean taken = false;

    @Column(name = "taken_at")
    private LocalDateTime takenAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum ScheduleTime {
        morning, afternoon, evening
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Pill getPill() { return pill; }
    public void setPill(Pill pill) { this.pill = pill; }

    public ScheduleTime getScheduleTime() { return scheduleTime; }
    public void setScheduleTime(ScheduleTime scheduleTime) { this.scheduleTime = scheduleTime; }

    public LocalDate getScheduleDate() { return scheduleDate; }
    public void setScheduleDate(LocalDate scheduleDate) { this.scheduleDate = scheduleDate; }

    public Boolean getTaken() { return taken; }
    public void setTaken(Boolean taken) { this.taken = taken; }

    public LocalDateTime getTakenAt() { return takenAt; }
    public void setTakenAt(LocalDateTime takenAt) { this.takenAt = takenAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
