package com.timetopill.symptommapper.domain;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name = "typo_correction")
public class TypoCorrection {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String pattern;   // 예: "츠통"

    @Column(nullable = false)
    private String correct;   // 예: "치통"

    @Column(nullable = false)
    private int priority;     // 우선순위 높을수록 먼저 적용하고 싶으면 정렬 반대로

    @Column(nullable = false)
    private boolean active;
}
