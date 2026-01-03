package com.timetopill.symptommapper.domain;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "unmapped_term")
public class UnmappedTerm {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="raw_chunk", nullable=false, length=200)
    private String rawChunk;

    @Column(name="best_score")
    private Double bestScore;

    @Lob
    @Column(name="best_guess_json")
    private String bestGuessJson;

    @Lob
    @Column(name="candidates_json")
    private String candidatesJson;

    @Column(name="created_at", nullable=false, updatable=false, insertable=false)
    private LocalDateTime createdAt;

    protected UnmappedTerm() {}

    public UnmappedTerm(String rawChunk, Double bestScore, String bestGuessJson, String candidatesJson) {
        this.rawChunk = rawChunk;
        this.bestScore = bestScore;
        this.bestGuessJson = bestGuessJson;
        this.candidatesJson = candidatesJson;
    }
}
