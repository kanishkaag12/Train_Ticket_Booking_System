package com.railway.booking.dto.train;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrainRequest {

    @NotBlank
    private String trainNumber;

    @NotBlank
    private String trainName;

    @NotBlank
    private String source;

    @NotBlank
    private String destination;

    @NotNull
    private LocalDate journeyDate;

    @NotNull
    private LocalTime departureTime;

    @NotNull
    private LocalTime arrivalTime;

    @NotNull
    @Min(1)
    private Integer confirmedCapacity;

    @NotNull
    @Min(0)
    private Integer racCapacity;

    @NotNull
    @Min(0)
    private Integer waitingCapacity;

    @NotNull
    @Min(1)
    private BigDecimal fare;
}
