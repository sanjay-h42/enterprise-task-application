package com.pulse.performance.repository;

import com.pulse.performance.entity.ReviewCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewCycleRepository extends JpaRepository<ReviewCycle, Long> {
    List<ReviewCycle> findByStatus(ReviewCycle.CycleStatus status);
    Optional<ReviewCycle> findFirstByStatusOrderByStartDateDesc(ReviewCycle.CycleStatus status);
}
