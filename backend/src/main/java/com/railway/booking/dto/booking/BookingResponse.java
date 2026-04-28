package com.railway.booking.dto.booking;

import com.railway.booking.enums.PaymentStatus;
import com.railway.booking.enums.QuotaType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BookingResponse {
    private Long id;
    private String pnrNumber;
    private String trainNumber;
    private String trainName;
    private String source;
    private String destination;
    private LocalDate journeyDate;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private QuotaType quotaType;
    private BigDecimal totalFare;
    private boolean cancelled;
    private String bookingStatusSummary;
    private String notificationMessage;
    private PaymentStatus paymentStatus;
    private LocalDateTime createdAt;
    private List<PassengerResponse> passengers;
}
