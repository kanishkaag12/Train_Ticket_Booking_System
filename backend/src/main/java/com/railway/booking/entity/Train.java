package com.railway.booking.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Train extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String trainNumber;

    @Column(nullable = false)
    private String trainName;

    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private LocalDate journeyDate;

    @Column(nullable = false)
    private LocalTime departureTime;

    @Column(nullable = false)
    private LocalTime arrivalTime;

    @Column(nullable = false)
    private Integer confirmedCapacity;

    @Column(nullable = false)
    private Integer racCapacity;

    @Column(nullable = false)
    private Integer waitingCapacity;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal fare;

    @Column(nullable = false)
    private Boolean active = true;

    @OneToMany(mappedBy = "train", fetch = FetchType.LAZY)
    private List<Booking> bookings = new ArrayList<>();
}
