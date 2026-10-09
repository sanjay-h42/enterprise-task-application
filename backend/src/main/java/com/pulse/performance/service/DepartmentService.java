package com.pulse.performance.service;

import com.pulse.performance.dto.request.DepartmentRequest;
import com.pulse.performance.entity.Department;

import java.util.List;

public interface DepartmentService {
    List<Department> getAllDepartments();
    Department getDepartmentById(Long id);
    Department createDepartment(DepartmentRequest request);
    Department updateDepartment(Long id, DepartmentRequest request);
    void deleteDepartment(Long id);
}
