package com.railway.booking.dto.train;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrainSearchRequest {

    @NotBlank
    private String source;

    @NotBlank
    private String destination;

    @NotNull
    private LocalDate journeyDate;
}
