package com.pulse.performance.service.impl;

import com.pulse.performance.dto.response.DashboardAnalyticsResponse;
import com.pulse.performance.dto.response.DepartmentAnalyticsResponse;
import com.pulse.performance.entity.Department;
import com.pulse.performance.entity.Employee;
import com.pulse.performance.entity.Goal;
import com.pulse.performance.entity.Kpi;
import com.pulse.performance.entity.PerformanceReview;
import com.pulse.performance.repository.DepartmentRepository;
import com.pulse.performance.repository.EmployeeRepository;
import com.pulse.performance.repository.GoalRepository;
import com.pulse.performance.repository.KpiRepository;
import com.pulse.performance.repository.PerformanceReviewRepository;
import com.pulse.performance.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final GoalRepository goalRepository;
    private final KpiRepository kpiRepository;
    private final PerformanceReviewRepository reviewRepository;

    @Override
    public DashboardAnalyticsResponse getDashboardAnalytics() {
        List<Employee> employees = employeeRepository.findAll();
        List<Department> departments = departmentRepository.findAll();
        List<Goal> goals = goalRepository.findAll();
        List<Kpi> kpis = kpiRepository.findAll();
        List<PerformanceReview> reviews = reviewRepository.findAll();

        long totalEmployees = employees.size();
        long totalDepartments = departments.size();

        long totalActiveGoals = goals.stream()
                .filter(g -> g.getStatus() == Goal.GoalStatus.IN_PROGRESS || g.getStatus() == Goal.GoalStatus.NOT_STARTED)
                .count();

        long totalCompletedGoals = goals.stream()
                .filter(g -> g.getStatus() == Goal.GoalStatus.COMPLETED)
                .count();

        double goalCompletionRate = goals.isEmpty() ? 0.0 :
                Math.round(((double) totalCompletedGoals / goals.size()) * 1000.0) / 10.0;

        double avgCompanyPerformance = employees.isEmpty() ? 0.0 :
                Math.round(employees.stream().mapToDouble(e -> e.getCurrentRating() != null ? e.getCurrentRating() : 0.0).average().orElse(0.0) * 10.0) / 10.0;

        double kpiAchievementRate = kpis.isEmpty() ? 0.0 :
                Math.round(kpis.stream().mapToDouble(Kpi::getAchievementPercentage).average().orElse(0.0) * 10.0) / 10.0;

        long pendingReviewsCount = reviews.stream()
                .filter(r -> r.getStatus() == PerformanceReview.ReviewStatus.DRAFT || r.getStatus() == PerformanceReview.ReviewStatus.SUBMITTED)
                .count();

        long completedReviewsCount = reviews.stream()
                .filter(r -> r.getStatus() == PerformanceReview.ReviewStatus.APPROVED || r.getStatus() == PerformanceReview.ReviewStatus.COMPLETED)
                .count();

        List<DepartmentAnalyticsResponse> deptAnalytics = getDepartmentAnalytics();

        List<Map<String, Object>> topPerformers = employees.stream()
                .sorted((e1, e2) -> Double.compare(
                        e2.getCurrentRating() != null ? e2.getCurrentRating() : 0.0,
                        e1.getCurrentRating() != null ? e1.getCurrentRating() : 0.0
                ))
                .limit(5)
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", e.getId());
                    map.put("name", e.getFirstName() + " " + e.getLastName());
                    map.put("designation", e.getDesignation());
                    map.put("department", e.getDepartment() != null ? e.getDepartment().getName() : "General");
                    map.put("rating", e.getCurrentRating());
                    return map;
                })
                .collect(Collectors.toList());

        Map<String, Long> goalsByStatus = goals.stream()
                .collect(Collectors.groupingBy(g -> g.getStatus().name(), Collectors.counting()));

        List<Map<String, Object>> distribution = new ArrayList<>();
        long topCount = employees.stream().filter(e -> e.getCurrentRating() != null && e.getCurrentRating() >= 4.5).count();
        long goodCount = employees.stream().filter(e -> e.getCurrentRating() != null && e.getCurrentRating() >= 3.5 && e.getCurrentRating() < 4.5).count();
        long avgCount = employees.stream().filter(e -> e.getCurrentRating() != null && e.getCurrentRating() >= 2.5 && e.getCurrentRating() < 3.5).count();
        long needImpCount = employees.stream().filter(e -> e.getCurrentRating() != null && e.getCurrentRating() < 2.5).count();

        distribution.add(Map.of("tier", "Exceptional (4.5 - 5.0)", "count", topCount));
        distribution.add(Map.of("tier", "Exceeds Expectations (3.5 - 4.4)", "count", goodCount));
        distribution.add(Map.of("tier", "Meets Expectations (2.5 - 3.4)", "count", avgCount));
        distribution.add(Map.of("tier", "Needs Improvement (< 2.5)", "count", needImpCount));

        return DashboardAnalyticsResponse.builder()
                .totalEmployees(totalEmployees)
                .totalDepartments(totalDepartments)
                .totalActiveGoals(totalActiveGoals)
                .totalCompletedGoals(totalCompletedGoals)
                .averageCompanyPerformance(avgCompanyPerformance)
                .goalCompletionRate(goalCompletionRate)
                .kpiAchievementRate(kpiAchievementRate)
                .pendingReviewsCount(pendingReviewsCount)
                .completedReviewsCount(completedReviewsCount)
                .departmentPerformance(deptAnalytics)
                .topPerformers(topPerformers)
                .performanceDistribution(distribution)
                .goalsByStatus(goalsByStatus)
                .build();
    }

    @Override
    public List<DepartmentAnalyticsResponse> getDepartmentAnalytics() {
        List<Department> departments = departmentRepository.findAll();
        return departments.stream()
                .map(this::mapDepartmentAnalytics)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentAnalyticsResponse getDepartmentAnalyticsById(Long departmentId) {
        Department department = departmentRepository.findById(departmentId).orElse(null);
        if (department == null) return null;
        return mapDepartmentAnalytics(department);
    }

    private DepartmentAnalyticsResponse mapDepartmentAnalytics(Department dept) {
        List<Employee> employees = dept.getEmployees() != null ? dept.getEmployees() : employeeRepository.findByDepartmentId(dept.getId());
        List<Goal> deptGoals = goalRepository.findByEmployeeDepartmentId(dept.getId());

        double avgRating = employees.isEmpty() ? 0.0 :
                Math.round(employees.stream().mapToDouble(e -> e.getCurrentRating() != null ? e.getCurrentRating() : 0.0).average().orElse(0.0) * 10.0) / 10.0;

        long completedGoals = deptGoals.stream().filter(g -> g.getStatus() == Goal.GoalStatus.COMPLETED).count();
        long activeGoals = deptGoals.stream().filter(g -> g.getStatus() == Goal.GoalStatus.IN_PROGRESS).count();
        double completionRate = deptGoals.isEmpty() ? 0.0 :
                Math.round(((double) completedGoals / deptGoals.size()) * 1000.0) / 10.0;

        double kpiAvg = deptGoals.stream()
                .filter(g -> g.getKpis() != null)
                .flatMap(g -> g.getKpis().stream())
                .mapToDouble(Kpi::getAchievementPercentage)
                .average()
                .orElse(0.0);

        return DepartmentAnalyticsResponse.builder()
                .departmentId(dept.getId())
                .departmentName(dept.getName())
                .departmentCode(dept.getCode())
                .employeeCount(employees.size())
                .averagePerformanceScore(avgRating)
                .goalCompletionRate(completionRate)
                .kpiAchievementRate(Math.round(kpiAvg * 10.0) / 10.0)
                .activeGoalsCount(activeGoals)
                .build();
    }
}
