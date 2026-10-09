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
public class EmployeePerformanceSummaryResponse {
    private Long employeeId;
    private String employeeName;
    private String employeeCode;
    private String designation;
    private String departmentName;
    private String managerName;
    private Double overallRating;
    private Double kpiScore;
    private Double goalProgressAverage;
    private Double feedbackScore;
    private long totalGoals;
    private long completedGoals;
    private long totalKpis;
    private long totalFeedbacksReceived;
    private List<Map<String, Object>> recentFeedbacks;
    private List<Map<String, Object>> recentGoals;
}
