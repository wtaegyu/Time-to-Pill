package com.timetopill.symptommapper.mapping;
import java.text.Normalizer;

public class Preprocessor {
    // 허용: 한글(가-힣), 영문, 숫자, 공백, 해시, 쉼표, 슬래시, 앰퍼샌드
    private static final String ALLOWED_REGEX = "[^#0-9a-zA-Z가-힣\\s,/&]+";
    // 제로폭/제어 문자 제거
    private static final String INVISIBLE_REGEX = "[\\p{C}]+"; // Other(제어/포맷/서로게이트 등)

    public static String preprocess(String input) {
        if (input == null) return "";

        // 1) 유니코드 정규화 (전각 문자 등 통일)
        String s = Normalizer.normalize(input, Normalizer.Form.NFKC);

        // 2) 보이지 않는/제어 문자 제거(공백으로 치환)
        s = s.replaceAll(INVISIBLE_REGEX, " ");

        // 3) 허용하지 않는 문자는 공백으로 치환 (이모지도 여기서 대부분 걸러짐)
        s = s.replaceAll(ALLOWED_REGEX, " ");

        // 4) 공백 정리
        s = s.replaceAll("\\s+", " ").trim();

        return s;
    }
}
