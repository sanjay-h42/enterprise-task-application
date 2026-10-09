package com.pulse.performance.service;

import com.pulse.performance.dto.request.PerformanceReviewRequest;
import com.pulse.performance.entity.PerformanceReview;

import java.util.List;

public interface PerformanceReviewService {
    List<PerformanceReview> getAllReviews();
    PerformanceReview getReviewById(Long id);
    List<PerformanceReview> getReviewsByEmployeeId(Long employeeId);
    List<PerformanceReview> getReviewsByReviewerId(Long reviewerId);
    List<PerformanceReview> getReviewsByCycleId(Long cycleId);
    PerformanceReview createReview(PerformanceReviewRequest request);
    PerformanceReview updateReview(Long id, PerformanceReviewRequest request);
    PerformanceReview submitReview(Long id);
    PerformanceReview calculateAndSaveFinalScore(Long id);
    void deleteReview(Long id);
}
