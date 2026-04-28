package com.railway.booking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class RailwayBookingApplication {

    public static void main(String[] args) {
        SpringApplication.run(RailwayBookingApplication.class, args);
    }
}
