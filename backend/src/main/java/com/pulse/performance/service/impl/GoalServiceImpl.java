package com.pulse.performance.service.impl;

import com.pulse.performance.dto.request.GoalRequest;
import com.pulse.performance.entity.Employee;
import com.pulse.performance.entity.Goal;
import com.pulse.performance.entity.Kpi;
import com.pulse.performance.exception.ResourceNotFoundException;
import com.pulse.performance.repository.EmployeeRepository;
import com.pulse.performance.repository.GoalRepository;
import com.pulse.performance.repository.KpiRepository;
import com.pulse.performance.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;
    private final EmployeeRepository employeeRepository;
    private final KpiRepository kpiRepository;

    @Override
    public List<Goal> getAllGoals() {
        return goalRepository.findAll();
    }

    @Override
    public Goal getGoalById(Long id) {
        return goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal", "id", id));
    }

    @Override
    public List<Goal> getGoalsByEmployeeId(Long employeeId) {
        return goalRepository.findByEmployeeId(employeeId);
    }

    @Override
    public List<Goal> getGoalsByDepartmentId(Long departmentId) {
        return goalRepository.findByEmployeeDepartmentId(departmentId);
    }

    @Override
    @Transactional
    public Goal createGoal(GoalRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", request.getEmployeeId()));

        Goal goal = Goal.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .employee(employee)
                .startDate(request.getStartDate())
                .dueDate(request.getDueDate())
                .status(request.getStatus() != null ? request.getStatus() : Goal.GoalStatus.NOT_STARTED)
                .priority(request.getPriority() != null ? request.getPriority() : Goal.GoalPriority.MEDIUM)
                .progressPercentage(request.getProgressPercentage() != null ? request.getProgressPercentage() : 0.0)
                .weightage(request.getWeightage() != null ? request.getWeightage() : 1.0)
                .build();

        return goalRepository.save(goal);
    }

    @Override
    @Transactional
    public Goal updateGoal(Long id, GoalRequest request) {
        Goal goal = getGoalById(id);

        goal.setTitle(request.getTitle());
        goal.setDescription(request.getDescription());
        if (request.getStartDate() != null) goal.setStartDate(request.getStartDate());
        if (request.getDueDate() != null) goal.setDueDate(request.getDueDate());
        if (request.getStatus() != null) goal.setStatus(request.getStatus());
        if (request.getPriority() != null) goal.setPriority(request.getPriority());
        if (request.getProgressPercentage() != null) goal.setProgressPercentage(request.getProgressPercentage());
        if (request.getWeightage() != null) goal.setWeightage(request.getWeightage());

        return goalRepository.save(goal);
    }

    @Override
    @Transactional
    public void deleteGoal(Long id) {
        Goal goal = getGoalById(id);
        goalRepository.delete(goal);
    }

    @Override
    @Transactional
    public void recalculateGoalProgress(Long goalId) {
        Goal goal = getGoalById(goalId);
        List<Kpi> kpis = kpiRepository.findByGoalId(goalId);
        if (kpis.isEmpty()) return;

        double totalWeightedProgress = 0.0;
        double totalWeight = 0.0;

        for (Kpi kpi : kpis) {
            double weight = kpi.getWeight() != null && kpi.getWeight() > 0 ? kpi.getWeight() : 1.0;
            double achievement = kpi.getAchievementPercentage();
            totalWeightedProgress += Math.min(achievement, 100.0) * weight;
            totalWeight += weight;
        }

        double calculatedProgress = totalWeight > 0 ? (totalWeightedProgress / totalWeight) : 0.0;
        goal.setProgressPercentage(Math.round(calculatedProgress * 10.0) / 10.0);

        if (goal.getProgressPercentage() >= 100.0) {
            goal.setStatus(Goal.GoalStatus.COMPLETED);
        } else if (goal.getProgressPercentage() > 0.0 && goal.getStatus() == Goal.GoalStatus.NOT_STARTED) {
            goal.setStatus(Goal.GoalStatus.IN_PROGRESS);
        }

        goalRepository.save(goal);
    }
}
