package com.pulse.performance.service;

import com.pulse.performance.dto.request.FeedbackRequest;
import com.pulse.performance.entity.Feedback;

import java.util.List;

public interface FeedbackService {
    List<Feedback> getAllFeedbacks();
    Feedback getFeedbackById(Long id);
    List<Feedback> getFeedbacksForEmployee(Long employeeId);
    List<Feedback> getFeedbacksGivenByReviewer(Long reviewerId);
    List<Feedback> getFeedbacksByCycle(Long cycleId);
    Feedback createFeedback(FeedbackRequest request);
    void deleteFeedback(Long id);
    Double calculateAverageFeedbackRating(Long employeeId);
}
