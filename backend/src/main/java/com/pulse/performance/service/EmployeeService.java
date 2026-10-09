package com.pulse.performance.service;

import com.pulse.performance.dto.request.EmployeeRequest;
import com.pulse.performance.dto.response.EmployeePerformanceSummaryResponse;
import com.pulse.performance.entity.Employee;

import java.util.List;

public interface EmployeeService {
    List<Employee> getAllEmployees();
    Employee getEmployeeById(Long id);
    Employee getEmployeeByUserId(Long userId);
    List<Employee> getEmployeesByDepartment(Long departmentId);
    List<Employee> getDirectReports(Long managerId);
    List<Employee> searchEmployees(String query);
    Employee createEmployee(EmployeeRequest request);
    Employee updateEmployee(Long id, EmployeeRequest request);
    void deleteEmployee(Long id);
    EmployeePerformanceSummaryResponse getEmployeePerformanceSummary(Long id);
}
