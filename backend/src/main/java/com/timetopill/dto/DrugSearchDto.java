package com.timetopill.dto;

import com.timetopill.entity.DrugOverview;
import com.timetopill.entity.DurInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor // JSON 파싱 에러 방지용
@AllArgsConstructor // Builder 패턴 사용 시 필요
public class DrugSearchDto {

    private String itemSeq;
    private String itemName;
    private String entpName;
    private String efficacy;
    private String useMethod;
    private String precautionData;
    private String itemImage;

    // [중요] DurInfo는 이제 entity 패키지에 있는 것을 사용합니다.
    private List<DurInfo> durInfoList;

    // 1. 편의 메서드 (약 정보 + 금기 정보 포함)
    public static DrugSearchDto from(DrugOverview drug, List<DurInfo> durList) {
        return DrugSearchDto.builder()
                .itemSeq(drug.getItemSeq())
                .itemName(drug.getItemName())
                .entpName(drug.getEntpName())

                // [체크] DrugOverview 엔티티의 필드명이 'efficacyText'여야 함
                .efficacy(drug.getEfficacyText())

                // [체크] DrugOverview 엔티티의 필드명이 'useMethodText'여야 함
                .useMethod(drug.getUseMethodText())

                // [체크] DrugOverview 엔티티의 필드명이 'warningText1'이어야 함
                .precautionData(drug.getWarningText1())

                .itemImage(null) // 이미지는 현재 없으므로 null
                .durInfoList(durList)
                .build();
    }

    // 2. 편의 메서드 (약 정보만 있을 때)
    public static DrugSearchDto from(DrugOverview drug) {
        return from(drug, new ArrayList<>());
    }
}