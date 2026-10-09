package com.pulse.performance.dto.request;

import com.pulse.performance.entity.ReviewCycle;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ReviewCycleRequest {
    @NotBlank(message = "Cycle name is required")
    private String name;

    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private ReviewCycle.CycleStatus status;
}
