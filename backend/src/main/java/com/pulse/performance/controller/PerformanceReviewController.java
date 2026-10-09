package com.pulse.performance.controller;

import com.pulse.performance.dto.request.PerformanceReviewRequest;
import com.pulse.performance.dto.response.ApiResponse;
import com.pulse.performance.entity.PerformanceReview;
import com.pulse.performance.service.PerformanceReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Performance Reviews", description = "Endpoints for formal appraisal reviews and score evaluations")
public class PerformanceReviewController {

    private final PerformanceReviewService performanceReviewService;

    @GetMapping
    @Operation(summary = "Get all performance reviews")
    public ResponseEntity<ApiResponse<List<PerformanceReview>>> getAllReviews() {
        return ResponseEntity.ok(ApiResponse.success(performanceReviewService.getAllReviews()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get review by ID")
    public ResponseEntity<ApiResponse<PerformanceReview>> getReviewById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(performanceReviewService.getReviewById(id)));
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get reviews for an employee")
    public ResponseEntity<ApiResponse<List<PerformanceReview>>> getReviewsByEmployeeId(@PathVariable Long employeeId) {
        return ResponseEntity.ok(ApiResponse.success(performanceReviewService.getReviewsByEmployeeId(employeeId)));
    }

    @GetMapping("/reviewer/{reviewerId}")
    @Operation(summary = "Get reviews conducted by a reviewer")
    public ResponseEntity<ApiResponse<List<PerformanceReview>>> getReviewsByReviewerId(@PathVariable Long reviewerId) {
        return ResponseEntity.ok(ApiResponse.success(performanceReviewService.getReviewsByReviewerId(reviewerId)));
    }

    @GetMapping("/cycle/{cycleId}")
    @Operation(summary = "Get reviews in a specific review cycle")
    public ResponseEntity<ApiResponse<List<PerformanceReview>>> getReviewsByCycleId(@PathVariable Long cycleId) {
        return ResponseEntity.ok(ApiResponse.success(performanceReviewService.getReviewsByCycleId(cycleId)));
    }

    @PostMapping
    @Operation(summary = "Create performance review")
    public ResponseEntity<ApiResponse<PerformanceReview>> createReview(@Valid @RequestBody PerformanceReviewRequest request) {
        PerformanceReview created = performanceReviewService.createReview(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Performance review created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update performance review")
    public ResponseEntity<ApiResponse<PerformanceReview>> updateReview(@PathVariable Long id, @Valid @RequestBody PerformanceReviewRequest request) {
        PerformanceReview updated = performanceReviewService.updateReview(id, request);
        return ResponseEntity.ok(ApiResponse.success("Performance review updated successfully", updated));
    }

    @PostMapping("/{id}/submit")
    @Operation(summary = "Submit performance review and calculate final composite score")
    public ResponseEntity<ApiResponse<PerformanceReview>> submitReview(@PathVariable Long id) {
        PerformanceReview submitted = performanceReviewService.submitReview(id);
        return ResponseEntity.ok(ApiResponse.success("Performance review submitted and evaluated", submitted));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete performance review")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        performanceReviewService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.success("Performance review deleted successfully", null));
    }
}
