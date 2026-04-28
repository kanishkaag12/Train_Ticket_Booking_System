package com.railway.booking.repository;

import com.railway.booking.entity.Booking;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @EntityGraph(attributePaths = {"train", "passengers", "payment", "user"})
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    @EntityGraph(attributePaths = {"train", "passengers", "payment", "user"})
    List<Booking> findAllByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"train", "passengers", "payment", "user"})
    Optional<Booking> findByPnrNumber(String pnrNumber);
}
