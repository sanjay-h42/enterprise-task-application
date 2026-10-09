package com.pulse.performance.service.impl;

import com.pulse.performance.dto.request.DepartmentRequest;
import com.pulse.performance.entity.Department;
import com.pulse.performance.exception.ResourceNotFoundException;
import com.pulse.performance.repository.DepartmentRepository;
import com.pulse.performance.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Override
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Override
    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
    }

    @Override
    @Transactional
    public Department createDepartment(DepartmentRequest request) {
        Department department = Department.builder()
                .name(request.getName())
                .code(request.getCode() != null ? request.getCode() : request.getName().toUpperCase().replaceAll("\\s+", "_"))
                .description(request.getDescription())
                .build();
        return departmentRepository.save(department);
    }

    @Override
    @Transactional
    public Department updateDepartment(Long id, DepartmentRequest request) {
        Department department = getDepartmentById(id);
        department.setName(request.getName());
        if (request.getCode() != null) {
            department.setCode(request.getCode());
        }
        if (request.getDescription() != null) {
            department.setDescription(request.getDescription());
        }
        return departmentRepository.save(department);
    }

    @Override
    @Transactional
    public void deleteDepartment(Long id) {
        Department department = getDepartmentById(id);
        departmentRepository.delete(department);
    }
}
