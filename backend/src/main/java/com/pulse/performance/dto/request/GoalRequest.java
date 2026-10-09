package com.pulse.performance.dto.request;

import com.pulse.performance.entity.Goal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class GoalRequest {
    @NotBlank(message = "Goal title is required")
    private String title;

    private String description;

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    private LocalDate startDate;
    private LocalDate dueDate;
    private Goal.GoalStatus status;
    private Goal.GoalPriority priority;
    private Double progressPercentage;
    private Double weightage;
}
