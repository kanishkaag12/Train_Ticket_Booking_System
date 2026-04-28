package com.railway.booking.dto.booking;

import com.railway.booking.enums.QuotaType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingRequest {

    @NotNull
    private Long trainId;

    private QuotaType quotaType = QuotaType.GENERAL;

    @Valid
    @NotEmpty
    private List<PassengerRequest> passengers;
}
