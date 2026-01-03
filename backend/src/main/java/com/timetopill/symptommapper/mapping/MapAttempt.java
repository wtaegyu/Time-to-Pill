package com.timetopill.symptommapper.mapping;

import java.util.Optional;

public record MapAttempt(
        Optional<MatchResult> accepted,
        Double bestScore,          // threshold 미만이어도 최고점
        MatchResult bestGuess      // threshold 미만이어도 최고점 후보(없으면 null)
) {}
