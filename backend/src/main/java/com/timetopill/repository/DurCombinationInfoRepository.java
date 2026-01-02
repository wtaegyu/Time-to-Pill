package com.timetopill.repository;

import com.timetopill.entity.DurCombinationInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DurCombinationInfoRepository extends JpaRepository<DurCombinationInfo, Long> {

    // "이 약(itemCode)이 포함된 모든 병용금기 데이터를 찾아줘"
    // (A컬럼에 있거나 OR B컬럼에 있거나)
    List<DurCombinationInfo> findAllByItemCodeAOrItemCodeB(String codeA, String codeB);
}