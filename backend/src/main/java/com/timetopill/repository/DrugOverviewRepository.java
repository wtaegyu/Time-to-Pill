package com.timetopill.repository;

import com.timetopill.entity.DrugOverview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DrugOverviewRepository extends JpaRepository<DrugOverview, String> {

    // 1. 이름 검색
    List<DrugOverview> findByItemNameContaining(String keyword);

    // 2. 증상 검색 (여기가 틀려서 500 에러가 났을 것입니다!)
    // [중요] Entity 필드명(efficacyText)과 대소문자까지 정확히 일치해야 함
    List<DrugOverview> findByEfficacyTextContaining(String keyword);
}