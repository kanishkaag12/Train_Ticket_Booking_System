package com.railway.booking.repository;

import com.railway.booking.entity.Train;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TrainRepository extends JpaRepository<Train, Long> {
    Page<Train> findByActiveTrueAndSourceContainingIgnoreCaseAndDestinationContainingIgnoreCaseAndJourneyDate(
            String source, String destination, LocalDate journeyDate, Pageable pageable);

    List<Train> findByJourneyDate(LocalDate journeyDate);

    Optional<Train> findByTrainNumber(String trainNumber);

    @Query("""
            select t from Train t
            where t.active = true
            and (:journeyDate is null or t.journeyDate = :journeyDate)
            """)
    List<Train> findActiveTrainsForStations(@Param("journeyDate") LocalDate journeyDate);
}
