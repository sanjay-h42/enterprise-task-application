package com.pulse.performance.controller;

import com.pulse.performance.dto.request.FeedbackRequest;
import com.pulse.performance.dto.response.ApiResponse;
import com.pulse.performance.entity.Feedback;
import com.pulse.performance.service.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
@Tag(name = "Feedback", description = "Endpoints for 360-degree feedback, peer reviews, and ratings")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @GetMapping
    @Operation(summary = "Get all feedback entries")
    public ResponseEntity<ApiResponse<List<Feedback>>> getAllFeedbacks() {
        return ResponseEntity.ok(ApiResponse.success(feedbackService.getAllFeedbacks()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get feedback by ID")
    public ResponseEntity<ApiResponse<Feedback>> getFeedbackById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(feedbackService.getFeedbackById(id)));
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get all feedback received by an employee")
    public ResponseEntity<ApiResponse<List<Feedback>>> getFeedbacksForEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success(feedbackService.getFeedbacksForEmployee(employeeId)));
    }

    @GetMapping("/reviewer/{reviewerId}")
    @Operation(summary = "Get all feedback submitted by a reviewer")
    public ResponseEntity<ApiResponse<List<Feedback>>> getFeedbacksGivenByReviewer(@PathVariable Long reviewerId) {
        return ResponseEntity.ok(ApiResponse.success(feedbackService.getFeedbacksGivenByReviewer(reviewerId)));
    }

    @GetMapping("/cycle/{cycleId}")
    @Operation(summary = "Get feedback entries for a review cycle")
    public ResponseEntity<ApiResponse<List<Feedback>>> getFeedbacksByCycle(@PathVariable Long cycleId) {
        return ResponseEntity.ok(ApiResponse.success(feedbackService.getFeedbacksByCycle(cycleId)));
    }

    @GetMapping("/employee/{employeeId}/average-rating")
    @Operation(summary = "Get average feedback rating for an employee")
    public ResponseEntity<ApiResponse<Map<String, Double>>> getAverageRating(@PathVariable Long employeeId) {
        Double avg = feedbackService.calculateAverageFeedbackRating(employeeId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("averageRating", Math.round(avg * 10.0) / 10.0)));
    }

    @PostMapping
    @Operation(summary = "Submit new feedback")
    public ResponseEntity<ApiResponse<Feedback>> createFeedback(@Valid @RequestBody FeedbackRequest request) {
        Feedback created = feedbackService.createFeedback(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Feedback submitted successfully", created));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete feedback")
    public ResponseEntity<ApiResponse<Void>> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.ok(ApiResponse.success("Feedback deleted successfully", null));
    }
}
