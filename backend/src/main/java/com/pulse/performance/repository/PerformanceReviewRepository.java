package com.pulse.performance.repository;

import com.pulse.performance.entity.PerformanceReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PerformanceReviewRepository extends JpaRepository<PerformanceReview, Long> {
    List<PerformanceReview> findByEmployeeId(Long employeeId);
    List<PerformanceReview> findByReviewerId(Long reviewerId);
    List<PerformanceReview> findByReviewCycleId(Long reviewCycleId);
    Optional<PerformanceReview> findByEmployeeIdAndReviewCycleId(Long employeeId, Long reviewCycleId);
    List<PerformanceReview> findByEmployeeDepartmentIdAndReviewCycleId(Long departmentId, Long reviewCycleId);
}
