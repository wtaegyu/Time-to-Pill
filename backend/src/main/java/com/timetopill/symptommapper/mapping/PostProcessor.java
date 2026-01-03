package com.timetopill.symptommapper.mapping;

import java.util.*;

public class PostProcessor {

    // 프로젝트에서 "포괄 증상"으로 취급할 code들 (너희 표준 코드에 맞게 조정)
    private static final Set<String> GENERIC_CODES = Set.of(
            "PAIN", "ACHE", "DISCOMFORT"
    );

    // 포괄 증상을 제거할지(true) / 점수만 낮출지(false)
    private final boolean dropGenericWhenSpecificExists;

    // 점수 감쇠를 선택할 경우 적용할 비율 (예: 0.8이면 20% 감소)
    private final double genericDampenFactor;

    public PostProcessor() {
        this(true, 0.8);
    }

    public PostProcessor(boolean dropGenericWhenSpecificExists, double genericDampenFactor) {
        this.dropGenericWhenSpecificExists = dropGenericWhenSpecificExists;
        this.genericDampenFactor = genericDampenFactor;
    }

    public List<MatchResult> process(List<MatchResult> rawResults) {
        if (rawResults == null || rawResults.isEmpty()) return List.of();

        // 1) symptomId 기준 중복 제거 (최고 confidence 유지)
        Map<Long, MatchResult> bestById = new HashMap<>();
        for (MatchResult r : rawResults) {
            MatchResult prev = bestById.get(r.symptomId());
            if (prev == null || r.confidence() > prev.confidence()) {
                bestById.put(r.symptomId(), r);
            }
        }

        List<MatchResult> deduped = new ArrayList<>(bestById.values());

        // 2) "포괄 증상" vs "구체 증상" 처리
        boolean hasSpecific = deduped.stream().anyMatch(r -> !GENERIC_CODES.contains(r.code()));
        if (hasSpecific) {
            if (dropGenericWhenSpecificExists) {
                deduped.removeIf(r -> GENERIC_CODES.contains(r.code()));
            } else {
                // 제거 대신 감쇠
                List<MatchResult> adjusted = new ArrayList<>();
                for (MatchResult r : deduped) {
                    if (GENERIC_CODES.contains(r.code())) {
                        double newScore = Math.max(0.0, Math.min(1.0, r.confidence() * genericDampenFactor));
                        adjusted.add(new MatchResult(
                                r.symptomId(), r.code(), r.displayNameKo(),
                                round3(newScore),
                                r.matchedBy() + "+GENERIC_DAMPEN",
                                r.originalChunk(),
                                r.matchedText()
                        ));
                    } else {
                        adjusted.add(r);
                    }
                }
                deduped = adjusted;
            }
        }

        // 3) 정렬(선택): confidence 높은 순
        deduped.sort((a, b) -> Double.compare(b.confidence(), a.confidence()));

        return deduped;
    }

    private static double round3(double v) {
        return Math.round(v * 1000.0) / 1000.0;
    }
}
