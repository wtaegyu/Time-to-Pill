package com.timetopill.controller;

import com.timetopill.dto.DrugSearchDto;
import com.timetopill.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    // GET /api/search?keyword=...
    @GetMapping
    public List<DrugSearchDto> searchByName(@RequestParam("keyword") String keyword) {
        return searchService.searchByName(keyword);
    }

    // GET /api/search/symptom?keyword=...
    @GetMapping("/symptom")
    public List<DrugSearchDto> searchBySymptom(@RequestParam("keyword") String keyword) {
        return searchService.searchBySymptom(keyword);
    }

    // GET /api/search/popular?limit=5
    @GetMapping("/popular")
    public List<DrugSearchDto> getPopularPills(@RequestParam(value = "limit", defaultValue = "5") int limit) {
        return searchService.getPopularPills(limit);
    }
}