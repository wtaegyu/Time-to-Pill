package com.timetopill.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.timetopill.entity.DrugOverview;
import com.timetopill.repository.DrugOverviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.http.converter.StringHttpMessageConverter;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DrugFetchService {

    private final DrugOverviewRepository drugRepository;

    @org.springframework.beans.factory.annotation.Value("${api.service-key:}")
    private String SERVICE_KEY;

    private static final String API_URL = "https://apis.data.go.kr/1471000/DrugPrdtPrmsnInfoService07/getDrugPrdtPrmsnDtlInq06";

    @Transactional
    public String fetchAllData() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters()
                .add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));

        ObjectMapper mapper = new ObjectMapper();

        int pageNo = 1;
        int numOfRows = 100;
        int totalSaved = 0;

        while (true) {
            try {
                URI uri = UriComponentsBuilder.fromHttpUrl(API_URL)
                        .queryParam("serviceKey", SERVICE_KEY)
                        .queryParam("pageNo", pageNo)
                        .queryParam("numOfRows", numOfRows)
                        .queryParam("type", "json")
                        .build(true)
                        .toUri();

                log.info("API 호출 중... 페이지: {}", pageNo);
                String response = restTemplate.getForObject(uri, String.class);

                JsonNode root = mapper.readTree(response);
                JsonNode body = root.path("body");
                JsonNode itemsNode = body.path("items");

                if (itemsNode.isMissingNode() || itemsNode.isEmpty()) {
                    break;
                }

                List<DrugOverview> drugList = new ArrayList<>();

                for (JsonNode item : itemsNode) {
                    String itemSeq = getText(item, "ITEM_SEQ");

                    if (drugRepository.existsById(itemSeq)) {
                        continue;
                    }

                    DrugOverview drug = new DrugOverview();
                    drug.setItemSeq(itemSeq);

                    // [중요] DB 컬럼 길이에 맞춰서 안전하게 자르기 (Truncate)
                    // 약 이름: 1000자 제한
                    drug.setItemName(truncate(getText(item, "ITEM_NAME"), 1000));

                    // 업체명: 255자 (기본)
                    drug.setEntpName(truncate(getText(item, "ENTP_NAME"), 255));

                    // 상세 내용: 4000자 제한 (HTML 태그 제거 후)
                    drug.setEfficacyText(truncate(cleanHtml(getText(item, "EE_DOC_DATA")), 4000));
                    drug.setUseMethodText(truncate(cleanHtml(getText(item, "UD_DOC_DATA")), 4000));
                    drug.setWarningText1(truncate(cleanHtml(getText(item, "NB_DOC_DATA")), 4000));

                    // 주성분 (필요 시 주석 해제 및 길이 체크)
                    // drug.setMainIngr(truncate(getText(item, "MAIN_ITEM_INGR"), 2000));

                    drugList.add(drug);
                }

                drugRepository.saveAll(drugList);
                totalSaved += drugList.size();
                log.info("페이지 {} 저장 완료. 누적: {}", pageNo, totalSaved);

                pageNo++;

            } catch (Exception e) {
                log.error("에러 발생: {}", e.getMessage());
                return "에러 발생: " + e.getMessage();
            }
        }
        return "적재 완료! 총 " + totalSaved + "건";
    }

    private String getText(JsonNode node, String fieldName) {
        return node.has(fieldName) ? node.get(fieldName).asText() : "";
    }

    private String cleanHtml(String input) {
        if (input == null || input.isEmpty() || input.equals("null")) return "";
        String text = input.replace("<![CDATA[", "").replace("]]>", "");
        return text.replaceAll("<[^>]*>", " ").replaceAll("\\s+", " ").trim();
    }

    // [추가] 문자열 길이 제한 헬퍼 메서드
    private String truncate(String value, int maxLength) {
        if (value == null) return null;
        if (value.length() > maxLength) {
            return value.substring(0, maxLength);
        }
        return value;
    }
}