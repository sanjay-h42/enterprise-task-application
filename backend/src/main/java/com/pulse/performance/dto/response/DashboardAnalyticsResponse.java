package com.pulse.performance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardAnalyticsResponse {
    private long totalEmployees;
    private long totalDepartments;
    private long totalActiveGoals;
    private long totalCompletedGoals;
    private double averageCompanyPerformance;
    private double goalCompletionRate;
    private double kpiAchievementRate;
    private long pendingReviewsCount;
    private long completedReviewsCount;
    private List<DepartmentAnalyticsResponse> departmentPerformance;
    private List<Map<String, Object>> topPerformers;
    private List<Map<String, Object>> performanceDistribution;
    private Map<String, Long> goalsByStatus;
}
