package com.pulse.performance.controller;

import com.pulse.performance.dto.request.EmployeeRequest;
import com.pulse.performance.dto.response.ApiResponse;
import com.pulse.performance.dto.response.EmployeePerformanceSummaryResponse;
import com.pulse.performance.entity.Employee;
import com.pulse.performance.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@Tag(name = "Employees", description = "Endpoints for employee lifecycle and performance summaries")
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    @Operation(summary = "Get all employees")
    public ResponseEntity<ApiResponse<List<Employee>>> getAllEmployees() {
        return ResponseEntity.ok(ApiResponse.success(employeeService.getAllEmployees()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get employee by ID")
    public ResponseEntity<ApiResponse<Employee>> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(employeeService.getEmployeeById(id)));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get employee profile by User ID")
    public ResponseEntity<ApiResponse<Employee>> getEmployeeByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(employeeService.getEmployeeByUserId(userId)));
    }

    @GetMapping("/department/{departmentId}")
    @Operation(summary = "Get employees by Department ID")
    public ResponseEntity<ApiResponse<List<Employee>>> getEmployeesByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(ApiResponse.success(employeeService.getEmployeesByDepartment(departmentId)));
    }

    @GetMapping("/manager/{managerId}")
    @Operation(summary = "Get direct reports of a Manager")
    public ResponseEntity<ApiResponse<List<Employee>>> getDirectReports(@PathVariable Long managerId) {
        return ResponseEntity.ok(ApiResponse.success(employeeService.getDirectReports(managerId)));
    }

    @GetMapping("/search")
    @Operation(summary = "Search employees by name, email, or designation")
    public ResponseEntity<ApiResponse<List<Employee>>> searchEmployees(@RequestParam String query) {
        return ResponseEntity.ok(ApiResponse.success(employeeService.searchEmployees(query)));
    }

    @GetMapping("/{id}/performance-summary")
    @Operation(summary = "Get aggregated 360 performance summary for an employee")
    public ResponseEntity<ApiResponse<EmployeePerformanceSummaryResponse>> getPerformanceSummary(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(employeeService.getEmployeePerformanceSummary(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Create an employee (Admin/Manager)")
    public ResponseEntity<ApiResponse<Employee>> createEmployee(@Valid @RequestBody EmployeeRequest request) {
        Employee created = employeeService.createEmployee(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Employee created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Update employee details (Admin/Manager)")
    public ResponseEntity<ApiResponse<Employee>> updateEmployee(@PathVariable Long id, @Valid @RequestBody EmployeeRequest request) {
        Employee updated = employeeService.updateEmployee(id, request);
        return ResponseEntity.ok(ApiResponse.success("Employee updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete employee (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(ApiResponse.success("Employee deleted successfully", null));
    }
}
