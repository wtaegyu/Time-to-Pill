package com.timetopill.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "dur_info") // 파이썬이 만든 테이블 이름
public class DurInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // [변경] item_seq -> item_code (파이썬과 일치시킴)
    @Column(name = "item_code", nullable = false)
    private String itemCode;

    // [추가] 약 이름 필드 추가
    @Column(name = "item_name")
    private String itemName;

    // 금기 종류 (연령금기, 임부금기 등)
    @Column(name = "type_name")
    private String typeName;

    // [변경] prohbt_content -> prohibited_content (파이썬과 일치시킴)
    @Column(name = "prohibited_content", length = 1000)
    private String prohibitedContent;

    // [변경] mixture_item_name -> remark (비고란으로 변경)
    @Column(name = "remark")
    private String remark;

    // 생성자 (필요하다면 수정된 필드에 맞춰서 다시 만들어야 함, 일단 JPA용 빈 생성자는 @NoArgsConstructor로 해결됨)
}