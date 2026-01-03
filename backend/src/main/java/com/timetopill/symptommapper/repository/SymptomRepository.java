package com.timetopill.symptommapper.repository;

import com.timetopill.symptommapper.domain.Symptom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SymptomRepository extends JpaRepository<Symptom, Long> {
    List<Symptom> findByActiveTrue();
}
