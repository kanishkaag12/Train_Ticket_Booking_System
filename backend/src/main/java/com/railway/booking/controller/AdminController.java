package com.railway.booking.controller;

import com.railway.booking.dto.booking.BookingResponse;
import com.railway.booking.dto.common.ApiResponse;
import com.railway.booking.dto.train.TrainRequest;
import com.railway.booking.dto.train.TrainResponse;
import com.railway.booking.service.BookingService;
import com.railway.booking.service.TrainService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final TrainService trainService;
    private final BookingService bookingService;

    @GetMapping("/trains")
    public ApiResponse<List<TrainResponse>> getTrains() {
        return ApiResponse.<List<TrainResponse>>builder()
                .success(true)
                .message("Train inventory fetched")
                .data(trainService.getAll())
                .build();
    }

    @PostMapping("/trains")
    public ApiResponse<TrainResponse> createTrain(@Valid @RequestBody TrainRequest request) {
        return ApiResponse.<TrainResponse>builder()
                .success(true)
                .message("Train created successfully")
                .data(trainService.createTrain(request))
                .build();
    }

    @PutMapping("/trains/{id}")
    public ApiResponse<TrainResponse> updateTrain(@PathVariable Long id, @Valid @RequestBody TrainRequest request) {
        return ApiResponse.<TrainResponse>builder()
                .success(true)
                .message("Train updated successfully")
                .data(trainService.updateTrain(id, request))
                .build();
    }

    @DeleteMapping("/trains/{id}")
    public ApiResponse<Void> deleteTrain(@PathVariable Long id) {
        trainService.deleteTrain(id);
        return ApiResponse.<Void>builder()
                .success(true)
                .message("Train deleted successfully")
                .build();
    }

    @GetMapping("/bookings")
    public ApiResponse<List<BookingResponse>> getAllBookings() {
        return ApiResponse.<List<BookingResponse>>builder()
                .success(true)
                .message("All bookings fetched")
                .data(bookingService.getAllBookings())
                .build();
    }
}
