package com.timetopill.symptommapper.mapping;

import com.timetopill.symptommapper.domain.TypoCorrection;

import java.util.*;
import java.util.regex.Pattern;

public class Normalizer {

    // 강조/완곡 표현(의미에 크게 영향 없고 매핑만 방해하는 애들)
    private static final List<String> INTENSIFIERS = List.of(
            "너무", "엄청", "진짜", "완전", "되게", "겁나", "많이", "좀", "약간"
    );

    // 반복 축약: "지끈지끈", "너무너무" 같은 걸 한 번으로
    private static final Pattern REPEAT_WORD = Pattern.compile("([가-힣]{2,4})\\1+");
    private static final Pattern REPEAT_CHAR = Pattern.compile("([가-힣])\\1{1,}");

    // 문장 끝 어미/공손 표현 약화 (완전 형태소 분석은 안 함: 휴리스틱)
    private static final List<String> ENDINGS = List.of(
            "입니다", "이에요", "예요", "였어요", "했어요", "해요", "어요", "아요", "네요", "나요", "죠", "요"
    );

    // 조사/접속 조사(토큰 끝에 붙은 형태를 제거하기 위해 길이 내림차순)
    private static final List<String> PARTICLE_SUFFIXES = List.of(
            "으로", "에서", "부터", "까지",
            "은", "는", "이", "가", "을", "를", "에", "도", "만", "과", "와", "랑"
    );

    public record Candidate(String value, String reason) {}

    /**
     * 입력 청크 하나에 대해 후보 문자열 여러 개 생성
     * - 원문 유지
     * - 반복/강조 감쇠
     * - 오타 교정
     * - 공백 제거
     * - 조사/어미 약화
     */
    public List<Candidate> normalizeChunk(String chunk, List<TypoCorrection> typoRules) {
        if (chunk == null) return List.of();
        String base = chunk.trim();
        if (base.isEmpty()) return List.of();

        LinkedHashMap<String, Candidate> uniq = new LinkedHashMap<>();

        // 0) 원문
        put(uniq, base, "ORIGINAL");

        // 1) 반복/강조 감쇠
        String damped = dampen(base);
        put(uniq, damped, "DAMPEN");

        // 2) 오타 교정 (감쇠 결과에 적용)
        String corrected = applyTypoCorrections(damped, typoRules);
        put(uniq, corrected, "TYPO_CORRECTION");

        // 3) 공백 제거 버전들
        put(uniq, removeSpaces(base), "REMOVE_SPACES_FROM_ORIGINAL");
        put(uniq, removeSpaces(corrected), "REMOVE_SPACES_FROM_CORRECTED");

        // 4) 조사/어미 약화 버전들
        String weakened = weakenParticlesAndEndings(corrected);
        put(uniq, weakened, "WEAKEN_PARTICLES_ENDINGS");
        put(uniq, removeSpaces(weakened), "REMOVE_SPACES_FROM_WEAKENED");

        // (선택) "약화 먼저 → 오타 교정"도 한 번 더(순서에 따라 매칭이 달라질 수 있어서)
        String weakened2 = weakenParticlesAndEndings(damped);
        String corrected2 = applyTypoCorrections(weakened2, typoRules);
        put(uniq, corrected2, "WEAKEN_THEN_CORRECT");
        put(uniq, removeSpaces(corrected2), "REMOVE_SPACES_FROM_WEAKEN_THEN_CORRECT");

        // 너무 많은 후보는 오히려 성능만 떨어져서 상한
        return uniq.values().stream().limit(8).toList();
    }

    private void put(LinkedHashMap<String, Candidate> uniq, String value, String reason) {
        if (value == null) return;
        String v = value.trim().replaceAll("\\s+", " ");
        if (v.isEmpty()) return;
        // 완전히 동일한 값이면 최초 reason 유지
        uniq.putIfAbsent(v, new Candidate(v, reason));
    }

    private String removeSpaces(String s) {
        return s == null ? "" : s.replaceAll("\\s+", "");
    }

    /**
     * 강조/반복 표현 감쇠
     * - "지끈지끈" -> "지끈"
     * - "너무너무" -> "너무"
     * - "엄청 아파요" -> "아파요" (강조어 제거)
     */
    private String dampen(String s) {
        if (s == null) return "";

        String out = s;

        // 반복 축약
        out = REPEAT_WORD.matcher(out).replaceAll("$1");
        out = REPEAT_CHAR.matcher(out).replaceAll("$1");

        // 강조어 제거(토큰 단위)
        for (String w : INTENSIFIERS) {
            // 단어 경계가 애매한 한글 특성 때문에 " 공백/처음/끝 " 기준으로 보수적으로 제거
            out = out.replaceAll("(^|\\s+)" + Pattern.quote(w) + "(\\s+|$)", " ");
        }

        return out.replaceAll("\\s+", " ").trim();
    }

    /**
     * 오타 교정 테이블 기반 치환 (리터럴 치환)
     * - 예: "츠통" -> "치통"
     */
    private String applyTypoCorrections(String s, List<TypoCorrection> rules) {
        if (s == null) return "";
        String out = s;
        if (rules == null) return out;

        for (TypoCorrection r : rules) {
            if (r == null || !r.isActive()) continue;
            String pattern = r.getPattern();
            String correct = r.getCorrect();
            if (pattern == null || pattern.isBlank() || correct == null) continue;

            // 리터럴 치환 (정규식이 아니게)
            out = out.replace(pattern, correct);
        }
        return out.trim().replaceAll("\\s+", " ");
    }

    /**
     * 조사/어미 약화 (휴리스틱)
     * - "머리가 아파요" -> "머리 아파"
     * - "배가 쓰라려요" -> "배 쓰라려"
     * - "치통이" -> "치통"
     */
    private String weakenParticlesAndEndings(String s) {
        if (s == null) return "";

        // 1) 끝 어미 약화 (문장 끝만)
        String out = removeEndingAtEnd(s.trim());

        // 2) 토큰별 조사 약화
        String[] tokens = out.split("\\s+");
        List<String> cleaned = new ArrayList<>();
        for (String t : tokens) {
            String token = stripParticleSuffix(t);
            if (!token.isBlank()) cleaned.add(token);
        }

        return String.join(" ", cleaned).trim();
    }

    private String removeEndingAtEnd(String s) {
        String out = s;
        // 길이 긴 어미부터 제거되도록 정렬된 리스트(현재 ENDINGS는 대체로 긴 게 앞에 있음)
        for (String e : ENDINGS) {
            if (out.endsWith(e) && out.length() > e.length()) {
                out = out.substring(0, out.length() - e.length());
                break;
            }
        }
        // 마지막에 '요'만 남는 경우 한번 더 제거
        if (out.endsWith("요") && out.length() > 1) {
            out = out.substring(0, out.length() - 1);
        }
        return out.trim();
    }

    private String stripParticleSuffix(String token) {
        String t = token.trim();
        if (t.length() < 2) return t;

        for (String suf : PARTICLE_SUFFIXES) {
            if (t.endsWith(suf) && t.length() > suf.length()) {
                // 예: "배가" -> "배", "머리가" -> "머리"
                return t.substring(0, t.length() - suf.length());
            }
        }
        return t;
    }
}
