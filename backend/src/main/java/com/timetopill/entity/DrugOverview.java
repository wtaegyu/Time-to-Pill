package com.timetopill.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "drug_overview") // 파이썬이 만든 테이블 이름
public class DrugOverview {

    @Id
    @Column(name = "item_seq") // 파이썬: item_seq
    private String itemSeq;

    @Column(name = "item_name", length = 1000) // 파이썬: item_name
    private String itemName;

    @Column(name = "entp_name") // 파이썬: entp_name
    private String entpName;

    @Column(name = "efficacy_text", length = 4000) // 파이썬: efficacy_text
    private String efficacyText;

    @Column(name = "use_method_text", length = 4000) // 파이썬: use_method_text
    private String useMethodText;

    @Column(name = "warning_text_1", length = 4000) // 파이썬: warning_text_1
    private String warningText1;

    // 주성분 (파이썬 스크립트에 이 컬럼이 없다면 에러가 날 수 있으니 일단 주석 처리하거나 확인 필요)
    // @Column(name = "main_item_ingr")
    // private String mainIngr;
}