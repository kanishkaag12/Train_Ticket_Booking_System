package com.railway.booking.service;

import com.railway.booking.dto.booking.BookingRequest;
import com.railway.booking.dto.booking.BookingResponse;
import com.railway.booking.dto.booking.PassengerRequest;
import com.railway.booking.dto.booking.PassengerResponse;
import com.railway.booking.entity.Booking;
import com.railway.booking.entity.Passenger;
import com.railway.booking.entity.Payment;
import com.railway.booking.entity.Train;
import com.railway.booking.entity.User;
import com.railway.booking.enums.BookingStatus;
import com.railway.booking.enums.PaymentStatus;
import com.railway.booking.enums.QuotaType;
import com.railway.booking.exception.BadRequestException;
import com.railway.booking.exception.ResourceNotFoundException;
import com.railway.booking.repository.BookingRepository;
import com.railway.booking.repository.PassengerRepository;
import com.railway.booking.repository.PaymentRepository;
import com.railway.booking.repository.TrainRepository;
import com.railway.booking.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PassengerRepository passengerRepository;
    private final PaymentRepository paymentRepository;
    private final TrainRepository trainRepository;
    private final UserRepository userRepository;

    @Transactional
    public BookingResponse createBooking(String userEmail, BookingRequest request) {
        User user = userRepository.findByEmail(userEmail.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Train train = trainRepository.findById(request.getTrainId())
                .orElseThrow(() -> new ResourceNotFoundException("Train not found"));

        int capacity = train.getConfirmedCapacity() + train.getRacCapacity() + train.getWaitingCapacity();
        int activePassengerCount = passengerRepository.findActivePassengersForReallocation(train.getId(), train.getJourneyDate()).size();
        if (activePassengerCount + request.getPassengers().size() > capacity) {
            throw new BadRequestException("Selected train is fully booked for the requested date");
        }

        Booking booking = new Booking();
        booking.setPnrNumber(generatePnr());
        booking.setUser(user);
        booking.setTrain(train);
        booking.setJourneyDate(train.getJourneyDate());
        booking.setQuotaType(request.getQuotaType() == null ? QuotaType.GENERAL : request.getQuotaType());
        booking.setTotalFare(train.getFare().multiply(BigDecimal.valueOf(request.getPassengers().size())));
        booking.setNotificationMessage("Booking created. Status will auto-upgrade on cancellations.");

        List<Passenger> passengers = new ArrayList<>();
        for (PassengerRequest passengerRequest : request.getPassengers()) {
            Passenger passenger = new Passenger();
            passenger.setBooking(booking);
            passenger.setName(passengerRequest.getName());
            passenger.setAge(passengerRequest.getAge());
            passenger.setGender(passengerRequest.getGender());
            passenger.setStatus(BookingStatus.WL);
            passengers.add(passenger);
        }
        booking.setPassengers(passengers);

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(booking.getTotalFare());
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setTransactionReference("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setPayment(payment);

        Booking savedBooking = bookingRepository.save(booking);
        reallocateStatuses(train.getId(), train.getJourneyDate());
        log.info("Created booking {} for train {}", savedBooking.getPnrNumber(), train.getTrainNumber());
        return toResponse(bookingRepository.findByPnrNumber(savedBooking.getPnrNumber()).orElse(savedBooking));
    }

    public List<BookingResponse> getUserBookings(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream().map(this::toResponse).toList();
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    public BookingResponse getByPnr(String pnrNumber) {
        return bookingRepository.findByPnrNumber(pnrNumber)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }

    @Transactional
    public BookingResponse cancelBooking(String pnrNumber, String email) {
        Booking booking = bookingRepository.findByPnrNumber(pnrNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        boolean isAdmin = userRepository.findByEmail(email.toLowerCase())
                .map(user -> user.getRole().name().equals("ROLE_ADMIN"))
                .orElse(false);

        if (!booking.getUser().getEmail().equalsIgnoreCase(email) && !isAdmin) {
            throw new BadRequestException("You are not allowed to cancel this booking");
        }

        if (booking.getCancelled()) {
            throw new BadRequestException("Booking is already cancelled");
        }

        booking.setCancelled(true);
        booking.setNotificationMessage("Booking cancelled. Auto-refund initiated and waitlist upgraded.");
        booking.getPassengers().forEach(passenger -> {
            passenger.setCancelled(true);
            passenger.setStatus(BookingStatus.CANCELLED);
            passenger.setSeatLabel(null);
            passenger.setQueueNumber(null);
        });
        if (booking.getPayment() != null) {
            booking.getPayment().setStatus(PaymentStatus.REFUNDED);
        }
        bookingRepository.save(booking);
        reallocateStatuses(booking.getTrain().getId(), booking.getJourneyDate());
        log.info("Cancelled booking {}", pnrNumber);
        return toResponse(booking);
    }

    @Transactional
    public void reallocateStatuses(Long trainId, LocalDate journeyDate) {
        Train train = trainRepository.findById(trainId)
                .orElseThrow(() -> new ResourceNotFoundException("Train not found"));
        List<Passenger> activePassengers = passengerRepository.findActivePassengersForReallocation(trainId, journeyDate);
        activePassengers.sort(Comparator
                .comparing((Passenger passenger) -> passenger.getBooking().getCreatedAt())
                .thenComparing(Passenger::getId));

        int confirmedIndex = 1;
        int racIndex = 1;
        int wlIndex = 1;

        List<Passenger> cnfAssigned = new ArrayList<>();
        List<Passenger> generalOverflow = new ArrayList<>();
        List<Passenger> tqwlOverflow = new ArrayList<>();

        for (Passenger passenger : activePassengers) {
            passenger.setSeatLabel(null);
            passenger.setQueueNumber(null);
            if (cnfAssigned.size() < train.getConfirmedCapacity()) {
                passenger.setStatus(BookingStatus.CNF);
                passenger.setSeatLabel("B1-" + confirmedIndex++);
                cnfAssigned.add(passenger);
                continue;
            }

            if (passenger.getBooking().getQuotaType() == QuotaType.TQWL) {
                tqwlOverflow.add(passenger);
            } else {
                generalOverflow.add(passenger);
            }
        }

        int racAssigned = 0;
        for (Passenger passenger : generalOverflow) {
            if (racAssigned < train.getRacCapacity()) {
                passenger.setStatus(BookingStatus.RAC);
                passenger.setSeatLabel("RAC-" + racIndex);
                passenger.setQueueNumber(racIndex++);
                racAssigned++;
            } else {
                passenger.setStatus(BookingStatus.WL);
                passenger.setSeatLabel("WL-" + wlIndex);
                passenger.setQueueNumber(wlIndex++);
            }
        }

        for (Passenger passenger : tqwlOverflow) {
            passenger.setStatus(BookingStatus.WL);
            passenger.setSeatLabel("TQWL-" + wlIndex);
            passenger.setQueueNumber(wlIndex++);
        }

        passengerRepository.saveAll(activePassengers);

        // Clamp overflow if admin lowered capacity below active demand.
        int maxWaitlist = train.getWaitingCapacity();
        List<Passenger> waitlisted = activePassengers.stream().filter(passenger -> passenger.getStatus() == BookingStatus.WL).toList();
        for (int i = 0; i < waitlisted.size(); i++) {
            Passenger passenger = waitlisted.get(i);
            if (i < maxWaitlist) {
                passenger.setQueueNumber(i + 1);
                if (passenger.getBooking().getQuotaType() == QuotaType.TQWL) {
                    passenger.setSeatLabel("TQWL-" + (i + 1));
                } else {
                    passenger.setSeatLabel("WL-" + (i + 1));
                }
            } else {
                passenger.setCancelled(true);
                passenger.setStatus(BookingStatus.CANCELLED);
                passenger.setSeatLabel(null);
                passenger.setQueueNumber(null);
                passenger.getBooking().setNotificationMessage("Capacity changed by admin. Passenger auto-cancelled and refunded.");
                Payment payment = passenger.getBooking().getPayment();
                if (payment != null) {
                    payment.setStatus(PaymentStatus.REFUNDED);
                    paymentRepository.save(payment);
                }
            }
        }
        passengerRepository.saveAll(activePassengers);
    }

    private String generatePnr() {
        return String.valueOf(System.currentTimeMillis()).substring(4) + (int) (Math.random() * 90 + 10);
    }

    private BookingResponse toResponse(Booking booking) {
        List<PassengerResponse> passengers = booking.getPassengers().stream()
                .map(passenger -> PassengerResponse.builder()
                        .id(passenger.getId())
                        .name(passenger.getName())
                        .age(passenger.getAge())
                        .gender(passenger.getGender())
                        .status(passenger.getStatus())
                        .seatLabel(passenger.getSeatLabel())
                        .queueNumber(passenger.getQueueNumber())
                        .build())
                .toList();

        String summary = passengers.stream()
                .filter(passenger -> passenger.getStatus() != BookingStatus.CANCELLED)
                .collect(java.util.stream.Collectors.groupingBy(PassengerResponse::getStatus, java.util.stream.Collectors.counting()))
                .entrySet().stream()
                .sorted(java.util.Map.Entry.comparingByKey())
                .map(entry -> entry.getKey() + ":" + entry.getValue())
                .reduce((left, right) -> left + ", " + right)
                .orElse("CANCELLED");

        return BookingResponse.builder()
                .id(booking.getId())
                .pnrNumber(booking.getPnrNumber())
                .trainNumber(booking.getTrain().getTrainNumber())
                .trainName(booking.getTrain().getTrainName())
                .source(booking.getTrain().getSource())
                .destination(booking.getTrain().getDestination())
                .journeyDate(booking.getJourneyDate())
                .departureTime(booking.getTrain().getDepartureTime())
                .arrivalTime(booking.getTrain().getArrivalTime())
                .quotaType(booking.getQuotaType())
                .totalFare(booking.getTotalFare())
                .cancelled(booking.getCancelled())
                .bookingStatusSummary(summary)
                .notificationMessage(booking.getNotificationMessage())
                .paymentStatus(booking.getPayment() == null ? PaymentStatus.PENDING : booking.getPayment().getStatus())
                .createdAt(booking.getCreatedAt())
                .passengers(passengers)
                .build();
    }
}
