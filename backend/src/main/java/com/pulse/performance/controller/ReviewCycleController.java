package com.pulse.performance.controller;

import com.pulse.performance.dto.request.ReviewCycleRequest;
import com.pulse.performance.dto.response.ApiResponse;
import com.pulse.performance.entity.ReviewCycle;
import com.pulse.performance.service.ReviewCycleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review-cycles")
@RequiredArgsConstructor
@Tag(name = "Review Cycles", description = "Endpoints for managing appraisal and review cycles")
public class ReviewCycleController {

    private final ReviewCycleService reviewCycleService;

    @GetMapping
    @Operation(summary = "Get all review cycles")
    public ResponseEntity<ApiResponse<List<ReviewCycle>>> getAllReviewCycles() {
        return ResponseEntity.ok(ApiResponse.success(reviewCycleService.getAllReviewCycles()));
    }

    @GetMapping("/active")
    @Operation(summary = "Get currently active review cycle")
    public ResponseEntity<ApiResponse<ReviewCycle>> getActiveCycle() {
        return ResponseEntity.ok(ApiResponse.success(reviewCycleService.getActiveCycle()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get review cycle by ID")
    public ResponseEntity<ApiResponse<ReviewCycle>> getReviewCycleById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(reviewCycleService.getReviewCycleById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create review cycle (Admin only)")
    public ResponseEntity<ApiResponse<ReviewCycle>> createReviewCycle(@Valid @RequestBody ReviewCycleRequest request) {
        ReviewCycle created = reviewCycleService.createReviewCycle(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review cycle created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update review cycle (Admin only)")
    public ResponseEntity<ApiResponse<ReviewCycle>> updateReviewCycle(@PathVariable Long id, @Valid @RequestBody ReviewCycleRequest request) {
        ReviewCycle updated = reviewCycleService.updateReviewCycle(id, request);
        return ResponseEntity.ok(ApiResponse.success("Review cycle updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Change review cycle status (Admin only)")
    public ResponseEntity<ApiResponse<ReviewCycle>> changeCycleStatus(@PathVariable Long id, @RequestParam ReviewCycle.CycleStatus status) {
        ReviewCycle updated = reviewCycleService.changeCycleStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Review cycle status updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete review cycle (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteReviewCycle(@PathVariable Long id) {
        reviewCycleService.deleteReviewCycle(id);
        return ResponseEntity.ok(ApiResponse.success("Review cycle deleted successfully", null));
    }
}
