package com.railway.booking.repository;

import com.railway.booking.entity.Passenger;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PassengerRepository extends JpaRepository<Passenger, Long> {

    @Query("""
            select p from Passenger p
            join fetch p.booking b
            join fetch b.train t
            where t.id = :trainId and b.journeyDate = :journeyDate and p.cancelled = false and b.cancelled = false
            order by b.createdAt asc, p.id asc
            """)
    List<Passenger> findActivePassengersForReallocation(@Param("trainId") Long trainId, @Param("journeyDate") LocalDate journeyDate);
}
