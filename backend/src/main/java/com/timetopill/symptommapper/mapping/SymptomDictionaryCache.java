package com.timetopill.symptommapper.mapping;

import com.timetopill.symptommapper.domain.Symptom;
import com.timetopill.symptommapper.domain.SymptomAlias;
import com.timetopill.symptommapper.repository.SymptomAliasRepository;
import com.timetopill.symptommapper.repository.SymptomRepository;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;

@Slf4j
@Component
@RequiredArgsConstructor
public class SymptomDictionaryCache {

    private final SymptomRepository symptomRepo;
    private final SymptomAliasRepository aliasRepo;

    @Getter private Map<String, SymptomRef> exactMap = new HashMap<>();        // exact(표준명/alias)
    @Getter private Map<String, SymptomRef> normalizedMap = new HashMap<>();   // normalized exact
    @Getter private List<AliasEntry> entries = new ArrayList<>();             // fuzzy 대상 리스트
    @Getter private Map<String, List<Integer>> trigramIndex = new HashMap<>();// trigram -> entry index
    @Getter private Map<Long, SymptomRef> symptomById = new HashMap<>();

    @PostConstruct
    public void load() {
        try {
            loadFromDatabase();
            log.info("SymptomDictionaryCache 로드 완료: 증상 {}개, 별칭 {}개", symptomById.size(), entries.size() - symptomById.size());
        } catch (Exception e) {
            log.warn("SymptomDictionaryCache 로드 실패 (테이블이 없거나 비어있음): {}", e.getMessage());
            log.warn("증상 매핑 기능이 비활성화됩니다. 증상 테이블 생성 후 앱을 재시작하세요.");
        }
    }

    private void loadFromDatabase() {
        List<Symptom> symptoms = symptomRepo.findByActiveTrue();
        List<SymptomAlias> aliases = aliasRepo.findByActiveTrue();

        Map<Long, SymptomRef> byId = new HashMap<>();
        for (Symptom s : symptoms) {
            SymptomRef ref = new SymptomRef(s.getId(), s.getCode(), s.getDisplayNameKo());
            byId.put(s.getId(), ref);

            // 표준명 exact/normalized 등록
            exactMap.put(s.getDisplayNameKo(), ref);
            normalizedMap.put(NormUtil.normKey(s.getDisplayNameKo()), ref);

            // fuzzy 엔트리에도 표준명 넣기(가중치 1.0)
            entries.add(new AliasEntry(s.getDisplayNameKo(), NormUtil.normKey(s.getDisplayNameKo()), s.getId(), 1.0, "STANDARD"));
        }

        for (SymptomAlias a : aliases) {
            SymptomRef ref = byId.get(a.getSymptomId());
            if (ref == null) continue;

            exactMap.put(a.getAlias(), ref);
            normalizedMap.put(a.getNormalizedAlias(), ref);

            entries.add(new AliasEntry(a.getAlias(), a.getNormalizedAlias(), a.getSymptomId(), a.getWeight(), "ALIAS"));
        }

        this.symptomById = byId;

        // trigram index 구축 (공백 제거 normalizedKey 기반)
        Map<String, List<Integer>> idx = new HashMap<>();
        for (int i = 0; i < entries.size(); i++) {
            String key = entries.get(i).normalizedKey();
            for (String tri : NormUtil.trigrams(key)) {
                idx.computeIfAbsent(tri, k -> new ArrayList<>()).add(i);
            }
        }
        this.trigramIndex = idx;
    }

    public boolean isEmpty() {
        return symptomById.isEmpty();
    }

    public record SymptomRef(Long id, String code, String displayNameKo) {}
    public record AliasEntry(String text, String normalizedKey, Long symptomId, double weight, String type) {}
}
