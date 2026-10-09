package com.pulse.performance.service.impl;

import com.pulse.performance.dto.request.KpiRequest;
import com.pulse.performance.entity.Employee;
import com.pulse.performance.entity.Goal;
import com.pulse.performance.entity.Kpi;
import com.pulse.performance.exception.ResourceNotFoundException;
import com.pulse.performance.repository.EmployeeRepository;
import com.pulse.performance.repository.GoalRepository;
import com.pulse.performance.repository.KpiRepository;
import com.pulse.performance.service.GoalService;
import com.pulse.performance.service.KpiService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KpiServiceImpl implements KpiService {

    private final KpiRepository kpiRepository;
    private final GoalRepository goalRepository;
    private final EmployeeRepository employeeRepository;
    @Lazy
    private final GoalService goalService;

    @Override
    public List<Kpi> getAllKpis() {
        return kpiRepository.findAll();
    }

    @Override
    public Kpi getKpiById(Long id) {
        return kpiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("KPI", "id", id));
    }

    @Override
    public List<Kpi> getKpisByGoalId(Long goalId) {
        return kpiRepository.findByGoalId(goalId);
    }

    @Override
    public List<Kpi> getKpisByEmployeeId(Long employeeId) {
        return kpiRepository.findByGoalEmployeeId(employeeId);
    }

    @Override
    @Transactional
    public Kpi createKpi(KpiRequest request) {
        Goal goal = goalRepository.findById(request.getGoalId())
                .orElseThrow(() -> new ResourceNotFoundException("Goal", "id", request.getGoalId()));

        Kpi kpi = Kpi.builder()
                .name(request.getName())
                .description(request.getDescription())
                .goal(goal)
                .targetValue(request.getTargetValue() != null ? request.getTargetValue() : 100.0)
                .currentValue(request.getCurrentValue() != null ? request.getCurrentValue() : 0.0)
                .unit(request.getUnit() != null ? request.getUnit() : "%")
                .weight(request.getWeight() != null ? request.getWeight() : 1.0)
                .category(request.getCategory() != null ? request.getCategory() : Kpi.KpiCategory.QUALITY)
                .build();

        Kpi saved = kpiRepository.save(kpi);
        goalService.recalculateGoalProgress(goal.getId());
        updateEmployeeOverallRating(goal.getEmployee().getId());
        return saved;
    }

    @Override
    @Transactional
    public Kpi updateKpi(Long id, KpiRequest request) {
        Kpi kpi = getKpiById(id);

        kpi.setName(request.getName());
        kpi.setDescription(request.getDescription());
        if (request.getTargetValue() != null) kpi.setTargetValue(request.getTargetValue());
        if (request.getCurrentValue() != null) kpi.setCurrentValue(request.getCurrentValue());
        if (request.getUnit() != null) kpi.setUnit(request.getUnit());
        if (request.getWeight() != null) kpi.setWeight(request.getWeight());
        if (request.getCategory() != null) kpi.setCategory(request.getCategory());

        Kpi saved = kpiRepository.save(kpi);
        goalService.recalculateGoalProgress(kpi.getGoal().getId());
        updateEmployeeOverallRating(kpi.getGoal().getEmployee().getId());
        return saved;
    }

    @Override
    @Transactional
    public Kpi updateKpiProgress(Long id, Double currentValue) {
        Kpi kpi = getKpiById(id);
        kpi.setCurrentValue(currentValue);

        Kpi saved = kpiRepository.save(kpi);
        goalService.recalculateGoalProgress(kpi.getGoal().getId());
        updateEmployeeOverallRating(kpi.getGoal().getEmployee().getId());
        return saved;
    }

    @Override
    @Transactional
    public void deleteKpi(Long id) {
        Kpi kpi = getKpiById(id);
        Long goalId = kpi.getGoal().getId();
        Long employeeId = kpi.getGoal().getEmployee().getId();

        kpiRepository.delete(kpi);
        goalService.recalculateGoalProgress(goalId);
        updateEmployeeOverallRating(employeeId);
    }

    @Override
    public Double calculateEmployeeKpiScore(Long employeeId) {
        List<Kpi> kpis = kpiRepository.findByGoalEmployeeId(employeeId);
        if (kpis.isEmpty()) return 0.0;

        double totalWeightedScore = 0.0;
        double totalWeight = 0.0;

        for (Kpi kpi : kpis) {
            double weight = kpi.getWeight() != null && kpi.getWeight() > 0 ? kpi.getWeight() : 1.0;
            double achievement = kpi.getAchievementPercentage();
            totalWeightedScore += achievement * weight;
            totalWeight += weight;
        }

        return totalWeight > 0 ? (totalWeightedScore / totalWeight) : 0.0;
    }

    private void updateEmployeeOverallRating(Long employeeId) {
        try {
            Employee employee = employeeRepository.findById(employeeId).orElse(null);
            if (employee == null) return;

            Double kpiScore = calculateEmployeeKpiScore(employeeId);
            // Convert 0-100% KPI score into 1-5 scale rating
            double rating = Math.min(5.0, Math.max(1.0, (kpiScore / 20.0)));
            employee.setCurrentRating(Math.round(rating * 10.0) / 10.0);
            employeeRepository.save(employee);
        } catch (Exception ignored) {
        }
    }
}
