package com.railway.booking.dto.train;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TrainResponse {
    private Long id;
    private String trainNumber;
    private String trainName;
    private String source;
    private String destination;
    private LocalDate journeyDate;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private BigDecimal fare;
    private Integer confirmedCapacity;
    private Integer racCapacity;
    private Integer waitingCapacity;
    private Integer confirmedAvailable;
    private Integer racAvailable;
    private Integer waitingAvailable;
}
