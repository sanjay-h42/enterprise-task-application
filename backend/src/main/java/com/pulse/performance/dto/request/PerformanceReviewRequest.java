package com.pulse.performance.dto.request;

import com.pulse.performance.entity.PerformanceReview;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PerformanceReviewRequest {
    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Reviewer ID is required")
    private Long reviewerId;

    @NotNull(message = "Review cycle ID is required")
    private Long reviewCycleId;

    private Double kpiScore;
    private Double feedbackScore;
    private Double managerRating;
    private Double selfRating;
    private String comments;
    private String developmentPlan;
    private PerformanceReview.ReviewStatus status;
}
