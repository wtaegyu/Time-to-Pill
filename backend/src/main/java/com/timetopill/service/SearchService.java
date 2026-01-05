package com.timetopill.service;

import com.timetopill.dto.DrugSearchDto;
import com.timetopill.entity.DrugOverview;
import com.timetopill.entity.DurInfo;
import com.timetopill.repository.DrugOverviewRepository;
import com.timetopill.repository.DurInfoRepository;
import com.timetopill.repository.UserPillRepository;
import com.timetopill.symptommapper.mapping.MatchResult;
import com.timetopill.symptommapper.service.MappingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SearchService {

    private final DrugOverviewRepository drugRepository;
    private final DurInfoRepository durInfoRepository;
    private final UserPillRepository userPillRepository;
    private final MappingService mappingService;

    // 1. 이름 검색
    public List<DrugSearchDto> searchByName(String keyword) {
        try {
            log.info("🔍 이름 검색 시작: {}", keyword);
            List<DrugOverview> drugs = drugRepository.findByItemNameContaining(keyword);
            log.info("✅ 이름 검색 결과: {}건 발견", drugs.size());

            return drugs.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("❌ 이름 검색 중 치명적 에러 발생!", e); // 여기가 핵심입니다!
            throw e; // 에러를 다시 던져서 컨트롤러가 알게 함
        }
    }

    // 2. 증상 검색 (MappingService로 증상 정규화 후 검색)
    public List<DrugSearchDto> searchBySymptom(String keyword) {
        try {
            log.info("🔍 증상 검색 시작: {}", keyword);

            // 1) MappingService로 증상 정규화/매핑
            List<MatchResult> mappedSymptoms = mappingService.mapSymptoms(keyword);
            log.info("📊 매핑된 증상: {}", mappedSymptoms.stream()
                    .map(m -> m.displayNameKo() + "(" + m.confidence() + ")")
                    .collect(Collectors.joining(", ")));

            // 2) 매핑된 증상들로 검색 (중복 제거를 위해 LinkedHashSet 사용)
            Set<DrugOverview> resultSet = new LinkedHashSet<>();

            for (MatchResult match : mappedSymptoms) {
                // 표준 증상명(한글)으로 efficacyText 검색
                String symptomName = match.displayNameKo();
                List<DrugOverview> drugs = drugRepository.findByEfficacyTextContaining(symptomName);
                resultSet.addAll(drugs);
                log.info("  → '{}' 검색 결과: {}건", symptomName, drugs.size());
            }

            // 3) 매핑 실패 시 기존 LIKE 검색 폴백
            if (mappedSymptoms.isEmpty()) {
                log.info("⚠️ 매핑 실패, 원본 키워드로 폴백 검색: {}", keyword);
                resultSet.addAll(drugRepository.findByEfficacyTextContaining(keyword));
            }

            log.info("✅ 증상 검색 최종 결과: {}건 발견", resultSet.size());

            return resultSet.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("❌ 증상 검색 중 치명적 에러 발생!", e);
            throw e;
        }
    }

    // 3. 인기 약품 조회 (사용자들이 가장 많이 추가한 약)
    public List<DrugSearchDto> getPopularPills(int limit) {
        try {
            log.info("🔍 인기 약품 조회 시작 (상위 {}개)", limit);

            // 가장 많이 추가된 약의 itemSeq 목록 조회
            List<Object[]> popularIds = userPillRepository.findPopularPillIds(PageRequest.of(0, limit));

            if (popularIds.isEmpty()) {
                log.info("⚠️ 등록된 약이 없음, 빈 리스트 반환");
                return Collections.emptyList();
            }

            // itemSeq로 약 상세 정보 조회 (순서 유지)
            List<DrugSearchDto> result = new ArrayList<>();
            for (Object[] row : popularIds) {
                String itemSeq = (String) row[0];
                Long count = (Long) row[1];
                log.debug("  → {} (등록 수: {})", itemSeq, count);

                drugRepository.findById(itemSeq)
                        .ifPresent(drug -> result.add(convertToDto(drug)));
            }

            log.info("✅ 인기 약품 조회 완료: {}건", result.size());
            return result;
        } catch (Exception e) {
            log.error("❌ 인기 약품 조회 중 에러 발생!", e);
            throw e;
        }
    }

    // DTO 변환 (금기 정보 포함)
    private DrugSearchDto convertToDto(DrugOverview drug) {
        try {
            // 약 코드로 금기사항 조회
            List<DurInfo> durList = durInfoRepository.findByItemCode(drug.getItemSeq());
            return DrugSearchDto.from(drug, durList);
        } catch (Exception e) {
            // 금기사항 조회하다 에러나면, 약 정보라도 보여주기 위해 로그만 찍고 빈 리스트 처리
            log.warn("⚠️ 금기사항(DUR) 조회 실패 (약 코드: {}): {}", drug.getItemSeq(), e.getMessage());
            return DrugSearchDto.from(drug, Collections.emptyList());
        }
    }
}