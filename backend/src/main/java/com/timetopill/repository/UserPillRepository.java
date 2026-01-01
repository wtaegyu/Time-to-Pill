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

    @Query("SELECT up FROM UserPill up JOIN FETCH up.pill WHERE up.user.id = :userId")
    List<UserPill> findByUserIdWithPill(@Param("userId") Long userId);

    Optional<UserPill> findByUserIdAndPillId(Long userId, Long pillId);

    boolean existsByUserIdAndPillId(Long userId, Long pillId);

    void deleteByUserIdAndPillId(Long userId, Long pillId);
}
