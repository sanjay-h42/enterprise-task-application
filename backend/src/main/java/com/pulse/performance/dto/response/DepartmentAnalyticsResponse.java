package com.pulse.performance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentAnalyticsResponse {
    private Long departmentId;
    private String departmentName;
    private String departmentCode;
    private long employeeCount;
    private double averagePerformanceScore;
    private double goalCompletionRate;
    private double kpiAchievementRate;
    private long activeGoalsCount;
}
