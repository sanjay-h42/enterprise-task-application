package com.pulse.performance.service;

import com.pulse.performance.dto.request.ReviewCycleRequest;
import com.pulse.performance.entity.ReviewCycle;

import java.util.List;

public interface ReviewCycleService {
    List<ReviewCycle> getAllReviewCycles();
    ReviewCycle getReviewCycleById(Long id);
    ReviewCycle getActiveCycle();
    ReviewCycle createReviewCycle(ReviewCycleRequest request);
    ReviewCycle updateReviewCycle(Long id, ReviewCycleRequest request);
    ReviewCycle changeCycleStatus(Long id, ReviewCycle.CycleStatus status);
    void deleteReviewCycle(Long id);
}
