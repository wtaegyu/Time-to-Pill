package com.timetopill.repository;

import com.timetopill.entity.UserPill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserPillRepository extends JpaRepository<UserPill, Long> {

    // [추가] 이 한 줄을 추가해야 PillService의 에러가 사라집니다!
    List<UserPill> findByUserId(Long userId);

    // [기존] 성능 최적화 버전 (JOIN FETCH)
    @Query("SELECT up FROM UserPill up JOIN FETCH up.drug WHERE up.user.id = :userId")
    List<UserPill> findByUserIdWithPill(@Param("userId") Long userId);

    // [기존] 중복 검사
    Optional<UserPill> findByUserIdAndDrug_ItemSeq(Long userId, String itemSeq);

    boolean existsByUserIdAndDrug_ItemSeq(Long userId, String itemSeq);

    void deleteByUserIdAndDrug_ItemSeq(Long userId, String itemSeq);
}