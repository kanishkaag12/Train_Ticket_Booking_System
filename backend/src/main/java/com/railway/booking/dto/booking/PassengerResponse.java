package com.railway.booking.dto.booking;

import com.railway.booking.enums.BookingStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PassengerResponse {
    private Long id;
    private String name;
    private Integer age;
    private String gender;
    private BookingStatus status;
    private String seatLabel;
    private Integer queueNumber;
}
