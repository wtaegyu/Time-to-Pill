package com.timetopill.service;

import com.timetopill.dto.DrugSearchDto;
import com.timetopill.entity.DrugOverview;
import com.timetopill.entity.DurInfo;
import com.timetopill.repository.DrugOverviewRepository;
import com.timetopill.repository.DurInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // 로그용
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j // 로그 기능을 켭니다
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SearchService {

    private final DrugOverviewRepository drugRepository;
    private final DurInfoRepository durInfoRepository;

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

    // 2. 증상 검색
    public List<DrugSearchDto> searchBySymptom(String keyword) {
        try {
            log.info("🔍 증상 검색 시작: {}", keyword);
            List<DrugOverview> drugs = drugRepository.findByEfficacyTextContaining(keyword);
            log.info("✅ 증상 검색 결과: {}건 발견", drugs.size());

            return drugs.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("❌ 증상 검색 중 치명적 에러 발생!", e);
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