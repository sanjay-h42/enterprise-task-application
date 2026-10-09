package com.pulse.performance.service.impl;

import com.pulse.performance.dto.request.EmployeeRequest;
import com.pulse.performance.dto.response.EmployeePerformanceSummaryResponse;
import com.pulse.performance.entity.Department;
import com.pulse.performance.entity.Employee;
import com.pulse.performance.entity.Feedback;
import com.pulse.performance.entity.Goal;
import com.pulse.performance.exception.ResourceNotFoundException;
import com.pulse.performance.repository.DepartmentRepository;
import com.pulse.performance.repository.EmployeeRepository;
import com.pulse.performance.repository.FeedbackRepository;
import com.pulse.performance.repository.GoalRepository;
import com.pulse.performance.service.EmployeeService;
import com.pulse.performance.service.KpiService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final GoalRepository goalRepository;
    private final FeedbackRepository feedbackRepository;
    @Lazy
    private final KpiService kpiService;

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
    }

    @Override
    public Employee getEmployeeByUserId(Long userId) {
        return employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "userId", userId));
    }

    @Override
    public List<Employee> getEmployeesByDepartment(Long departmentId) {
        return employeeRepository.findByDepartmentId(departmentId);
    }

    @Override
    public List<Employee> getDirectReports(Long managerId) {
        return employeeRepository.findByManagerId(managerId);
    }

    @Override
    public List<Employee> searchEmployees(String query) {
        return employeeRepository.searchEmployees(query);
    }

    @Override
    @Transactional
    public Employee createEmployee(EmployeeRequest request) {
        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));
        }

        Employee manager = null;
        if (request.getManagerId() != null) {
            manager = employeeRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager", "id", request.getManagerId()));
        }

        Employee employee = Employee.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .workEmail(request.getWorkEmail())
                .phone(request.getPhone())
                .employeeCode(request.getEmployeeCode() != null ? request.getEmployeeCode() : "EMP-" + (System.currentTimeMillis() % 100000))
                .designation(request.getDesignation())
                .department(department)
                .manager(manager)
                .joiningDate(request.getJoiningDate())
                .status(request.getStatus() != null ? request.getStatus() : Employee.EmployeeStatus.ACTIVE)
                .currentRating(request.getCurrentRating() != null ? request.getCurrentRating() : 3.0)
                .build();

        return employeeRepository.save(employee);
    }

    @Override
    @Transactional
    public Employee updateEmployee(Long id, EmployeeRequest request) {
        Employee employee = getEmployeeById(id);

        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setWorkEmail(request.getWorkEmail());
        employee.setPhone(request.getPhone());
        if (request.getDesignation() != null) {
            employee.setDesignation(request.getDesignation());
        }

        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));
            employee.setDepartment(department);
        }

        if (request.getManagerId() != null) {
            Employee manager = employeeRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager", "id", request.getManagerId()));
            employee.setManager(manager);
        }

        if (request.getStatus() != null) {
            employee.setStatus(request.getStatus());
        }

        if (request.getCurrentRating() != null) {
            employee.setCurrentRating(request.getCurrentRating());
        }

        return employeeRepository.save(employee);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);
        employeeRepository.delete(employee);
    }

    @Override
    public EmployeePerformanceSummaryResponse getEmployeePerformanceSummary(Long id) {
        Employee employee = getEmployeeById(id);
        List<Goal> goals = goalRepository.findByEmployeeId(id);
        List<Feedback> feedbacks = feedbackRepository.findByEmployeeId(id);

        long completedGoals = goals.stream().filter(g -> g.getStatus() == Goal.GoalStatus.COMPLETED).count();
        double goalProgressAverage = goals.isEmpty() ? 0.0 :
                goals.stream().mapToDouble(Goal::getProgressPercentage).average().orElse(0.0);

        double feedbackScore = feedbacks.isEmpty() ? 0.0 :
                feedbacks.stream().mapToInt(Feedback::getRating).average().orElse(0.0);

        Double kpiScore = kpiService.calculateEmployeeKpiScore(id);

        List<Map<String, Object>> recentGoals = goals.stream().limit(5).map(g -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", g.getId());
            map.put("title", g.getTitle());
            map.put("progress", g.getProgressPercentage());
            map.put("status", g.getStatus());
            map.put("dueDate", g.getDueDate());
            return map;
        }).collect(Collectors.toList());

        List<Map<String, Object>> recentFeedbacks = feedbacks.stream().limit(5).map(f -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", f.getId());
            map.put("rating", f.getRating());
            map.put("comments", f.getComments());
            map.put("type", f.getFeedbackType());
            map.put("reviewerName", f.getIsAnonymous() ? "Anonymous" :
                    (f.getReviewer() != null ? f.getReviewer().getFirstName() + " " + f.getReviewer().getLastName() : "Reviewer"));
            return map;
        }).collect(Collectors.toList());

        return EmployeePerformanceSummaryResponse.builder()
                .employeeId(employee.getId())
                .employeeName(employee.getFirstName() + " " + employee.getLastName())
                .employeeCode(employee.getEmployeeCode())
                .designation(employee.getDesignation())
                .departmentName(employee.getDepartment() != null ? employee.getDepartment().getName() : "Unassigned")
                .managerName(employee.getManager() != null ? employee.getManager().getFirstName() + " " + employee.getManager().getLastName() : "None")
                .overallRating(employee.getCurrentRating())
                .kpiScore(Math.round(kpiScore * 10.0) / 10.0)
                .goalProgressAverage(Math.round(goalProgressAverage * 10.0) / 10.0)
                .feedbackScore(Math.round(feedbackScore * 10.0) / 10.0)
                .totalGoals(goals.size())
                .completedGoals(completedGoals)
                .totalKpis(kpiService.getKpisByEmployeeId(id).size())
                .totalFeedbacksReceived(feedbacks.size())
                .recentFeedbacks(recentFeedbacks)
                .recentGoals(recentGoals)
                .build();
    }
}
