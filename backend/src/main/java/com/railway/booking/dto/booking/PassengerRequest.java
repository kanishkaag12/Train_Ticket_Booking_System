package com.railway.booking.dto.booking;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PassengerRequest {

    @NotBlank
    private String name;

    @Min(1)
    @Max(120)
    private Integer age;

    @NotBlank
    private String gender;
}
