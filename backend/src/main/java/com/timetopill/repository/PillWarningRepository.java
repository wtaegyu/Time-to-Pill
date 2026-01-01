package com.timetopill.repository;

import com.timetopill.entity.PillWarning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PillWarningRepository extends JpaRepository<PillWarning, Long> {

    List<PillWarning> findByPillId(Long pillId);
}
