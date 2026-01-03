package com.timetopill.symptommapper.mapping;

public record MatchResult(
        Long symptomId,
        String code,
        String displayNameKo,
        double confidence,
        String matchedBy,
        String originalChunk,
        String matchedText
) {}
