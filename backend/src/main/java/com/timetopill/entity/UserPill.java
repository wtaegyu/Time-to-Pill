package com.timetopill.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
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
    @JoinColumn(name = "pill_id", referencedColumnName = "item_seq") // [중요] item_seq 참조 명시
    private DrugOverview drug;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}