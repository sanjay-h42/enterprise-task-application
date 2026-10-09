package com.pulse.performance.service;

import com.pulse.performance.dto.request.GoalRequest;
import com.pulse.performance.entity.Goal;

import java.util.List;

public interface GoalService {
    List<Goal> getAllGoals();
    Goal getGoalById(Long id);
    List<Goal> getGoalsByEmployeeId(Long employeeId);
    List<Goal> getGoalsByDepartmentId(Long departmentId);
    Goal createGoal(GoalRequest request);
    Goal updateGoal(Long id, GoalRequest request);
    void deleteGoal(Long id);
    void recalculateGoalProgress(Long goalId);
}
