package com.timetopill.symptommapper.mapping;

import java.util.*;

public class NormUtil {

    /** normalized exact용 키: 공백 제거 + 소문자(영문) */
    public static String normKey(String s) {
        if (s == null) return "";
        return s.replaceAll("\\s+", "").toLowerCase(Locale.ROOT).trim();
    }

    /** 트라이그램 생성 */
    public static Set<String> trigrams(String s) {
        String x = normKey(s);
        Set<String> out = new HashSet<>();
        if (x.length() < 3) {
            out.add(x);
            return out;
        }
        for (int i = 0; i <= x.length() - 3; i++) out.add(x.substring(i, i + 3));
        return out;
    }

    /** Jaccard */
    public static double jaccard(Set<String> a, Set<String> b) {
        if (a.isEmpty() && b.isEmpty()) return 1.0;
        int inter = 0;
        for (String x : a) if (b.contains(x)) inter++;
        int union = a.size() + b.size() - inter;
        return union == 0 ? 0.0 : (double) inter / union;
    }

    /** Levenshtein distance */
    public static int levenshtein(String a, String b) {
        if (a.equals(b)) return 0;
        int n = a.length(), m = b.length();
        if (n == 0) return m;
        if (m == 0) return n;
        int[] prev = new int[m + 1];
        int[] cur = new int[m + 1];
        for (int j = 0; j <= m; j++) prev[j] = j;
        for (int i = 1; i <= n; i++) {
            cur[0] = i;
            char ca = a.charAt(i - 1);
            for (int j = 1; j <= m; j++) {
                int cost = (ca == b.charAt(j - 1)) ? 0 : 1;
                cur[j] = Math.min(Math.min(cur[j - 1] + 1, prev[j] + 1), prev[j - 1] + cost);
            }
            int[] tmp = prev; prev = cur; cur = tmp;
        }
        return prev[m];
    }

    /** 한글 자모 분해(초/중/종) -> 문자열 */
    public static String toJamo(String s) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            if (ch >= 0xAC00 && ch <= 0xD7A3) { // Hangul syllables
                int base = ch - 0xAC00;
                int cho = base / (21 * 28);
                int jung = (base % (21 * 28)) / 28;
                int jong = base % 28;
                sb.append(CHO[cho]).append(JUNG[jung]);
                if (jong != 0) sb.append(JONG[jong]);
            } else {
                sb.append(ch);
            }
        }
        return sb.toString();
    }

    // 초성/중성/종성 테이블(간단 구현)
    private static final char[] CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ".toCharArray();
    private static final char[] JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ".toCharArray();
    private static final char[] JONG = (" \u3131\u3132\u3133\u3134\u3135\u3136\u3137\u3139\u313A\u313B\u313C\u313D\u313E\u313F\u3140\u3141\u3142\u3144\u3145\u3146\u3147\u3148\u314A\u314B\u314C\u314D\u314E").toCharArray();

    /** 0~1 유사도(편집거리 기반) */
    public static double editSimilarity(String a, String b) {
        String x = normKey(a), y = normKey(b);
        int max = Math.max(x.length(), y.length());
        if (max == 0) return 1.0;
        int d = levenshtein(x, y);
        return 1.0 - ((double) d / max);
    }
}
