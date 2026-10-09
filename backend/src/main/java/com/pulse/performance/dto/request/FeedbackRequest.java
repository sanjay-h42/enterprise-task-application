package com.pulse.performance.dto.request;

import com.pulse.performance.entity.Feedback;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FeedbackRequest {
    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Reviewer ID is required")
    private Long reviewerId;

    private Long reviewCycleId;

    private Feedback.FeedbackType feedbackType;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;

    private String comments;
    private String strengths;
    private String areasOfImprovement;
    private Boolean isAnonymous;
}
