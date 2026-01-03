package com.timetopill.symptommapper.domain;

import jakarta.persistence.*;
import lombok.Getter;

@Entity @Table(name="symptom_alias")
@Getter
public class SymptomAlias {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="symptom_id", nullable=false)
    private Long symptomId;

    @Column(nullable=false)
    private String alias;

    @Column(name="normalized_alias", nullable=false)
    private String normalizedAlias;

    @Column(nullable=false)
    private double weight;

    @Column(nullable=false)
    private boolean active;
}
