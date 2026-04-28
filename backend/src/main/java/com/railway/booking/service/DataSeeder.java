package com.railway.booking.service;

import com.railway.booking.entity.Train;
import com.railway.booking.entity.User;
import com.railway.booking.enums.Role;
import com.railway.booking.repository.TrainRepository;
import com.railway.booking.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TrainRepository trainRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedTrains();
    }

    private void seedUsers() {
        if (userRepository.existsByEmail("admin@railway.com")) {
            return;
        }

        User admin = new User();
        admin.setFullName("System Admin");
        admin.setEmail("admin@railway.com");
        admin.setPhoneNumber("9999999999");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setRole(Role.ROLE_ADMIN);
        userRepository.save(admin);

        User user = new User();
        user.setFullName("Rahul Passenger");
        user.setEmail("user@railway.com");
        user.setPhoneNumber("8888888888");
        user.setPassword(passwordEncoder.encode("User@123"));
        user.setRole(Role.ROLE_USER);
        userRepository.save(user);
    }

    private void seedTrains() {
        if (trainRepository.count() > 0) {
            return;
        }

        trainRepository.save(buildTrain("12002", "Shatabdi Express", "New Delhi", "Bhopal", 1, "06:00", "13:00", 20, 6, 8, "1450"));
        trainRepository.save(buildTrain("12952", "Mumbai Rajdhani", "New Delhi", "Mumbai Central", 1, "16:55", "08:35", 18, 4, 8, "2450"));
        trainRepository.save(buildTrain("12302", "Howrah Rajdhani", "New Delhi", "Howrah", 2, "16:10", "10:05", 24, 8, 10, "2600"));
        trainRepository.save(buildTrain("12628", "Karnataka Express", "New Delhi", "Bengaluru", 2, "20:20", "08:40", 28, 8, 12, "2280"));
    }

    private Train buildTrain(String number, String name, String source, String destination, int plusDays,
                             String departure, String arrival, int confirmed, int rac, int waitlist, String fare) {
        Train train = new Train();
        train.setTrainNumber(number);
        train.setTrainName(name);
        train.setSource(source);
        train.setDestination(destination);
        train.setJourneyDate(LocalDate.now().plusDays(plusDays));
        train.setDepartureTime(LocalTime.parse(departure));
        train.setArrivalTime(LocalTime.parse(arrival));
        train.setConfirmedCapacity(confirmed);
        train.setRacCapacity(rac);
        train.setWaitingCapacity(waitlist);
        train.setFare(new BigDecimal(fare));
        train.setActive(true);
        return train;
    }
}
