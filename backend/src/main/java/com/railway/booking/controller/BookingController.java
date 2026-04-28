package com.railway.booking.controller;

import com.railway.booking.dto.booking.BookingRequest;
import com.railway.booking.dto.booking.BookingResponse;
import com.railway.booking.dto.common.ApiResponse;
import com.railway.booking.service.BookingService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ApiResponse<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request, Principal principal) {
        return ApiResponse.<BookingResponse>builder()
                .success(true)
                .message("Booking created successfully")
                .data(bookingService.createBooking(principal.getName(), request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<BookingResponse>> getMyBookings(Principal principal) {
        return ApiResponse.<List<BookingResponse>>builder()
                .success(true)
                .message("Booking history fetched")
                .data(bookingService.getUserBookings(principal.getName()))
                .build();
    }

    @GetMapping("/{pnrNumber}")
    public ApiResponse<BookingResponse> getByPnr(@PathVariable String pnrNumber) {
        return ApiResponse.<BookingResponse>builder()
                .success(true)
                .message("PNR details fetched")
                .data(bookingService.getByPnr(pnrNumber))
                .build();
    }

    @DeleteMapping("/{pnrNumber}")
    public ApiResponse<BookingResponse> cancelBooking(@PathVariable String pnrNumber, Principal principal) {
        return ApiResponse.<BookingResponse>builder()
                .success(true)
                .message("Booking cancelled successfully")
                .data(bookingService.cancelBooking(pnrNumber, principal.getName()))
                .build();
    }
}
