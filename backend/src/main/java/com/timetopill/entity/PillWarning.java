package com.timetopill.entity;

import com.timetopill.config.TableNames;
import jakarta.persistence.*;

@Entity
@Table(name = TableNames.PILL_WARNINGS)
public class PillWarning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pill_id", nullable = false)
    private Pill pill;

    @Enumerated(EnumType.STRING)
    @Column(name = "warning_type", nullable = false)
    private WarningType warningType;

    @Column(columnDefinition = "TEXT")
    private String message;

    public enum WarningType {
        drowsiness, interaction, pregnancy, alcohol
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Pill getPill() { return pill; }
    public void setPill(Pill pill) { this.pill = pill; }

    public WarningType getWarningType() { return warningType; }
    public void setWarningType(WarningType warningType) { this.warningType = warningType; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
