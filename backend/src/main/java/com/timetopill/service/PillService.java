package com.timetopill.service;

import com.timetopill.dto.DrugSearchDto;
import com.timetopill.entity.DrugOverview;
import com.timetopill.entity.User;
import com.timetopill.entity.UserPill;
import com.timetopill.repository.DrugOverviewRepository;
import com.timetopill.repository.UserPillRepository;
import com.timetopill.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class PillService {

    private final UserPillRepository userPillRepository;
    private final DrugOverviewRepository drugRepository;
    private final UserRepository userRepository;

    // 1. 내 약통 조회
    @Transactional(readOnly = true)
    public List<DrugSearchDto> getMyPills(Long userId) {
        List<UserPill> userPills = userPillRepository.findByUserIdWithPill(userId);

        return userPills.stream()
                .map(userPill -> DrugSearchDto.from(userPill.getDrug()))
                .collect(Collectors.toList());
    }

    // 2. 내 약통에 추가
    public void addPill(Long userId, String itemSeq) {
        log.info("💊 약 추가 시도 - User: {}, ItemSeq: {}", userId, itemSeq);

        if (userPillRepository.existsByUserIdAndDrug_ItemSeq(userId, itemSeq)) {
            log.warn("⚠️ 이미 존재하는 약입니다.");
            throw new IllegalArgumentException("이미 내 약통에 있는 약입니다.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        DrugOverview drug = drugRepository.findById(itemSeq)
                .orElseThrow(() -> new RuntimeException("약 정보를 찾을 수 없습니다."));

        UserPill userPill = new UserPill();
        userPill.setUser(user);
        userPill.setDrug(drug);

        userPillRepository.save(userPill);
        log.info("✅ DB 저장 성공!");
    }

    // 3. 내 약통에서 삭제
    public void deletePill(Long userId, String itemSeq) {
        userPillRepository.deleteByUserIdAndDrug_ItemSeq(userId, itemSeq);
    }
}