package com.timetopill.repository;

import com.timetopill.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    @Query("SELECT s FROM Schedule s JOIN FETCH s.pill WHERE s.user.id = :userId AND s.scheduleDate = :date")
    List<Schedule> findByUserIdAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("SELECT s FROM Schedule s JOIN FETCH s.pill WHERE s.user.id = :userId AND s.scheduleDate BETWEEN :startDate AND :endDate")
    List<Schedule> findByUserIdAndDateRange(
        @Param("userId") Long userId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    List<Schedule> findByUserIdAndPillId(Long userId, Long pillId);
}
