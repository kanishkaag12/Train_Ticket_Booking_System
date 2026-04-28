package com.railway.booking.controller;

import com.railway.booking.dto.common.ApiResponse;
import com.railway.booking.dto.train.TrainResponse;
import java.time.LocalDate;
import java.util.List;
import com.railway.booking.service.TrainService;
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

    @GetMapping("/stations")
    public ApiResponse<List<String>> stations(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) LocalDate journeyDate) {
        return ApiResponse.<List<String>>builder()
                .success(true)
                .message("Stations fetched")
                .data(trainService.getStations(journeyDate, query))
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<Page<TrainResponse>> search(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam java.time.LocalDate journeyDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ApiResponse.<Page<TrainResponse>>builder()
                .success(true)
                .message("Train search results")
                .data(trainService.search(source, destination, journeyDate, page, size))
                .build();
    }
}
