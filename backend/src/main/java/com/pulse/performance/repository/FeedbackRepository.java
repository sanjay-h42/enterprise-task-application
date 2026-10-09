package com.pulse.performance.repository;

import com.pulse.performance.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByEmployeeId(Long employeeId);
    List<Feedback> findByReviewerId(Long reviewerId);
    List<Feedback> findByReviewCycleId(Long reviewCycleId);
    List<Feedback> findByEmployeeIdAndReviewCycleId(Long employeeId, Long reviewCycleId);
}
