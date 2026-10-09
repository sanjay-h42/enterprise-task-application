package com.pulse.performance.dto.request;

import com.pulse.performance.entity.Kpi;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class KpiRequest {
    @NotBlank(message = "KPI name is required")
    private String name;

    private String description;

    @NotNull(message = "Goal ID is required")
    private Long goalId;

    private Double targetValue;
    private Double currentValue;
    private String unit;
    private Double weight;
    private Kpi.KpiCategory category;
}
