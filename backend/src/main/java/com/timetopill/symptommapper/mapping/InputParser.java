package com.timetopill.symptommapper.mapping;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class InputParser {

    // 1차: 해시태그 split (### 포함)
    private static final Pattern HASH_SPLIT = Pattern.compile("#+");

    // 강한 구분자(무조건 분리)
    private static final Pattern STRONG_DELIMS = Pattern.compile("[,/&]+");

    // 연결어(공백이 있는 경우만): "복통 하고 치통" / "복통 과 치통"
    private static final Pattern WORD_CONNECTORS_WITH_SPACES =
            Pattern.compile("\\s+(과|및|랑|하고)\\s+");

    // 붙여쓴 연결어(제한적으로): "복통과치통", "복통및치통", "복통랑치통"
    // - '하고'는 붙여쓰기 분리하면 "구토하고" 같은 동사도 깨질 수 있어서 제외
    private static final Pattern STUCK_CONNECTORS =
            Pattern.compile("(?<=[가-힣]{1,6})(과|및|랑)(?=[가-힣]{1,6})");

    // "문장" 느낌(이런 게 있으면 공백 분리/연결어 분리를 더 보수적으로)
    private static final Pattern SENTENCE_LIKE =
            Pattern.compile(".*(아파|아프|쓰라|메스|어지|지끈|토하|구토|설사|기침|콧물|열|발열|가려|따가|붓|부었|힘들|나요|해요|입니다|다\\b|요\\b).*");

    /**
     * Preprocessor 이후 문자열을 받아서,
     * 1) # 기준 1차 분리
     * 2) 쉼표/슬래시/& 등 강한 구분자 2차 분리
     * 3) 과/및/랑/하고 등 연결어는 "복합 태그 가능성" 있을 때만 분리
     * 4) 공백 분리는 "짧은 토큰 여러 개"일 때만 분리
     */
    public List<String> parse(String preprocessed) {
        List<String> out = new ArrayList<>();
        if (preprocessed == null || preprocessed.isBlank()) return out;

        // 1) # 기준 1차 분리
        String[] parts = HASH_SPLIT.split(preprocessed);
        for (String part : parts) {
            String chunk = part.trim();
            if (chunk.isEmpty()) continue;

            // 2) 2차 분리(복합 가능성 고려)
            out.addAll(splitChunk(chunk));
        }
        return out;
    }

    private List<String> splitChunk(String chunk) {
        // 단계별로 쪼개면서 누적
        List<String> stage = new ArrayList<>();
        stage.add(chunk);

        // A) 강한 구분자(, / &)로 무조건 분리
        stage = splitByPattern(stage, STRONG_DELIMS);

        // B) 공백이 있는 연결어로 분리
        // 문장일 가능성이 높더라도 "복통 과 치통" 같은 경우는 분리해주는 게 이득이라 일단 적용
        stage = splitByPattern(stage, WORD_CONNECTORS_WITH_SPACES);

        // C) 붙여쓴 연결어(과/및/랑) 분리: 문장 느낌이 강하면 너무 공격적으로 쪼개지 않도록 조건 부여
        stage = splitStuckConnectors(stage);

        // D) 공백 분리: "짧은 토큰 여러 개" 같은 태그 나열일 때만
        stage = splitByWhitespaceIfListLike(stage);

        // 마지막 정리
        List<String> cleaned = new ArrayList<>();
        for (String s : stage) {
            String t = s.trim();
            if (!t.isEmpty()) cleaned.add(t);
        }
        return cleaned;
    }

    private List<String> splitByPattern(List<String> inputs, Pattern pattern) {
        List<String> out = new ArrayList<>();
        for (String s : inputs) {
            String t = s.trim();
            if (t.isEmpty()) continue;

            String[] pieces = pattern.split(t);
            if (pieces.length == 1) {
                out.add(t);
            } else {
                for (String p : pieces) {
                    String pp = p.trim();
                    if (!pp.isEmpty()) out.add(pp);
                }
            }
        }
        return out;
    }

    private List<String> splitStuckConnectors(List<String> inputs) {
        List<String> out = new ArrayList<>();
        for (String s : inputs) {
            String t = s.trim();
            if (t.isEmpty()) continue;

            // "복통과치통" 같은 케이스를 잡되,
            // 문장 느낌이 강하면(예: "배가아프고") 불필요 분해 위험이 있으니 더 보수적으로:
            // - 여기서는 과/및/랑만 대상으로 했고,
            // - 그래도 문장 느낌이면 분해하지 않음
            if (looksSentenceLike(t)) {
                out.add(t);
                continue;
            }

            String[] pieces = STUCK_CONNECTORS.split(t);
            if (pieces.length == 1) {
                out.add(t);
            } else {
                for (String p : pieces) {
                    String pp = p.trim();
                    if (!pp.isEmpty()) out.add(pp);
                }
            }
        }
        return out;
    }

    private List<String> splitByWhitespaceIfListLike(List<String> inputs) {
        List<String> out = new ArrayList<>();
        for (String s : inputs) {
            String t = s.trim();
            if (t.isEmpty()) continue;

            // 공백이 없으면 그대로
            if (!t.contains(" ")) {
                out.add(t);
                continue;
            }

            // 문장 느낌이면 공백 분리하지 않음 ("머리가 아파요" 보호)
            if (looksSentenceLike(t)) {
                out.add(t);
                continue;
            }

            String[] tokens = t.split("\\s+");
            if (tokens.length < 2) {
                out.add(t);
                continue;
            }

            // "복통 치통" 처럼 짧은 토큰 나열이면 분리
            // - 토큰 길이 제한을 두어 문장(긴 단어들) 분리 방지
            boolean allShort = true;
            for (String tok : tokens) {
                if (tok.length() > 5) { // 필요하면 4~6 사이로 조정
                    allShort = false;
                    break;
                }
            }

            if (allShort) {
                for (String tok : tokens) {
                    if (!tok.isBlank()) out.add(tok.trim());
                }
            } else {
                out.add(t);
            }
        }
        return out;
    }

    private boolean looksSentenceLike(String text) {
        return SENTENCE_LIKE.matcher(text).matches();
    }
}
