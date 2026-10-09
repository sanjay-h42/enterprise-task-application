package com.pulse.performance.service.impl;

import com.pulse.performance.dto.request.FeedbackRequest;
import com.pulse.performance.entity.Employee;
import com.pulse.performance.entity.Feedback;
import com.pulse.performance.entity.ReviewCycle;
import com.pulse.performance.exception.ResourceNotFoundException;
import com.pulse.performance.repository.EmployeeRepository;
import com.pulse.performance.repository.FeedbackRepository;
import com.pulse.performance.repository.ReviewCycleRepository;
import com.pulse.performance.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final EmployeeRepository employeeRepository;
    private final ReviewCycleRepository reviewCycleRepository;

    @Override
    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    @Override
    public Feedback getFeedbackById(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback", "id", id));
    }

    @Override
    public List<Feedback> getFeedbacksForEmployee(Long employeeId) {
        return feedbackRepository.findByEmployeeId(employeeId);
    }

    @Override
    public List<Feedback> getFeedbacksGivenByReviewer(Long reviewerId) {
        return feedbackRepository.findByReviewerId(reviewerId);
    }

    @Override
    public List<Feedback> getFeedbacksByCycle(Long cycleId) {
        return feedbackRepository.findByReviewCycleId(cycleId);
    }

    @Override
    @Transactional
    public Feedback createFeedback(FeedbackRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", request.getEmployeeId()));

        Employee reviewer = employeeRepository.findById(request.getReviewerId())
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer", "id", request.getReviewerId()));

        ReviewCycle cycle = null;
        if (request.getReviewCycleId() != null) {
            cycle = reviewCycleRepository.findById(request.getReviewCycleId()).orElse(null);
        }

        Feedback feedback = Feedback.builder()
                .employee(employee)
                .reviewer(reviewer)
                .reviewCycle(cycle)
                .feedbackType(request.getFeedbackType() != null ? request.getFeedbackType() : Feedback.FeedbackType.PEER)
                .rating(request.getRating() != null ? request.getRating() : 5)
                .comments(request.getComments())
                .strengths(request.getStrengths())
                .areasOfImprovement(request.getAreasOfImprovement())
                .isAnonymous(request.getIsAnonymous() != null ? request.getIsAnonymous() : false)
                .build();

        return feedbackRepository.save(feedback);
    }

    @Override
    @Transactional
    public void deleteFeedback(Long id) {
        Feedback feedback = getFeedbackById(id);
        feedbackRepository.delete(feedback);
    }

    @Override
    public Double calculateAverageFeedbackRating(Long employeeId) {
        List<Feedback> feedbacks = feedbackRepository.findByEmployeeId(employeeId);
        if (feedbacks.isEmpty()) return 0.0;

        return feedbacks.stream()
                .mapToInt(Feedback::getRating)
                .average()
                .orElse(0.0);
    }
}
