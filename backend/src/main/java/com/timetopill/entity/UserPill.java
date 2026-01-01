package com.timetopill.entity;

import com.timetopill.config.TableNames;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = TableNames.USER_PILLS,
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "pill_id"}))
public class UserPill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pill_id", nullable = false)
    private Pill pill;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

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

    public LocalDateTime getCreatedAt() { return createdAt; }
}
