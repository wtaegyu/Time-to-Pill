package com.timetopill.controller;

import com.timetopill.service.DrugFetchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TestController {

    private final DrugFetchService drugFetchService;

    // 이 주소로 접속하면 데이터 다운로드가 시작됩니다.
    @GetMapping("/api/init-data")
    public String initData() {
        return drugFetchService.fetchAllData();
    }
}