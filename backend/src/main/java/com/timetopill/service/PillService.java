package com.timetopill.service;

import com.timetopill.dto.PillDto.*;
import com.timetopill.entity.Pill;
import com.timetopill.entity.User;
import com.timetopill.entity.UserPill;
import com.timetopill.repository.PillRepository;
import com.timetopill.repository.UserPillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class PillService {

    private final PillRepository pillRepository;
    private final UserPillRepository userPillRepository;

    public PillService(PillRepository pillRepository, UserPillRepository userPillRepository) {
        this.pillRepository = pillRepository;
        this.userPillRepository = userPillRepository;
    }

    public List<PillResponse> searchByName(String name) {
        return pillRepository.findByNameContainingIgnoreCase(name).stream()
            .map(PillResponse::fromWithoutWarnings)
            .toList();
    }

    public List<PillResponse> searchBySymptom(String symptom) {
        return pillRepository.findBySymptom(symptom).stream()
            .map(PillResponse::fromWithoutWarnings)
            .toList();
    }

    public PillResponse getPillDetail(Long pillId) {
        Pill pill = pillRepository.findByIdWithWarnings(pillId);
        if (pill == null) {
            throw new IllegalArgumentException("Pill not found");
        }
        return PillResponse.from(pill);
    }

    public List<PillResponse> getMyPills(Long userId) {
        return userPillRepository.findByUserIdWithPill(userId).stream()
            .map(up -> PillResponse.fromWithoutWarnings(up.getPill()))
            .toList();
    }

    @Transactional
    public void addPillToUser(Long userId, Long pillId, User user) {
        if (userPillRepository.existsByUserIdAndPillId(userId, pillId)) {
            throw new IllegalArgumentException("Pill already added");
        }

        Pill pill = pillRepository.findById(pillId)
            .orElseThrow(() -> new IllegalArgumentException("Pill not found"));

        UserPill userPill = new UserPill();
        userPill.setUser(user);
        userPill.setPill(pill);

        userPillRepository.save(userPill);
    }

    @Transactional
    public void removePillFromUser(Long userId, Long pillId) {
        userPillRepository.deleteByUserIdAndPillId(userId, pillId);
    }
}
