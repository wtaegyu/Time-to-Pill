package com.timetopill.symptommapper.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.timetopill.symptommapper.domain.TypoCorrection;
import com.timetopill.symptommapper.domain.UnmappedTerm;
import com.timetopill.symptommapper.mapping.*;
import com.timetopill.symptommapper.repository.TypoCorrectionRepository;
import com.timetopill.symptommapper.repository.UnmappedTermRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MappingService {

    private final TypoCorrectionRepository typoCorrectionRepository;
    private final UnmappedTermRepository unmappedTermRepository;
    private final SymptomMapper symptomMapper;
    private final ObjectMapper objectMapper; // Spring이 기본 제공

    private final InputParser inputParser = new InputParser();
    private final Normalizer normalizer = new Normalizer();
    private final PostProcessor postProcessor = new PostProcessor(true, 0.8);

    public List<MatchResult> mapSymptoms(String rawQuery) {
        // 캐시가 비어있으면 빈 결과 반환 (테이블 미생성 상태)
        if (symptomMapper.isCacheEmpty()) {
            return new ArrayList<>();
        }

        // 1) preprocess
        String pre = Preprocessor.preprocess(rawQuery);

        // 2) chunking
        List<String> chunks = inputParser.parse(pre);

        // 3) typo rules load
        List<TypoCorrection> typoRules;
        try {
            typoRules = typoCorrectionRepository.findByActiveTrueOrderByPriorityDesc();
        } catch (Exception e) {
            typoRules = new ArrayList<>();
        }

        // 4) mapping + logging candidates
        List<MatchResult> accepted = new ArrayList<>();

        for (String chunk : chunks) {
            List<Normalizer.Candidate> candidates = normalizer.normalizeChunk(chunk, typoRules);

            MapAttempt attempt = symptomMapper.mapOneWithBestGuess(chunk, candidates);
            attempt.accepted().ifPresent(accepted::add);

            // 실패 or 낮은 점수 -> 로깅 (테이블 없으면 스킵)
            if (attempt.accepted().isEmpty()) {
                try {
                    saveUnmapped(chunk, attempt, candidates);
                } catch (Exception e) {
                    // 로깅 실패는 무시
                }
            }
        }

        // 5) post-processing (중복 제거 + 포괄 증상 정리)
        return postProcessor.process(accepted);
    }

    private void saveUnmapped(String chunk, MapAttempt attempt, List<Normalizer.Candidate> candidates) {
        try {
            String candidatesJson = objectMapper.writeValueAsString(candidates);
            String bestGuessJson = objectMapper.writeValueAsString(attempt.bestGuess());
            unmappedTermRepository.save(
                    new UnmappedTerm(chunk, attempt.bestScore(), bestGuessJson, candidatesJson)
            );
        } catch (JsonProcessingException e) {
            // 로깅 실패는 기능 자체를 막지 않게 그냥 스킵
            unmappedTermRepository.save(
                    new UnmappedTerm(chunk, attempt.bestScore(), null, null)
            );
        }
    }
}
