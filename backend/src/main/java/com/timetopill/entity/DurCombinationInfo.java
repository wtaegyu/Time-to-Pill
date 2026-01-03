package com.timetopill.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "dur_combination_info", indexes = {
        @Index(name = "idx_combo_code_a", columnList = "item_code_a"),
        @Index(name = "idx_combo_code_b", columnList = "item_code_b")
})
public class DurCombinationInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 약물 A 정보
    @Column(name = "item_code_a")
    private String itemCodeA; // 제품코드A

    @Column(name = "item_name_a")
    private String itemNameA; // 제품명A

    // 약물 B 정보
    @Column(name = "item_code_b")
    private String itemCodeB; // 제품코드B

    @Column(name = "item_name_b")
    private String itemNameB; // 제품명B

    // 금기 내용 (상세 사유)
    @Column(name = "prohibited_content", columnDefinition = "TEXT")
    private String prohibitedContent;

    // 비고
    @Column(columnDefinition = "TEXT")
    private String remark;
}