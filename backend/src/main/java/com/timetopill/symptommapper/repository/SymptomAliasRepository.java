package com.timetopill.symptommapper.repository;

import com.timetopill.symptommapper.domain.SymptomAlias;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SymptomAliasRepository extends JpaRepository<SymptomAlias, Long> {
    List<SymptomAlias> findByActiveTrue();
}
