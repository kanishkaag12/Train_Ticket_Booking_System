package com.railway.booking.service;

import com.railway.booking.dto.train.TrainRequest;
import com.railway.booking.dto.train.TrainResponse;
import com.railway.booking.entity.Passenger;
import com.railway.booking.entity.Train;
import com.railway.booking.enums.BookingStatus;
import com.railway.booking.exception.ResourceNotFoundException;
import com.railway.booking.repository.PassengerRepository;
import com.railway.booking.repository.TrainRepository;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrainService {

    private final TrainRepository trainRepository;
    private final PassengerRepository passengerRepository;

    @Cacheable(value = "train-search", key = "#source + ':' + #destination + ':' + #journeyDate + ':' + #page + ':' + #size")
    public Page<TrainResponse> search(String source, String destination, java.time.LocalDate journeyDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return trainRepository.findByActiveTrueAndSourceContainingIgnoreCaseAndDestinationContainingIgnoreCaseAndJourneyDate(
                        source.trim(), destination.trim(), journeyDate, pageable)
                .map(this::toResponse);
    }

    @Cacheable(value = "train-stations", key = "#journeyDate + ':' + #query")
    public List<String> getStations(java.time.LocalDate journeyDate, String query) {
        String normalizedQuery = query == null ? "" : query.trim().toLowerCase(Locale.ROOT);
        return trainRepository.findActiveTrainsForStations(journeyDate).stream()
                .flatMap(train -> java.util.stream.Stream.of(train.getSource(), train.getDestination()))
                .filter(station -> normalizedQuery.isBlank() || station.toLowerCase(Locale.ROOT).contains(normalizedQuery))
                .distinct()
                .sorted(String.CASE_INSENSITIVE_ORDER)
                .toList();
    }

    @CacheEvict(value = "train-search", allEntries = true)
    public TrainResponse createTrain(TrainRequest request) {
        Train train = new Train();
        apply(train, request);
        return toResponse(trainRepository.save(train));
    }

    @CacheEvict(value = "train-search", allEntries = true)
    public TrainResponse updateTrain(Long id, TrainRequest request) {
        Train train = trainRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Train not found"));
        apply(train, request);
        return toResponse(trainRepository.save(train));
    }

    @CacheEvict(value = "train-search", allEntries = true)
    public void deleteTrain(Long id) {
        Train train = trainRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Train not found"));
        train.setActive(false);
        trainRepository.save(train);
    }

    public List<TrainResponse> getAll() {
        return trainRepository.findAll().stream().map(this::toResponse).toList();
    }

    private void apply(Train train, TrainRequest request) {
        train.setTrainNumber(request.getTrainNumber());
        train.setTrainName(request.getTrainName());
        train.setSource(request.getSource());
        train.setDestination(request.getDestination());
        train.setJourneyDate(request.getJourneyDate());
        train.setDepartureTime(request.getDepartureTime());
        train.setArrivalTime(request.getArrivalTime());
        train.setConfirmedCapacity(request.getConfirmedCapacity());
        train.setRacCapacity(request.getRacCapacity());
        train.setWaitingCapacity(request.getWaitingCapacity());
        train.setFare(request.getFare());
        train.setActive(true);
    }

    private TrainResponse toResponse(Train train) {
        List<Passenger> passengers = passengerRepository.findActivePassengersForReallocation(train.getId(), train.getJourneyDate());
        long confirmedUsed = passengers.stream().filter(passenger -> passenger.getStatus() == BookingStatus.CNF).count();
        long racUsed = passengers.stream().filter(passenger -> passenger.getStatus() == BookingStatus.RAC).count();
        long wlUsed = passengers.stream().filter(passenger -> passenger.getStatus() == BookingStatus.WL).count();

        return TrainResponse.builder()
                .id(train.getId())
                .trainNumber(train.getTrainNumber())
                .trainName(train.getTrainName())
                .source(train.getSource())
                .destination(train.getDestination())
                .journeyDate(train.getJourneyDate())
                .departureTime(train.getDepartureTime())
                .arrivalTime(train.getArrivalTime())
                .fare(train.getFare())
                .confirmedCapacity(train.getConfirmedCapacity())
                .racCapacity(train.getRacCapacity())
                .waitingCapacity(train.getWaitingCapacity())
                .confirmedAvailable(Math.max(0, train.getConfirmedCapacity() - (int) confirmedUsed))
                .racAvailable(Math.max(0, train.getRacCapacity() - (int) racUsed))
                .waitingAvailable(Math.max(0, train.getWaitingCapacity() - (int) wlUsed))
                .build();
    }
}
