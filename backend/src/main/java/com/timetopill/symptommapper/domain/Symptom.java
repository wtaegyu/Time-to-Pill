package com.timetopill.symptommapper.domain;

import jakarta.persistence.*;
import lombok.Getter;

@Entity @Table(name="symptom")
@Getter
public class Symptom {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true)
    private String code;

    @Column(name="display_name_ko", nullable=false)
    private String displayNameKo;

    @Column(nullable=false)
    private boolean active;
}
