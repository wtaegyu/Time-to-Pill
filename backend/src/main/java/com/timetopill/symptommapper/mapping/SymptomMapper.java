package com.timetopill.symptommapper.mapping;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@RequiredArgsConstructor
public class SymptomMapper {

    private final SymptomDictionaryCache dict;

    private static final double THRESHOLD = 0.75;

    public boolean isCacheEmpty() {
        return dict.isEmpty();
    }

    private static final List<Rule> RULES = List.of(
            new Rule("HEADACHE", ".*(두통|머리.*아프|지끈|어지럽).*", 0.10),
            new Rule("TOOTHACHE", ".*(치통|이.*아프|잇몸.*아프).*", 0.10),
            new Rule("ABDOMINAL_PAIN", ".*(복통|배.*아프|배.*쓰라|속.*메스|구토|설사).*", 0.10)
    );

    public Optional<MatchResult> mapOne(String originalChunk, List<Normalizer.Candidate> candidates) {
        Scored best = findBest(originalChunk, candidates);
        if (best == null || best.score < THRESHOLD) return Optional.empty();

        var ref = dict.getSymptomById().get(best.symptomId);
        if (ref == null) return Optional.empty();

        return Optional.of(toMatchResult(ref, best, originalChunk));
    }

    /** 로깅/학습루프용: threshold 미만이어도 bestGuess 반환 */
    public MapAttempt mapOneWithBestGuess(String originalChunk, List<Normalizer.Candidate> candidates) {
        Scored best = findBest(originalChunk, candidates);
        if (best == null) return new MapAttempt(Optional.empty(), null, null);

        var ref = dict.getSymptomById().get(best.symptomId);
        MatchResult guess = (ref == null) ? null : toMatchResult(ref, best, originalChunk);

        if (best.score >= THRESHOLD && ref != null) {
            return new MapAttempt(Optional.of(guess), best.score, guess);
        }
        return new MapAttempt(Optional.empty(), best.score, guess);
    }

    /** best 후보를 계산하는 공통 로직 */
    private Scored findBest(String originalChunk, List<Normalizer.Candidate> candidates) {
        Scored best = null;

        for (Normalizer.Candidate c : candidates) {
            String text = c.value();
            if (text == null || text.isBlank()) continue;

            // 1) Exact
            var exact = dict.getExactMap().get(text);
            if (exact != null) best = pickBest(best, new Scored(exact.id(), 1.0, "EXACT", originalChunk, text));

            // 2) Normalized Exact
            String key = NormUtil.normKey(text);
            var norm = dict.getNormalizedMap().get(key);
            if (norm != null) best = pickBest(best, new Scored(norm.id(), 0.95, "NORM_EXACT", originalChunk, key));

            // 3) Alias/Variant
            best = pickBest(best, aliasVariantMatch(originalChunk, text));

            // 4) Fuzzy
            best = pickBest(best, fuzzyMatch(originalChunk, text));
        }

        // 5) Rule bonus
        return applyRuleBonus(best, originalChunk);
    }

    private MatchResult toMatchResult(SymptomDictionaryCache.SymptomRef ref, Scored best, String originalChunk) {
        return new MatchResult(
                ref.id(), ref.code(), ref.displayNameKo(),
                round3(best.score),
                best.matchedBy,
                originalChunk,
                best.matchedText
        );
    }

    private Scored aliasVariantMatch(String original, String text) {
        String key = NormUtil.normKey(text);
        if (key.length() < 2) return null;

        Scored best = null;
        for (var e : dict.getEntries()) {
            String ek = e.normalizedKey();
            if (ek.length() < 2) continue;

            boolean contains = ek.contains(key) || key.contains(ek);
            if (!contains) continue;

            double coverage = (double) Math.min(ek.length(), key.length()) / Math.max(ek.length(), key.length());
            double score = 0.90 * e.weight() * coverage;

            if (score < 0.75) continue;
            best = pickBest(best, new Scored(e.symptomId(), score, "ALIAS_VARIANT", original, e.text()));
        }
        return best;
    }

    private Scored fuzzyMatch(String original, String text) {
        String key = NormUtil.normKey(text);
        if (key.isEmpty()) return null;

        Set<Integer> candIdx = new HashSet<>();
        for (String tri : NormUtil.trigrams(key)) {
            List<Integer> idxs = dict.getTrigramIndex().get(tri);
            if (idxs != null) candIdx.addAll(idxs);
        }
        if (candIdx.isEmpty()) return null;

        String jamoKey = NormUtil.toJamo(key);
        Set<String> triA = NormUtil.trigrams(key);

        Scored best = null;

        for (int i : candIdx) {
            var e = dict.getEntries().get(i);
            String ek = e.normalizedKey();

            double sEdit = NormUtil.editSimilarity(key, ek);
            double sJamo = NormUtil.editSimilarity(jamoKey, NormUtil.toJamo(ek));
            double sTri = NormUtil.jaccard(triA, NormUtil.trigrams(ek));

            double sim = Math.max(sEdit, Math.max(sJamo, sTri));
            double score = 0.60 + (0.29 * sim);
            score *= e.weight();

            if (score < 0.60) continue;
            best = pickBest(best, new Scored(e.symptomId(), score, "FUZZY", original, e.text()));
        }
        return best;
    }

    private Scored applyRuleBonus(Scored best, String originalChunk) {
        String x = originalChunk == null ? "" : originalChunk;

        for (Rule r : RULES) {
            if (!x.matches(r.regex)) continue;

            Long ruleSymptomId = dict.getSymptomById().values().stream()
                    .filter(v -> v.code().equals(r.code))
                    .map(SymptomDictionaryCache.SymptomRef::id)
                    .findFirst().orElse(null);

            if (ruleSymptomId == null) continue;

            if (best != null && best.symptomId.equals(ruleSymptomId)) {
                double boosted = Math.min(1.0, best.score + r.bonus);
                best = new Scored(best.symptomId, boosted, best.matchedBy + "+RULE", best.originalChunk, best.matchedText);
            } else if (best == null) {
                double base = 0.70 + r.bonus;
                best = new Scored(ruleSymptomId, Math.min(1.0, base), "RULE_ONLY", originalChunk, r.code);
            }
        }
        return best;
    }

    private static Scored pickBest(Scored a, Scored b) {
        if (b == null) return a;
        if (a == null) return b;
        return (b.score > a.score) ? b : a;
    }

    private static double round3(double v) {
        return Math.round(v * 1000.0) / 1000.0;
    }

    private record Scored(Long symptomId, double score, String matchedBy, String originalChunk, String matchedText) {}
    private record Rule(String code, String regex, double bonus) {}
}
