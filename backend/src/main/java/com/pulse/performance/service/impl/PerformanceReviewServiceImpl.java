package com.pulse.performance.service.impl;

import com.pulse.performance.dto.request.PerformanceReviewRequest;
import com.pulse.performance.entity.Employee;
import com.pulse.performance.entity.PerformanceReview;
import com.pulse.performance.entity.ReviewCycle;
import com.pulse.performance.exception.ResourceNotFoundException;
import com.pulse.performance.repository.EmployeeRepository;
import com.pulse.performance.repository.PerformanceReviewRepository;
import com.pulse.performance.repository.ReviewCycleRepository;
import com.pulse.performance.service.FeedbackService;
import com.pulse.performance.service.KpiService;
import com.pulse.performance.service.PerformanceReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PerformanceReviewServiceImpl implements PerformanceReviewService {

    private final PerformanceReviewRepository reviewRepository;
    private final EmployeeRepository employeeRepository;
    private final ReviewCycleRepository reviewCycleRepository;
    private final KpiService kpiService;
    private final FeedbackService feedbackService;

    @Override
    public List<PerformanceReview> getAllReviews() {
        return reviewRepository.findAll();
    }

    @Override
    public PerformanceReview getReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PerformanceReview", "id", id));
    }

    @Override
    public List<PerformanceReview> getReviewsByEmployeeId(Long employeeId) {
        return reviewRepository.findByEmployeeId(employeeId);
    }

    @Override
    public List<PerformanceReview> getReviewsByReviewerId(Long reviewerId) {
        return reviewRepository.findByReviewerId(reviewerId);
    }

    @Override
    public List<PerformanceReview> getReviewsByCycleId(Long cycleId) {
        return reviewRepository.findByReviewCycleId(cycleId);
    }

    @Override
    @Transactional
    public PerformanceReview createReview(PerformanceReviewRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", request.getEmployeeId()));

        Employee reviewer = employeeRepository.findById(request.getReviewerId())
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer", "id", request.getReviewerId()));

        ReviewCycle cycle = reviewCycleRepository.findById(request.getReviewCycleId())
                .orElseThrow(() -> new ResourceNotFoundException("ReviewCycle", "id", request.getReviewCycleId()));

        Double kpiScore = request.getKpiScore() != null ? request.getKpiScore() : kpiService.calculateEmployeeKpiScore(employee.getId());
        Double feedbackScore = request.getFeedbackScore() != null ? request.getFeedbackScore() : feedbackService.calculateAverageFeedbackRating(employee.getId());

        PerformanceReview review = PerformanceReview.builder()
                .employee(employee)
                .reviewer(reviewer)
                .reviewCycle(cycle)
                .kpiScore(kpiScore)
                .feedbackScore(feedbackScore)
                .managerRating(request.getManagerRating() != null ? request.getManagerRating() : 3.0)
                .selfRating(request.getSelfRating() != null ? request.getSelfRating() : 3.0)
                .comments(request.getComments())
                .developmentPlan(request.getDevelopmentPlan())
                .status(request.getStatus() != null ? request.getStatus() : PerformanceReview.ReviewStatus.DRAFT)
                .build();

        review.calculateFinalScore();
        return reviewRepository.save(review);
    }

    @Override
    @Transactional
    public PerformanceReview updateReview(Long id, PerformanceReviewRequest request) {
        PerformanceReview review = getReviewById(id);

        if (request.getKpiScore() != null) review.setKpiScore(request.getKpiScore());
        if (request.getFeedbackScore() != null) review.setFeedbackScore(request.getFeedbackScore());
        if (request.getManagerRating() != null) review.setManagerRating(request.getManagerRating());
        if (request.getSelfRating() != null) review.setSelfRating(request.getSelfRating());
        if (request.getComments() != null) review.setComments(request.getComments());
        if (request.getDevelopmentPlan() != null) review.setDevelopmentPlan(request.getDevelopmentPlan());
        if (request.getStatus() != null) review.setStatus(request.getStatus());

        review.calculateFinalScore();
        return reviewRepository.save(review);
    }

    @Override
    @Transactional
    public PerformanceReview submitReview(Long id) {
        PerformanceReview review = getReviewById(id);
        review.setStatus(PerformanceReview.ReviewStatus.SUBMITTED);
        review.calculateFinalScore();

        // Update employee's overall rating
        Employee employee = review.getEmployee();
        if (employee != null && review.getFinalScore() != null) {
            employee.setCurrentRating(Math.round(review.getFinalScore() * 10.0) / 10.0);
            employeeRepository.save(employee);
        }

        return reviewRepository.save(review);
    }

    @Override
    @Transactional
    public PerformanceReview calculateAndSaveFinalScore(Long id) {
        PerformanceReview review = getReviewById(id);
        review.calculateFinalScore();
        return reviewRepository.save(review);
    }

    @Override
    @Transactional
    public void deleteReview(Long id) {
        PerformanceReview review = getReviewById(id);
        reviewRepository.delete(review);
    }
}
