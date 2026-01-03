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

    // [수정] s.pill -> s.drug 로 변경
    @Query("SELECT s FROM Schedule s JOIN FETCH s.drug WHERE s.user.id = :userId AND s.scheduleDate = :date")
    List<Schedule> findByUserIdAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    // [수정] s.pill -> s.drug 로 변경 (여기가 에러 났던 부분!)
    @Query("SELECT s FROM Schedule s JOIN FETCH s.drug WHERE s.user.id = :userId AND s.scheduleDate BETWEEN :startDate AND :endDate")
    List<Schedule> findByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // [수정] 메서드 이름 변경 및 파라미터 변경 (pillId -> itemSeq)
    // 원래 findByUserIdAndPillId 였던 것을 아래와 같이 변경
    List<Schedule> findByUserIdAndDrug_ItemSeq(Long userId, String itemSeq);
}