package com.timetopill.repository;

import com.timetopill.entity.Pill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PillRepository extends JpaRepository<Pill, Long> {

    List<Pill> findByNameContainingIgnoreCase(String name);

    @Query("SELECT p FROM Pill p WHERE LOWER(p.description) LIKE LOWER(CONCAT('%', :symptom, '%'))")
    List<Pill> findBySymptom(@Param("symptom") String symptom);

    @Query("SELECT p FROM Pill p LEFT JOIN FETCH p.warnings WHERE p.id = :id")
    Pill findByIdWithWarnings(@Param("id") Long id);
}
