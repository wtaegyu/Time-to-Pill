package com.timetopill.symptommapper.repository;

import com.timetopill.symptommapper.domain.TypoCorrection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TypoCorrectionRepository extends JpaRepository<TypoCorrection, Long> {
    List<TypoCorrection> findByActiveTrueOrderByPriorityDesc();
}
