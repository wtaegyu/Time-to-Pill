package com.timetopill.symptommapper.repository;

import com.timetopill.symptommapper.domain.UnmappedTerm;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UnmappedTermRepository extends JpaRepository<UnmappedTerm, Long> {}
