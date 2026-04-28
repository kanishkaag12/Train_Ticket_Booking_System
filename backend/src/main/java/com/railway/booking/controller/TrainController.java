package com.railway.booking.controller;

import com.railway.booking.dto.common.ApiResponse;
import com.railway.booking.dto.train.TrainResponse;
import com.railway.booking.service.TrainService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trains")
@RequiredArgsConstructor
public class TrainController {

    private final TrainService trainService;

    // 🚀 Autocomplete API (FINAL)
    @GetMapping("/stations")
    public ApiResponse<List<String>> getStations(
            @RequestParam(required = false, defaultValue = "") String query) {

        return ApiResponse.<List<String>>builder()
                .success(true)
                .message("Stations fetched")
                .data(trainService.getStations(query))
                .build();
    }

    // 🚀 Route-based search (NO DATE)
    @GetMapping("/search")
    public ApiResponse<Page<TrainResponse>> search(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ApiResponse.<Page<TrainResponse>>builder()
                .success(true)
                .message("Train search results")
                .data(trainService.search(source, destination, page, size))
                .build();
    }
}