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

    // 🚀 FINAL: Route-based search (BIDIRECTIONAL, no date dependency)
    @Query("""
            SELECT t FROM Train t
            WHERE t.active = true
            AND (
                (LOWER(t.source) LIKE LOWER(CONCAT('%', :source, '%'))
                 AND LOWER(t.destination) LIKE LOWER(CONCAT('%', :destination, '%')))
                OR
                (LOWER(t.source) LIKE LOWER(CONCAT('%', :destination, '%'))
                 AND LOWER(t.destination) LIKE LOWER(CONCAT('%', :source, '%')))
            )
            """)
    Page<Train> findByRoute(
            @Param("source") String source,
            @Param("destination") String destination,
            Pageable pageable
    );

    // ✅ Optional: Keep for future use
    List<Train> findByJourneyDate(LocalDate journeyDate);

    Optional<Train> findByTrainNumber(String trainNumber);

    // ✅ Optional: Used for station listing (can keep or remove later)
    @Query("""
            SELECT t FROM Train t
            WHERE t.active = true
            AND (:journeyDate IS NULL OR t.journeyDate = :journeyDate)
            """)
    List<Train> findActiveTrainsForStations(@Param("journeyDate") LocalDate journeyDate);

    // 🚀 Autocomplete (SOURCE)
    @Query("""
            SELECT DISTINCT t.source FROM Train t
            WHERE LOWER(t.source) LIKE LOWER(CONCAT('%', :query, '%'))
            """)
    List<String> findSourceStations(@Param("query") String query);

    // 🚀 Autocomplete (DESTINATION)
    @Query("""
            SELECT DISTINCT t.destination FROM Train t
            WHERE LOWER(t.destination) LIKE LOWER(CONCAT('%', :query, '%'))
            """)
    List<String> findDestinationStations(@Param("query") String query);
}