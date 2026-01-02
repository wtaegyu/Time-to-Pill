package com.timetopill.repository;

import com.timetopill.entity.DurInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DurInfoRepository extends JpaRepository<DurInfo, Long> {
    // 특정 약(itemSeq)의 금기사항을 모두 가져오는 기능
    List<DurInfo> findByItemCode(String itemCode);
}